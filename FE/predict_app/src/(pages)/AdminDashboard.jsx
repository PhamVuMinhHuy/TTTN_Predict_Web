import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  editButton,
  editButtonHover,
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
  // New imports for additional styles
  searchContainer,
  searchIcon,
  searchInput,
  searchClearButton,
  paginationContainer,
  paginationTop,
  pageSizeSelector,
  pageSizeSelect,
  paginationBottom,
  paginationButton,
  paginationButtonDisabled,
  paginationInfo,
  paginationCurrentPage,
  loadingSpinner,
  quickCreateBox,
  quickCreateLabel,
  quickCreateRow,
  quickCreateInput,
  quickCreateButton,
  actionButtons,
  classesFormContainer,
  classesForm,
  classesFormInput,
  classesFormButton,
  noTeacherText,
  badgeSuccess,
} from "../../assets/styles/adminDashboard.styles";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Statistics from API
  const [apiStats, setApiStats] = useState({
    totalUsers: 0,
    students: 0,
    teachers: 0,
    admins: 0,
  });

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
  const [hoveredEdit, setHoveredEdit] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);
  const [classFilter] = useState(null);

  // Toast notification state
  const [toasts, setToasts] = useState([]);
  const [toastIdCounter, setToastIdCounter] = useState(0);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState(null);
  const [hoverModalCancel, setHoverModalCancel] = useState(false);
  const [hoverModalConfirm, setHoverModalConfirm] = useState(false);
  const [hoverToastClose, setHoverToastClose] = useState(null);

  // Classes modal state
  const [showClassesModal, setShowClassesModal] = useState(false);

  // Classes management state
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [newClassName, setNewClassName] = useState("");
  const [creatingClass, setCreatingClass] = useState(false);
  const [hoveredDeleteClass, setHoveredDeleteClass] = useState(null);

  // Edit user modal state
  const [editModal, setEditModal] = useState(null);
  const [editFormData, setEditFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "",
    class_name: "",
    password: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Toast notification functions
  const showToast = (message, type = "info") => {
    const id = toastIdCounter;
    setToastIdCounter((prev) => prev + 1);

    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInputValue);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInputValue]);

  // Fetch users function
  const fetchUsers = useCallback(
    async ({ page, search }) => {
      setLoadingUsers(true);
      setError(null);
      const result = await adminService.getUsers({
        page,
        limit: pageSize,
        search,
        role: roleFilter || "",
      });
      if (result.success) {
        setUsers(result.data);
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages);
          setCurrentPage(result.pagination.currentPage);
        }
        if (result.statistics) {
          setApiStats(result.statistics);
        }
      } else {
        setError(result.error);
      }
      setLoadingUsers(false);
    },
    [pageSize, roleFilter]
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchUsers({ page: 1, search: debouncedSearch });
  }, [debouncedSearch, pageSize, roleFilter, fetchUsers]);

  useEffect(() => {
    fetchUsers({ page: currentPage, search: debouncedSearch });
  }, [currentPage, debouncedSearch, fetchUsers]);

  // Fetch classes function - tách ra để có thể gọi lại khi cần
  const fetchClasses = useCallback(async () => {
    setLoadingClasses(true);
    const result = await adminService.getClasses();
    if (result.success) {
      setClasses(result.data);
    }
    setLoadingClasses(false);
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const availableClasses = useMemo(() => {
    return classes.map((c) => c.name).sort();
  }, [classes]);

  // Lớp chưa có giáo viên (dùng cho form tạo teacher)
  const availableClassesForTeacher = useMemo(() => {
    return classes
      .filter((c) => !c.teacher_name) // Chỉ lấy lớp chưa có giáo viên
      .map((c) => c.name)
      .sort();
  }, [classes]);

  const classesWithTeachers = useMemo(() => {
    return classes.map((classData) => {
      const teacher = users.find(
        (u) => u.role === "teacher" && u.class_name === classData.name
      );
      return {
        id: classData.id,
        className: classData.name,
        teacher: classData.teacher_name || "Chưa có",
        teacherEmail: teacher?.email || "-",
        studentCount: classData.student_count || 0,
      };
    });
  }, [classes, users]);

  const statistics = useMemo(() => {
    const totalClasses = availableClasses.length;
    return {
      totalUsers: apiStats.totalUsers,
      students: apiStats.students,
      teachers: apiStats.teachers,
      admins: apiStats.admins,
      totalClasses,
    };
  }, [apiStats, availableClasses]);

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (classFilter) {
      filtered = filtered.filter((u) => u.class_name === classFilter);
    }
    return filtered;
  }, [users, classFilter]);

  const handleRoleFilter = (role) => {
    if (roleFilter === role) {
      setRoleFilter(null);
    } else {
      setRoleFilter(role);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "role" && value === "teacher") {
      // Khi chuyển sang role teacher, kiểm tra nếu lớp đã chọn đã có giáo viên
      const currentClass = formData.class_name;
      const classHasTeacher = classes.find(
        (c) => c.name === currentClass && c.teacher_name
      );
      if (classHasTeacher) {
        // Reset lớp nếu lớp đã có giáo viên
        setFormData((prev) => ({ ...prev, [name]: value, class_name: "" }));
        return;
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    let classId = null;
    if (formData.class_name) {
      const selectedClass = classes.find((c) => c.name === formData.class_name);
      if (selectedClass) {
        classId = selectedClass.id;
      }
    }

    const userData = {
      ...formData,
      class_id: classId,
    };

    const result = await adminService.createUser(userData);
    if (result.success) {
      setCurrentPage(1);
      await fetchUsers({ page: 1, search: debouncedSearch });
      // Refresh danh sách lớp nếu tạo giáo viên (để cập nhật thông tin teacher_name)
      if (formData.role === "teacher") {
        await fetchClasses();
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

  const handleDeleteUser = async (userId, username, role) => {
    showConfirmModal(
      "⚠️ Xác nhận xóa người dùng",
      `Bạn có chắc chắn muốn xóa tài khoản "${username}"? Hành động này không thể hoàn tác.`,
      async () => {
        closeConfirmModal();
        const result = await adminService.deleteUser(userId);
        if (result.success) {
          await fetchUsers({ page: currentPage, search: debouncedSearch });
          // Refresh danh sách lớp nếu xóa giáo viên
          if (role === "teacher") {
            await fetchClasses();
          }
          showToast(`✅ Đã xóa tài khoản "${username}" thành công!`, "success");
        } else {
          showToast(`❌ Lỗi khi xóa: ${result.error}`, "error");
        }
      }
    );
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      showToast("❌ Vui lòng nhập tên lớp", "error");
      return;
    }

    const classNameToCreate = newClassName.trim();
    setCreatingClass(true);
    const result = await adminService.createClass(classNameToCreate);
    if (result.success) {
      const classesResult = await adminService.getClasses();
      if (classesResult.success) {
        setClasses(classesResult.data);
      }
      setFormData((prev) => ({ ...prev, class_name: classNameToCreate }));
      setNewClassName("");
      showToast(`✅ Tạo lớp "${classNameToCreate}" thành công!`, "success");
    } else {
      showToast(`❌ Lỗi: ${result.error}`, "error");
    }
    setCreatingClass(false);
  };

  const handleDeleteClass = async (classId, className) => {
    showConfirmModal(
      "⚠️ Xác nhận xóa lớp",
      `Bạn có chắc chắn muốn xóa lớp "${className}"? Chỉ có thể xóa lớp không có học sinh hoặc giáo viên.`,
      async () => {
        closeConfirmModal();
        const result = await adminService.deleteClass(classId);
        if (result.success) {
          setClasses((prev) => prev.filter((c) => c.id !== classId));
          showToast(`✅ Đã xóa lớp "${className}" thành công!`, "success");
        } else {
          showToast(`❌ Lỗi khi xóa: ${result.error}`, "error");
        }
      }
    );
  };

  const openEditModal = (userToEdit) => {
    setEditModal(userToEdit);
    setEditFormData({
      email: userToEdit.email || "",
      first_name: userToEdit.first_name || "",
      last_name: userToEdit.last_name || "",
      role: userToEdit.role || "student",
      class_name: userToEdit.class_name || "",
      password: "",
    });
  };

  const closeEditModal = () => {
    setEditModal(null);
    setEditFormData({
      email: "",
      first_name: "",
      last_name: "",
      role: "",
      class_name: "",
      password: "",
    });
  };

  const handleEditInputChange = (e) => {
    setEditFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editModal) return;

    setEditSubmitting(true);

    let classId = null;
    if (editFormData.class_name && editFormData.role !== "admin") {
      const selectedClass = classes.find((c) => c.name === editFormData.class_name);
      if (selectedClass) {
        classId = selectedClass.id;
      }
    }

    const updateData = {
      email: editFormData.email,
      first_name: editFormData.first_name,
      last_name: editFormData.last_name,
      role: editFormData.role,
      class_id: classId,
      class_name: editFormData.class_name,
    };

    if (editFormData.password.trim()) {
      updateData.password = editFormData.password;
    }

    const result = await adminService.updateUser(editModal.id, updateData);
    if (result.success) {
      await fetchUsers({ page: currentPage, search: debouncedSearch });
      // Refresh danh sách lớp nếu user là teacher hoặc bị đổi từ/tới teacher
      if (editFormData.role === "teacher" || editModal.role === "teacher") {
        await fetchClasses();
      }
      showToast(
        `✅ Cập nhật thông tin "${editModal.username}" thành công!`,
        "success"
      );
      closeEditModal();
    } else {
      showToast(`❌ Lỗi: ${result.error}`, "error");
    }

    setEditSubmitting(false);
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
              cursor: "pointer",
              ...(roleFilter === null
                ? {
                    boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)",
                    transform: "translateY(-2px)",
                  }
                : {}),
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
            onClick={() => handleRoleFilter("student")}
            style={{
              ...statCard,
              ...(hoveredStat === "students" ? statCardHover : {}),
              cursor: "pointer",
              ...(roleFilter === "student"
                ? {
                    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)",
                    transform: "translateY(-2px)",
                  }
                : {}),
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
            onClick={() => handleRoleFilter("teacher")}
            style={{
              ...statCard,
              ...(hoveredStat === "teachers" ? statCardHover : {}),
              cursor: "pointer",
              ...(roleFilter === "teacher"
                ? {
                    boxShadow: "0 8px 20px rgba(168, 85, 247, 0.4)",
                    transform: "translateY(-2px)",
                  }
                : {}),
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
            onClick={() => handleRoleFilter("admin")}
            style={{
              ...statCard,
              ...(hoveredStat === "admins" ? statCardHover : {}),
              cursor: "pointer",
              ...(roleFilter === "admin"
                ? {
                    boxShadow: "0 8px 20px rgba(249, 115, 22, 0.4)",
                    transform: "translateY(-2px)",
                  }
                : {}),
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
              cursor: "pointer",
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
              <div style={searchIcon}>🔍</div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, lớp..."
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                onFocus={() => setFocusedField("search")}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...searchInput,
                  ...(focusedField === "search"
                    ? {
                        border: "2px solid #3b82f6",
                        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)",
                      }
                    : {}),
                }}
              />
              {searchInputValue && (
                <button
                  onClick={() => setSearchInputValue("")}
                  style={searchClearButton}
                >
                  ✕
                </button>
              )}
            </div>

            {loadingUsers ? (
              <div style={loadingContainer}>
                <div style={loadingSpinner} />
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
                {debouncedSearch
                  ? "🔍 Không tìm thấy người dùng phù hợp."
                  : "📭 Chưa có người dùng nào trong hệ thống."}
              </div>
            ) : (
              <>
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
                              <div style={actionButtons}>
                                <button
                                  style={{
                                    ...editButton,
                                    marginRight: 0,
                                    ...(hoveredEdit === u.id
                                      ? editButtonHover
                                      : {}),
                                  }}
                                  onMouseEnter={() => setHoveredEdit(u.id)}
                                  onMouseLeave={() => setHoveredEdit(null)}
                                  onClick={() => openEditModal(u)}
                                >
                                  ✏️ Sửa
                                </button>
                                <button
                                  style={{
                                    ...deleteButton,
                                    ...(hoveredDelete === u.id
                                      ? deleteButtonHover
                                      : {}),
                                  }}
                                  onMouseEnter={() => setHoveredDelete(u.id)}
                                  onMouseLeave={() => setHoveredDelete(null)}
                                  onClick={() =>
                                    handleDeleteUser(u.id, u.username, u.role)
                                  }
                                >
                                  🗑️ Xóa
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div style={paginationContainer}>
                  {/* Top row: Page Size only */}
                  <div style={paginationTop}>
                    <div style={pageSizeSelector}>
                      <span>Hiển thị</span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        style={pageSizeSelect}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span>dòng/trang</span>
                    </div>
                  </div>

                  {/* Bottom row: Pagination buttons - centered */}
                  <div style={paginationBottom}>
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      style={
                        currentPage === 1
                          ? paginationButtonDisabled
                          : paginationButton
                      }
                      title="Trang đầu"
                    >
                      ⏮
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={
                        currentPage === 1
                          ? paginationButtonDisabled
                          : paginationButton
                      }
                    >
                      ← Trước
                    </button>

                    <div style={paginationInfo}>
                      Trang{" "}
                      <span style={paginationCurrentPage}>{currentPage}</span> /{" "}
                      {totalPages || 1}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
                      style={
                        currentPage === totalPages || totalPages === 0
                          ? paginationButtonDisabled
                          : paginationButton
                      }
                    >
                      Sau →
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      style={
                        currentPage === totalPages || totalPages === 0
                          ? paginationButtonDisabled
                          : paginationButton
                      }
                      title="Trang cuối"
                    >
                      ⏭
                    </button>
                  </div>
                </div>
              </>
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
                  <select
                    id="class_name"
                    name="class_name"
                    value={formData.class_name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("class_name")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...select,
                      ...(focusedField === "class_name" ? inputFocus : {}),
                    }}
                    required={formData.role === "student"}
                  >
                    <option value="">-- Chọn lớp --</option>
                    {(formData.role === "teacher" ? availableClassesForTeacher : availableClasses).map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>
                  <div style={helpText}>
                    {loadingClasses
                      ? "Đang tải danh sách lớp..."
                      : formData.role === "teacher"
                      ? availableClassesForTeacher.length === 0
                        ? "⚠️ Tất cả các lớp đã có giáo viên. Vui lòng tạo lớp mới."
                        : "Chọn lớp chủ nhiệm (mỗi lớp chỉ có 1 giáo viên)"
                      : availableClasses.length === 0
                      ? "⚠️ Chưa có lớp nào. Vui lòng tạo lớp mới bên dưới."
                      : "Chọn lớp của học sinh"}
                  </div>

                  {/* Form tạo lớp mới nhanh */}
                  <div style={quickCreateBox}>
                    <div style={quickCreateLabel}>➕ Hoặc tạo lớp mới:</div>
                    <div style={quickCreateRow}>
                      <input
                        type="text"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="Nhập tên lớp (VD: 10A1...)"
                        style={quickCreateInput}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newClassName.trim()) {
                              handleCreateClass(e);
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleCreateClass}
                        disabled={creatingClass || !newClassName.trim()}
                        style={{
                          ...quickCreateButton,
                          ...(creatingClass || !newClassName.trim()
                            ? { backgroundColor: "#475569", cursor: "not-allowed" }
                            : {}),
                        }}
                      >
                        {creatingClass ? "⏳..." : "✓ Tạo"}
                      </button>
                    </div>
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
        <div
          style={{ ...modalOverlay, zIndex: 10000 }}
          onClick={closeConfirmModal}
        >
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

      {/* Edit User Modal */}
      {editModal && (
        <div style={modalOverlay} onClick={closeEditModal}>
          <div
            style={{
              ...modal,
              maxWidth: "550px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalHeader}>
              <div style={modalIcon}>✏️</div>
              <h3 style={modalTitle}>Chỉnh sửa người dùng: {editModal.username}</h3>
            </div>

            <form onSubmit={handleUpdateUser} style={{ padding: "1.5rem" }}>
              {/* Email */}
              <div style={formGroup}>
                <label style={label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  onFocus={() => setFocusedField("edit_email")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...input,
                    ...(focusedField === "edit_email" ? inputFocus : {}),
                  }}
                  placeholder="Email..."
                />
              </div>

              {/* Họ và Tên */}
              <div style={{ ...formRow, marginTop: "1rem" }}>
                <div style={formGroup}>
                  <label style={label}>Họ</label>
                  <input
                    type="text"
                    name="first_name"
                    value={editFormData.first_name}
                    onChange={handleEditInputChange}
                    onFocus={() => setFocusedField("edit_first_name")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...input,
                      ...(focusedField === "edit_first_name" ? inputFocus : {}),
                    }}
                    placeholder="Họ..."
                  />
                </div>
                <div style={formGroup}>
                  <label style={label}>Tên</label>
                  <input
                    type="text"
                    name="last_name"
                    value={editFormData.last_name}
                    onChange={handleEditInputChange}
                    onFocus={() => setFocusedField("edit_last_name")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...input,
                      ...(focusedField === "edit_last_name" ? inputFocus : {}),
                    }}
                    placeholder="Tên..."
                  />
                </div>
              </div>

              {/* Role và Lớp */}
              <div style={{ ...formRow, marginTop: "1rem" }}>
                <div style={formGroup}>
                  <label style={label}>Vai trò</label>
                  <select
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditInputChange}
                    onFocus={() => setFocusedField("edit_role")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...select,
                      ...(focusedField === "edit_role" ? inputFocus : {}),
                    }}
                    disabled={editModal.id === user.id}
                  >
                    <option value="student">Học sinh</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {editFormData.role !== "admin" && (
                  <div style={formGroup}>
                    <label style={label}>Lớp</label>
                    <select
                      name="class_name"
                      value={editFormData.class_name}
                      onChange={handleEditInputChange}
                      onFocus={() => setFocusedField("edit_class")}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        ...select,
                        ...(focusedField === "edit_class" ? inputFocus : {}),
                      }}
                    >
                      <option value="">-- Chọn lớp --</option>
                      {(editFormData.role === "teacher"
                        ? [...new Set([
                            // Lớp hiện tại của giáo viên (nếu có)
                            ...(editModal?.class_name ? [editModal.class_name] : []),
                            // Các lớp chưa có giáo viên
                            ...availableClassesForTeacher
                          ])].sort()
                        : availableClasses
                      ).map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Mật khẩu mới */}
              <div style={{ ...formGroup, marginTop: "1rem" }}>
                <label style={label}>Mật khẩu mới (để trống nếu không đổi)</label>
                <input
                  type="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleEditInputChange}
                  onFocus={() => setFocusedField("edit_password")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...input,
                    ...(focusedField === "edit_password" ? inputFocus : {}),
                  }}
                  placeholder="Nhập mật khẩu mới..."
                />
              </div>

              {/* Buttons */}
              <div style={{ ...modalFooter, marginTop: "1.5rem" }}>
                <button
                  type="button"
                  style={{
                    ...modalButtonCancel,
                    ...(hoverModalCancel ? modalButtonCancelHover : {}),
                  }}
                  onMouseEnter={() => setHoverModalCancel(true)}
                  onMouseLeave={() => setHoverModalCancel(false)}
                  onClick={closeEditModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  style={{
                    ...submitButton,
                    ...(editSubmitting ? submitButtonDisabled : {}),
                    ...(!editSubmitting && hoverSubmit ? submitButtonHover : {}),
                    marginTop: 0,
                    width: "auto",
                    padding: "0.65rem 1.5rem",
                  }}
                  onMouseEnter={() => setHoverSubmit(true)}
                  onMouseLeave={() => setHoverSubmit(false)}
                >
                  {editSubmitting ? "Đang lưu..." : "💾 Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Classes Management Modal */}
      {showClassesModal && (
        <div style={modalOverlay} onClick={() => setShowClassesModal(false)}>
          <div
            style={{
              ...modal,
              maxWidth: "800px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalHeader}>
              <div style={modalIcon}>🏫</div>
              <h3 style={modalTitle}>Quản lý lớp học</h3>
            </div>

            {/* Form tạo lớp mới */}
            <div style={classesFormContainer}>
              <form onSubmit={handleCreateClass} style={classesForm}>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Nhập tên lớp mới (VD: 10A1, 12B2...)"
                  style={classesFormInput}
                />
                <button
                  type="submit"
                  disabled={creatingClass || !newClassName.trim()}
                  style={{
                    ...classesFormButton,
                    ...(creatingClass || !newClassName.trim()
                      ? { backgroundColor: "#9ca3af", cursor: "not-allowed" }
                      : {}),
                  }}
                >
                  {creatingClass ? "⏳ Đang tạo..." : "➕ TẠO LỚP"}
                </button>
              </form>
            </div>

            <div
              style={{
                ...modalBody,
                marginBottom: "1rem",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {loadingClasses ? (
                <div style={loadingContainer}>
                  <div style={loadingSpinner} />
                  <span>Đang tải danh sách lớp...</span>
                </div>
              ) : classesWithTeachers.length === 0 ? (
                <div style={emptyState}>
                  Chưa có lớp nào trong hệ thống. Vui lòng tạo lớp mới.
                </div>
              ) : (
                <div style={tableWrapper}>
                  <table style={table}>
                    <thead>
                      <tr style={tableHeadRow}>
                        <th style={th}>Lớp</th>
                        <th style={th}>Giáo viên chủ nhiệm</th>
                        <th style={th}>Email</th>
                        <th style={{ ...th, textAlign: "center" }}>
                          Số học sinh
                        </th>
                        <th style={{ ...th, textAlign: "center" }}>
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classesWithTeachers.map((classInfo) => (
                        <tr key={classInfo.id} style={row}>
                          <td style={td}>
                            <strong>{classInfo.className}</strong>
                          </td>
                          <td style={td}>
                            {classInfo.teacher === "Chưa có" ||
                            !classInfo.teacher ? (
                              <span style={noTeacherText}>
                                Chưa có giáo viên
                              </span>
                            ) : (
                              classInfo.teacher
                            )}
                          </td>
                          <td style={td}>{classInfo.teacherEmail}</td>
                          <td style={{ ...td, textAlign: "center" }}>
                            <span style={badgeSuccess}>
                              {classInfo.studentCount}
                            </span>
                          </td>
                          <td style={{ ...td, textAlign: "center" }}>
                            <button
                              style={{
                                ...deleteButton,
                                ...(hoveredDeleteClass === classInfo.id
                                  ? deleteButtonHover
                                  : {}),
                              }}
                              onMouseEnter={() =>
                                setHoveredDeleteClass(classInfo.id)
                              }
                              onMouseLeave={() => setHoveredDeleteClass(null)}
                              onClick={() =>
                                handleDeleteClass(
                                  classInfo.id,
                                  classInfo.className
                                )
                              }
                              title={
                                classInfo.studentCount > 0
                                  ? "Không thể xóa lớp có học sinh"
                                  : "Xóa lớp"
                              }
                            >
                              🗑️ Xóa
                            </button>
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
