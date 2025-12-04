import React, { useEffect, useState, useMemo } from "react";
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
  statsGrid,
  statCard,
  statCardHover,
  statCardHeader,
  statCardIcon,
  statCardTitle,
  statCardValue,
  adminGrid,
  card,
  cardTitleRow,
  cardTitle,
  badge,
  searchContainer,
  searchInput,
  searchInputFocus,
  classFilterContainer,
  classFilterTitle,
  classChipsWrapper,
  classChip,
  classChipHover,
  classChipActive,
  clearFilterButton,
  clearFilterButtonHover,
  tableWrapper,
  table,
  tableHeadRow,
  th,
  td,
  tdCenter,
  row,
  rowHover,
  roleStudent,
  roleTeacher,
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
  loadingContainer,
  toastContainer,
  toastSuccess,
  toastError,
  toastWarning,
  toastIcon,
  toastMessage,
  toastClose,
  toastCloseHover,
  modalOverlay,
  modal,
  modalHeader,
  modalIcon,
  modalTitle,
  modalBody,
  modalFooter,
  modalButtonCancel,
  modalButtonCancelHover,
  modalButtonConfirm,
  modalButtonConfirmHover,
} from "../../assets/styles/adminDashboard.styles";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "student",
    class_name: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredDelete, setHoveredDelete] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null); // null = all, 'student', 'teacher', 'admin'
  const [classFilter, setClassFilter] = useState(null); // null = all, or specific class name

  // Toast notification state
  const [toasts, setToasts] = useState([]);
  const [toastIdCounter, setToastIdCounter] = useState(0);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState(null);
  const [hoverModalCancel, setHoverModalCancel] = useState(false);
  const [hoverModalConfirm, setHoverModalConfirm] = useState(false);
  const [hoverToastClose, setHoverToastClose] = useState(null);
  const [hoveredClassChip, setHoveredClassChip] = useState(null);
  const [hoverClearFilter, setHoverClearFilter] = useState(false);

  // Classes modal state
  const [showClassesModal, setShowClassesModal] = useState(false);

  // Toast notification functions
  const showToast = (message, type = "info") => {
    const id = toastIdCounter;
    setToastIdCounter((prev) => prev + 1);

    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showConfirmModal = (title, message, onConfirm) => {
    setConfirmModal({ title, message, onConfirm });
  };

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

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

  // Get unique classes from users
  const availableClasses = useMemo(() => {
    const classes = users
      .map((u) => u.class_name)
      .filter((className) => className && className.trim() !== "");
    return [...new Set(classes)].sort();
  }, [users]);

  // Get classes with their homeroom teachers
  const classesWithTeachers = useMemo(() => {
    return availableClasses.map((className) => {
      const teacher = users.find(
        (u) => u.role === "teacher" && u.class_name === className
      );
      const studentCount = users.filter(
        (u) => u.role === "student" && u.class_name === className
      ).length;
      
      return {
        className,
        teacher: teacher
          ? `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() || teacher.username
          : "Chưa có",
        teacherEmail: teacher?.email || "-",
        studentCount,
      };
    });
  }, [availableClasses, users]);

  // Statistics calculations
  const statistics = useMemo(() => {
    const totalUsers = users.length;
    const students = users.filter((u) => u.role === "student").length;
    const teachers = users.filter((u) => u.role === "teacher").length;
    const admins = users.filter((u) => u.role === "admin").length;
    const totalClasses = availableClasses.length;

    return { totalUsers, students, teachers, admins, totalClasses };
  }, [users, availableClasses]);

  // Filtered users based on search, role filter, and class filter
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply role filter first
    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // Apply class filter
    if (classFilter) {
      filtered = filtered.filter((u) => u.class_name === classFilter);
    }

    // Then apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.username?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query) ||
          u.first_name?.toLowerCase().includes(query) ||
          u.last_name?.toLowerCase().includes(query) ||
          u.class_name?.toLowerCase().includes(query) ||
          u.role?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [users, searchQuery, roleFilter, classFilter]);

  // Handle statistics card click to filter by role
  const handleRoleFilter = (role) => {
    if (roleFilter === role) {
      // If clicking the same filter, clear it
      setRoleFilter(null);
    } else {
      setRoleFilter(role);
    }
  };

  // Handle class filter
  const handleClassFilter = (className) => {
    if (classFilter === className) {
      // If clicking the same filter, clear it
      setClassFilter(null);
    } else {
      setClassFilter(className);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

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
        class_name: "",
      });
      showToast(
        `✅ Tạo tài khoản "${formData.username}" thành công!`,
        "success"
      );
    } else {
      setError(result.error);
      showToast(`❌ Lỗi: ${result.error}`, "error");
    }

    setSubmitting(false);
  };

  const handleDeleteUser = async (userId, username) => {
    showConfirmModal(
      "⚠️ Xác nhận xóa người dùng",
      `Bạn có chắc chắn muốn xóa tài khoản "${username}"? Hành động này không thể hoàn tác.`,
      async () => {
        closeConfirmModal();

        const result = await adminService.deleteUser(userId);
        if (result.success) {
          setUsers((prev) => prev.filter((u) => u.id !== userId));
          showToast(`✅ Đã xóa tài khoản "${username}" thành công!`, "success");
        } else {
          showToast(`❌ Lỗi khi xóa: ${result.error}`, "error");
        }
      }
    );
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "admin":
        return roleAdmin;
      case "teacher":
        return roleTeacher;
      case "student":
        return roleStudent;
      default:
        return roleStudent;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "teacher":
        return "Giáo viên";
      case "student":
        return "Học sinh";
      default:
        return role;
    }
  };

  const getToastStyle = (type) => {
    switch (type) {
      case "success":
        return toastSuccess;
      case "error":
        return toastError;
      case "warning":
        return toastWarning;
      default:
        return toastSuccess;
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
            <h1 style={adminHeaderTitle}>🎯 Admin Dashboard</h1>
            <p style={adminHeaderSubtitle}>
              Quản lý tài khoản người dùng trong hệ thống
            </p>
          </div>
          <div style={adminHeaderRight}>
            <div style={adminRoleText}>
              <span style={adminTag}>ADMIN</span>
              <span>{user.username}</span>
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

        {/* Statistics Cards */}
        <div style={statsGrid}>
          <div
            onClick={() => handleRoleFilter(null)}
            style={{
              ...statCard,
              ...(hoveredStat === "total" ? statCardHover : {}),
              cursor: 'pointer',
              ...(roleFilter === null ? { boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)', transform: 'translateY(-2px)' } : {}),
            }}
            onMouseEnter={() => setHoveredStat("total")}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div style={statCardHeader}>
              <div>
                <div style={statCardTitle}>Tổng người dùng</div>
                <div style={statCardValue}>{statistics.totalUsers}</div>
              </div>
              <div
                style={{
                  ...statCardIcon,
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "#ffffff",
                }}
              >
                👥
              </div>
            </div>
          </div>

          <div
            onClick={() => handleRoleFilter('student')}
            style={{
              ...statCard,
              ...(hoveredStat === "students" ? statCardHover : {}),
              cursor: 'pointer',
              ...(roleFilter === 'student' ? { boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)', transform: 'translateY(-2px)' } : {}),
            }}
            onMouseEnter={() => setHoveredStat("students")}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div style={statCardHeader}>
              <div>
                <div style={statCardTitle}>Học sinh</div>
                <div style={statCardValue}>{statistics.students}</div>
              </div>
              <div
                style={{
                  ...statCardIcon,
                  background:
                    "linear-gradient(135deg, #10b981 0%, #047857 100%)",
                  color: "#ffffff",
                }}
              >
                🎓
              </div>
            </div>
          </div>

          <div
            onClick={() => handleRoleFilter('teacher')}
            style={{
              ...statCard,
              ...(hoveredStat === "teachers" ? statCardHover : {}),
              cursor: 'pointer',
              ...(roleFilter === 'teacher' ? { boxShadow: '0 8px 20px rgba(168, 85, 247, 0.4)', transform: 'translateY(-2px)' } : {}),
            }}
            onMouseEnter={() => setHoveredStat("teachers")}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div style={statCardHeader}>
              <div>
                <div style={statCardTitle}>Giáo viên</div>
                <div style={statCardValue}>{statistics.teachers}</div>
              </div>
              <div
                style={{
                  ...statCardIcon,
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                  color: "#ffffff",
                }}
              >
                👨‍🏫
              </div>
            </div>
          </div>

          <div
            onClick={() => handleRoleFilter('admin')}
            style={{
              ...statCard,
              ...(hoveredStat === "admins" ? statCardHover : {}),
              cursor: 'pointer',
              ...(roleFilter === 'admin' ? { boxShadow: '0 8px 20px rgba(249, 115, 22, 0.4)', transform: 'translateY(-2px)' } : {}),
            }}
            onMouseEnter={() => setHoveredStat("admins")}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div style={statCardHeader}>
              <div>
                <div style={statCardTitle}>Quản trị viên</div>
                <div style={statCardValue}>{statistics.admins}</div>
              </div>
              <div
                style={{
                  ...statCardIcon,
                  background:
                    "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                  color: "#ffffff",
                }}
              >
                👑
              </div>
            </div>
          </div>

          <div
            onClick={() => setShowClassesModal(true)}
            style={{
              ...statCard,
              ...(hoveredStat === "classes" ? statCardHover : {}),
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredStat("classes")}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div style={statCardHeader}>
              <div>
                <div style={statCardTitle}>Tổng số lớp</div>
                <div style={statCardValue}>{statistics.totalClasses}</div>
              </div>
              <div
                style={{
                  ...statCardIcon,
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                  color: "#ffffff",
                }}
              >
                🏫
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div style={adminGrid}>
          {/* User list card */}
          <div style={card}>
            <div style={cardTitleRow}>
              <h2 style={cardTitle}>📋 Danh sách người dùng</h2>
              <span style={badge}>{filteredUsers.length}</span>
            </div>

            {/* Search bar */}
            <div style={searchContainer}>
              <input
                type="text"
                placeholder="🔍 Tìm kiếm theo tên, email, lớp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setFocusedField("search")}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...searchInput,
                  ...(focusedField === "search" ? searchInputFocus : {}),
                }}
              />
            </div>

            {loadingUsers ? (
              <div style={loadingContainer}>
                <div
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    border: "3px solid #e5e7eb",
                    borderTop: "3px solid #3b82f6",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <span>Đang tải danh sách người dùng...</span>
              </div>
            ) : error ? (
              <>
                <div style={emptyState}>
                  ⚠️ Không thể tải danh sách người dùng.
                </div>
                <div style={errorText}>Lỗi: {error}</div>
              </>
            ) : filteredUsers.length === 0 ? (
              <div style={emptyState}>
                {searchQuery
                  ? "🔍 Không tìm thấy người dùng phù hợp."
                  : "📭 Chưa có người dùng nào trong hệ thống."}
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
                      <th style={th}>Lớp</th>
                      <th style={th}>Ngày tạo</th>
                      <th style={{ ...th, textAlign: "center" }}>
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        style={{
                          ...row,
                          ...(hoveredRow === u.id ? rowHover : {}),
                        }}
                        onMouseEnter={() => setHoveredRow(u.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td style={td}>
                          <strong>{u.username}</strong>
                        </td>
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
                          <span style={getRoleBadgeStyle(u.role)}>
                            {getRoleLabel(u.role)}
                          </span>
                        </td>
                        <td style={td}>{u.class_name || "-"}</td>
                        <td style={td}>
                          {u.date_joined
                            ? new Date(u.date_joined).toLocaleDateString(
                                "vi-VN"
                              )
                            : "-"}
                        </td>
                        <td style={tdCenter}>
                          {u.id === user.id ? (
                            <span style={userSelfTag}>
                              (tài khoản của bạn)
                            </span>
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
                              onClick={() => handleDeleteUser(u.id, u.username)}
                            >
                              🗑️ Xóa
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
              <h2 style={cardTitle}>➕ Thêm tài khoản mới</h2>
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

              <div style={formGroup}>
                <label style={label} htmlFor="role">
                  Quyền *
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
                  <option value="student">🎓 Student (Học sinh)</option>
                  <option value="teacher">👨‍🏫 Teacher (Giáo viên)</option>
                  <option value="admin">👑 Admin (Quản trị viên)</option>
                </select>
              </div>

              {/* Class field - only for student/teacher */}
              {formData.role !== "admin" && (
                <div style={formGroup}>
                  <label style={label} htmlFor="class_name">
                    Lớp {formData.role === "student" ? "*" : ""}
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
                    required={formData.role === "student"}
                  />
                  <div style={helpText}>
                    {formData.role === "student"
                      ? "Vui lòng nhập lớp của học sinh"
                      : "Nhập lớp chủ nhiệm (nếu có)"}
                  </div>
                </div>
              )}

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

              {error && <div style={errorText}>❌ Lỗi: {error}</div>}

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
                {submitting ? "⏳ Đang tạo..." : "✅ Tạo tài khoản"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div style={toastContainer}>
          {toasts.map((toast) => (
            <div key={toast.id} style={getToastStyle(toast.type)}>
              <div style={toastMessage}>{toast.message}</div>
              <button
                style={{
                  ...toastClose,
                  ...(hoverToastClose === toast.id ? toastCloseHover : {}),
                }}
                onMouseEnter={() => setHoverToastClose(toast.id)}
                onMouseLeave={() => setHoverToastClose(null)}
                onClick={() => removeToast(toast.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div style={modalOverlay} onClick={closeConfirmModal}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <div style={modalIcon}>⚠️</div>
              <h3 style={modalTitle}>{confirmModal.title}</h3>
            </div>
            <div style={modalBody}>{confirmModal.message}</div>
            <div style={modalFooter}>
              <button
                style={{
                  ...modalButtonCancel,
                  ...(hoverModalCancel ? modalButtonCancelHover : {}),
                }}
                onMouseEnter={() => setHoverModalCancel(true)}
                onMouseLeave={() => setHoverModalCancel(false)}
                onClick={closeConfirmModal}
              >
                Hủy
              </button>
              <button
                style={{
                  ...modalButtonConfirm,
                  ...(hoverModalConfirm ? modalButtonConfirmHover : {}),
                }}
                onMouseEnter={() => setHoverModalConfirm(true)}
                onMouseLeave={() => setHoverModalConfirm(false)}
                onClick={confirmModal.onConfirm}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes scaleIn {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>

      {/* Classes Overview Modal */}
      {showClassesModal && (
        <div style={modalOverlay} onClick={() => setShowClassesModal(false)}>
          <div
            style={{
              ...modal,
              maxWidth: '700px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalHeader}>
              <div style={modalIcon}>🏫</div>
              <h3 style={modalTitle}>Danh sách các lớp và giáo viên chủ nhiệm</h3>
            </div>
            <div style={{ ...modalBody, marginBottom: '1rem' }}>
              {classesWithTeachers.length === 0 ? (
                <div style={emptyState}>Chưa có lớp nào trong hệ thống.</div>
              ) : (
                <div style={tableWrapper}>
                  <table style={table}>
                    <thead>
                      <tr style={tableHeadRow}>
                        <th style={th}>Lớp</th>
                        <th style={th}>Giáo viên chủ nhiệm</th>
                        <th style={th}>Email</th>
                        <th style={{ ...th, textAlign: 'center' }}>Số học sinh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classesWithTeachers.map((classInfo) => (
                        <tr key={classInfo.className} style={row}>
                          <td style={td}>
                            <strong>{classInfo.className}</strong>
                          </td>
                          <td style={td}>
                            {classInfo.teacher === "Chưa có" ? (
                              <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                                Chưa có giáo viên
                              </span>
                            ) : (
                              classInfo.teacher
                            )}
                          </td>
                          <td style={td}>{classInfo.teacherEmail}</td>
                          <td style={{ ...td, textAlign: 'center' }}>
                            <span
                              style={{
                                ...badge,
                                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                              }}
                            >
                              {classInfo.studentCount}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div style={modalFooter}>
              <button
                style={{
                  ...modalButtonCancel,
                  ...(hoverModalCancel ? modalButtonCancelHover : {}),
                }}
                onMouseEnter={() => setHoverModalCancel(true)}
                onMouseLeave={() => setHoverModalCancel(false)}
                onClick={() => setShowClassesModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
