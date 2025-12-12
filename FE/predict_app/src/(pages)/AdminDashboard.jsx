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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState(""); // For immediate input
  const [debouncedSearch, setDebouncedSearch] = useState(""); // For API call
  
  // Statistics from API (not affected by pagination)
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

  // Classes management state
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [newClassName, setNewClassName] = useState("");
  const [creatingClass, setCreatingClass] = useState(false);
  const [hoveredDeleteClass, setHoveredDeleteClass] = useState(null);

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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users function (can be called from multiple places)
  const fetchUsers = async (page = currentPage, search = debouncedSearch) => {
    setLoadingUsers(true);
    setError(null);
    const result = await adminService.getUsers({ page, limit: pageSize, search });
    if (result.success) {
      setUsers(result.data);
      if (result.pagination) {
        setTotalPages(result.pagination.totalPages);
        setTotalUsers(result.pagination.total);
        setCurrentPage(result.pagination.currentPage);
      }
      // Update statistics from API (not affected by pagination/search)
      if (result.statistics) {
        setApiStats(result.statistics);
      }
    } else {
      setError(result.error);
    }
    setLoadingUsers(false);
  };

  // Fetch on mount and when page/search changes
  useEffect(() => {
    fetchUsers(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, pageSize]);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      const result = await adminService.getClasses();
      if (result.success) {
        setClasses(result.data);
      }
      setLoadingClasses(false);
    };

    fetchClasses();
  }, []);

  // Get class names from classes API
  const availableClasses = useMemo(() => {
    return classes.map((c) => c.name).sort();
  }, [classes]);

  // Get classes with their homeroom teachers (from API)
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

  // Statistics from API (not from paginated users)
  const statistics = useMemo(() => {
    const totalClasses = availableClasses.length;
    return { 
      totalUsers: apiStats.totalUsers, 
      students: apiStats.students, 
      teachers: apiStats.teachers, 
      admins: apiStats.admins, 
      totalClasses 
    };
  }, [apiStats, availableClasses]);

  // Filtered users based on role filter and class filter (search is now server-side)
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

    return filtered;
  }, [users, roleFilter, classFilter]);

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

    // Tìm class_id từ class_name được chọn
    let classId = null;
    if (formData.class_name) {
      const selectedClass = classes.find(c => c.name === formData.class_name);
      if (selectedClass) {
        classId = selectedClass.id;
      }
    }

    // Gửi cả class_id và class_name (backward compatible)
    const userData = {
      ...formData,
      class_id: classId,
    };

    const result = await adminService.createUser(userData);
    if (result.success) {
      // Refresh users list and go to first page
      setCurrentPage(1);
      await fetchUsers(1, debouncedSearch);
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
          // Refresh users list on current page
          await fetchUsers(currentPage, debouncedSearch);
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
      // Refresh danh sách lớp
      const classesResult = await adminService.getClasses();
      if (classesResult.success) {
        setClasses(classesResult.data);
      }
      // Tự động chọn lớp vừa tạo vào dropdown
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
            <div style={{
              marginBottom: '1.5rem',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '1rem',
                pointerEvents: 'none',
              }}>
                🔍
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, lớp..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setFocusedField("search")}
                onBlur={() => setFocusedField(null)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.75rem',
                  backgroundColor: '#1e293b',
                  border: focusedField === "search" ? '2px solid #3b82f6' : '2px solid #374151',
                  borderRadius: '0.75rem',
                  color: '#e2e8f0',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: focusedField === "search" ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : 'none',
                }}
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '0.25rem',
                  }}
                >
                  ✕
                </button>
              )}
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

              {/* Pagination Controls */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1.25rem 1.5rem',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '0.75rem',
                border: '1px solid #475569',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}>
                {/* Top row: Stats and Page Size */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}>
                  <div style={{ 
                    color: '#f1f5f9', 
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <span>📊</span>
                    <span>
                      Hiển thị <strong style={{ color: '#22d3ee' }}>{users.length > 0 ? ((currentPage - 1) * pageSize + 1) : 0} - {Math.min(currentPage * pageSize, totalUsers)}</strong> trong tổng số <strong style={{ color: '#fbbf24' }}>{totalUsers}</strong> người dùng
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    color: '#f1f5f9', 
                    fontSize: '0.9rem' 
                  }}>
                    <span>Hiển thị</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#0f172a',
                        color: '#f1f5f9',
                        border: '2px solid #60a5fa',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        minWidth: '65px',
                        fontWeight: '600',
                      }}
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
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center', 
                  gap: '0.75rem',
                }}>
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.625rem 1rem',
                      background: currentPage === 1 ? '#475569' : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                      color: currentPage === 1 ? '#94a3b8' : 'white',
                      border: currentPage === 1 ? '1px solid #64748b' : '1px solid #60a5fa',
                      borderRadius: '0.5rem',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: currentPage === 1 ? 'none' : '0 2px 4px rgba(59, 130, 246, 0.3)',
                    }}
                    title="Trang đầu"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.625rem 1.25rem',
                      background: currentPage === 1 ? '#475569' : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                      color: currentPage === 1 ? '#94a3b8' : 'white',
                      border: currentPage === 1 ? '1px solid #64748b' : '1px solid #60a5fa',
                      borderRadius: '0.5rem',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: currentPage === 1 ? 'none' : '0 2px 4px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    ← Trước
                  </button>
                  
                  <div style={{
                    padding: '0.625rem 1.5rem',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    borderRadius: '0.5rem',
                    color: '#f1f5f9',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    border: '2px solid #60a5fa',
                    minWidth: '130px',
                    textAlign: 'center',
                  }}>
                    Trang <span style={{ color: '#fbbf24' }}>{currentPage}</span> / {totalPages || 1}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    style={{
                      padding: '0.625rem 1.25rem',
                      background: (currentPage === totalPages || totalPages === 0) ? '#475569' : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                      color: (currentPage === totalPages || totalPages === 0) ? '#94a3b8' : 'white',
                      border: (currentPage === totalPages || totalPages === 0) ? '1px solid #64748b' : '1px solid #60a5fa',
                      borderRadius: '0.5rem',
                      cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: (currentPage === totalPages || totalPages === 0) ? 'none' : '0 2px 4px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    Sau →
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    style={{
                      padding: '0.625rem 1rem',
                      background: (currentPage === totalPages || totalPages === 0) ? '#475569' : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                      color: (currentPage === totalPages || totalPages === 0) ? '#94a3b8' : 'white',
                      border: (currentPage === totalPages || totalPages === 0) ? '1px solid #64748b' : '1px solid #60a5fa',
                      borderRadius: '0.5rem',
                      cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: (currentPage === totalPages || totalPages === 0) ? 'none' : '0 2px 4px rgba(59, 130, 246, 0.3)',
                    }}
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
                    {availableClasses.map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>
                  <div style={helpText}>
                    {loadingClasses 
                      ? "Đang tải danh sách lớp..."
                      : availableClasses.length === 0 
                        ? "⚠️ Chưa có lớp nào. Vui lòng tạo lớp mới bên dưới."
                        : formData.role === "student"
                          ? "Chọn lớp của học sinh"
                          : "Chọn lớp chủ nhiệm (nếu có)"}
                  </div>

                  {/* Form tạo lớp mới nhanh */}
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                    borderRadius: '0.5rem',
                    border: '1px dashed rgba(59, 130, 246, 0.3)'
                  }}>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: '#94a3b8', 
                      marginBottom: '0.5rem',
                      fontWeight: '500'
                    }}>
                      ➕ Hoặc tạo lớp mới:
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="Nhập tên lớp (VD: 10A1...)"
                        style={{
                          ...input,
                          flex: 1,
                          margin: 0,
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.9rem',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
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
                          padding: '0.5rem 1rem',
                          backgroundColor: creatingClass || !newClassName.trim() 
                            ? '#475569' 
                            : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: creatingClass || !newClassName.trim() ? 'not-allowed' : 'pointer',
                          fontWeight: '500',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
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

      {/* Classes Management Modal */}
      {showClassesModal && (
        <div style={modalOverlay} onClick={() => setShowClassesModal(false)}>
          <div
            style={{
              ...modal,
              maxWidth: '800px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalHeader}>
              <div style={modalIcon}>🏫</div>
              <h3 style={modalTitle}>Quản lý lớp học</h3>
            </div>
            
            {/* Form tạo lớp mới */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #374151' }}>
              <form onSubmit={handleCreateClass} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Nhập tên lớp mới (VD: 10A1, 12B2...)"
                  style={{
                    ...input,
                    flex: 1,
                    margin: 0,
                  }}
                />
                <button
                  type="submit"
                  disabled={creatingClass || !newClassName.trim()}
                  style={{
                    ...submitButton,
                    padding: '0.75rem 1.5rem',
                    margin: 0,
                    opacity: creatingClass || !newClassName.trim() ? 0.5 : 1,
                  }}
                >
                  {creatingClass ? "⏳ Đang tạo..." : "➕ Tạo lớp"}
                </button>
              </form>
            </div>

            <div style={{ ...modalBody, marginBottom: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
              {loadingClasses ? (
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
                  <span>Đang tải danh sách lớp...</span>
                </div>
              ) : classesWithTeachers.length === 0 ? (
                <div style={emptyState}>Chưa có lớp nào trong hệ thống. Vui lòng tạo lớp mới.</div>
              ) : (
                <div style={tableWrapper}>
                  <table style={table}>
                    <thead>
                      <tr style={tableHeadRow}>
                        <th style={th}>Lớp</th>
                        <th style={th}>Giáo viên chủ nhiệm</th>
                        <th style={th}>Email</th>
                        <th style={{ ...th, textAlign: 'center' }}>Số học sinh</th>
                        <th style={{ ...th, textAlign: 'center' }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classesWithTeachers.map((classInfo) => (
                        <tr key={classInfo.id} style={row}>
                          <td style={td}>
                            <strong>{classInfo.className}</strong>
                          </td>
                          <td style={td}>
                            {classInfo.teacher === "Chưa có" || !classInfo.teacher ? (
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
                          <td style={{ ...td, textAlign: 'center' }}>
                            <button
                              style={{
                                ...deleteButton,
                                ...(hoveredDeleteClass === classInfo.id ? deleteButtonHover : {}),
                              }}
                              onMouseEnter={() => setHoveredDeleteClass(classInfo.id)}
                              onMouseLeave={() => setHoveredDeleteClass(null)}
                              onClick={() => handleDeleteClass(classInfo.id, classInfo.className)}
                              title={classInfo.studentCount > 0 ? "Không thể xóa lớp có học sinh" : "Xóa lớp"}
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
