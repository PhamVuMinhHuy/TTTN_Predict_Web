import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { adminService } from "../services/adminService";
import {
  adminPage,
  adminContainer,
  adminHeader,
  adminHeaderTitle,
  adminHeaderSubtitle,
  adminHeaderRight,
  adminRoleText,
  adminTag,
  logoutButton,
  logoutButtonHover,
  adminGrid,
  card,
  cardTitleRow,
  cardTitle,
  badge,
  tableWrapper,
  table,
  tableHeadRow,
  th,
  td,
  tdCenter,
  row,
  rowHover,
  roleUser,
  roleAdmin,
  userSelfTag,
  deleteButton,
  deleteButtonHover,
  emptyState,
  errorText,
  form,
  formRow,
  formGroup,
  label,
  input,
  inputFocus,
  select,
  submitButton,
  submitButtonDisabled,
  submitButtonHover,
  helpText,
} from "../../assets/styles/adminDashboard.styles";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "student",
    class_name: "", // <-- thêm
  });
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredDelete, setHoveredDelete] = useState(null);

  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setError(null);
      const result = await adminService.getUsers();
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.error);
      }
      setLoadingUsers(false);
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Gửi cả class_name (backend sẽ bỏ qua nếu role=admin)
    const result = await adminService.createUser(formData);
    if (result.success) {
      const list = await adminService.getUsers();
      if (list.success) {
        setUsers(list.data);
      }
      setFormData({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: "student",
        class_name: "", // reset
      });
    } else {
      setError(result.error);
    }

    setSubmitting(false);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;

    const result = await adminService.deleteUser(id);
    if (result.success) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      alert(result.error);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div style={adminPage}>
      <div style={adminContainer}>
        {/* Header */}
        <div style={adminHeader}>
          <div>
            <h1 style={adminHeaderTitle}>Admin Dashboard</h1>
            <p style={adminHeaderSubtitle}>
              Quản lý tài khoản người dùng trong hệ thống
            </p>
          </div>
          <div style={adminHeaderRight}>
            <div style={adminRoleText}>
              <span style={adminTag}>Admin</span>{" "}
              <span>Đã đăng nhập: {user.username}</span>
            </div>

            <button
              onClick={logout}
              style={{
                ...logoutButton,
                ...(hoverLogout ? logoutButtonHover : {}),
              }}
              onMouseEnter={() => setHoverLogout(true)}
              onMouseLeave={() => setHoverLogout(false)}
            >
              🚪 Đăng xuất
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div style={adminGrid}>
          {/* User list card */}
          <div style={card}>
            <div style={cardTitleRow}>
              <h2 style={cardTitle}>Danh sách người dùng</h2>
              <span style={badge}>{users.length} tài khoản</span>
            </div>

            {loadingUsers ? (
              <div style={emptyState}>Đang tải danh sách người dùng...</div>
            ) : error ? (
              <>
                <div style={emptyState}>
                  Không thể tải danh sách người dùng.
                </div>
                <div style={errorText}>Lỗi: {error}</div>
              </>
            ) : users.length === 0 ? (
              <div style={emptyState}>
                Chưa có người dùng nào trong hệ thống.
              </div>
            ) : (
              <div style={tableWrapper}>
                <table style={table}>
                  <thead>
                    <tr style={tableHeadRow}>
                      <th style={th}>Username</th>
                      <th style={th}>Email</th>
                      <th style={th}>Họ tên</th>
                      <th style={th}>Role</th>
                      <th style={th}>Lớp</th> {/* <-- thêm */}
                      <th style={th}>Ngày tạo</th>
                      <th style={{ ...th, textAlign: "center" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        style={{
                          ...row,
                          ...(hoveredRow === u.id ? rowHover : {}),
                        }}
                        onMouseEnter={() => setHoveredRow(u.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td style={td}>{u.username}</td>
                        <td style={td}>{u.email || "-"}</td>
                        <td style={td}>
                          {(u.first_name || u.last_name) &&
                          `${u.first_name || ""} ${u.last_name || ""}`.trim()
                            ? `${u.first_name || ""} ${
                                u.last_name || ""
                              }`.trim()
                            : "-"}
                        </td>
                        <td style={td}>
                          {u.role === "admin" && (
                            <span style={roleAdmin}>Admin</span>
                          )}
                          {u.role === "teacher" && (
                            <span style={roleUser}>Teacher</span>
                          )}
                          {u.role === "student" && (
                            <span style={roleUser}>Student</span>
                          )}
                        </td>
                        <td style={td}>{u.class_name || "-"}</td>{" "}
                        {/* <-- thêm */}
                        <td style={td}>
                          {u.date_joined
                            ? new Date(u.date_joined).toLocaleDateString(
                                "vi-VN"
                              )
                            : "-"}
                        </td>
                        <td style={tdCenter}>
                          {u.id === user.id ? (
                            <span style={userSelfTag}>(tài khoản của bạn)</span>
                          ) : (
                            <button
                              style={{
                                ...deleteButton,
                                ...(hoveredDelete === u.id
                                  ? deleteButtonHover
                                  : {}),
                              }}
                              onMouseEnter={() => setHoveredDelete(u.id)}
                              onMouseLeave={() => setHoveredDelete(null)}
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              Xóa
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Create user card */}
          <div style={card}>
            <div style={cardTitleRow}>
              <h2 style={cardTitle}>Thêm tài khoản mới</h2>
            </div>
            <form onSubmit={handleCreateUser} style={form}>
              <div style={formRow}>
                <div style={formGroup}>
                  <label style={label} htmlFor="username">
                    Username *
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...input,
                      ...(focusedField === "username" ? inputFocus : {}),
                    }}
                    placeholder="admin01"
                    required
                  />
                </div>
                <div style={formGroup}>
                  <label style={label} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...input,
                      ...(focusedField === "email" ? inputFocus : {}),
                    }}
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div style={formRow}>
                <div style={formGroup}>
                  <label style={label} htmlFor="first_name">
                    Tên
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("first_name")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...input,
                      ...(focusedField === "first_name" ? inputFocus : {}),
                    }}
                    placeholder="Nguyễn Văn"
                  />
                </div>
                <div style={formGroup}>
                  <label style={label} htmlFor="last_name">
                    Họ
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("last_name")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...input,
                      ...(focusedField === "last_name" ? inputFocus : {}),
                    }}
                    placeholder="A"
                  />
                </div>
              </div>

              {/* Trường Lớp - chỉ áp dụng cho student/teacher */}
              <div style={formGroup}>
                <label style={label} htmlFor="class_name">
                  Lớp (chỉ dành cho học sinh / giáo viên)
                </label>
                <input
                  id="class_name"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("class_name")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...input,
                    ...(focusedField === "class_name" ? inputFocus : {}),
                  }}
                  placeholder="VD: 10A1, 12A3..."
                  disabled={formData.role === "admin"} // <-- admin không cần lớp
                />
                <div style={helpText}>
                  Trường này chỉ dùng để quản lý học sinh và giáo viên theo lớp.
                  Tài khoản Admin không cần nhập lớp.
                </div>
              </div>

              <div style={formGroup}>
                <label style={label} htmlFor="password">
                  Mật khẩu *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...input,
                    ...(focusedField === "password" ? inputFocus : {}),
                  }}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                />
              </div>

              <div style={formGroup}>
                <label style={label} htmlFor="role">
                  Quyền
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("role")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...select,
                    ...(focusedField === "role" ? inputFocus : {}),
                  }}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
                <div style={helpText}>
                  - Student: tài khoản học sinh/sinh viên
                  <br />- Teacher: tài khoản giáo viên
                  <br />- Admin: có quyền quản trị hệ thống
                </div>
              </div>

              {error && <div style={errorText}>Lỗi: {error}</div>}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...submitButton,
                  ...(submitting ? submitButtonDisabled : {}),
                  ...(hoverSubmit && !submitting ? submitButtonHover : {}),
                }}
                onMouseEnter={() => setHoverSubmit(true)}
                onMouseLeave={() => setHoverSubmit(false)}
              >
                {submitting ? "Đang tạo..." : "Tạo tài khoản"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
