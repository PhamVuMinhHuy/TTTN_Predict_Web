export const validationRules = {
  email: [
    (value) => {
      if (!value) return "Email là bắt buộc";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Định dạng email không hợp lệ";
      }
      return "";
    },
  ],
  password: [
    (value) => {
      if (!value) return "Mật khẩu là bắt buộc";
      // Bỏ tất cả validation phức tạp, chỉ cần có mật khẩu là đủ
      return "";
    },
  ],
  confirmPassword: [
    (value, allValues) => {
      if (!value) return "Xác nhận mật khẩu là bắt buộc";
      if (value !== allValues?.password) return "Mật khẩu xác nhận không khớp";
      return "";
    },
  ],
  name: [
    (value) => {
      if (!value) return "Tên là bắt buộc";
      if (value.length < 2) return "Tên phải có ít nhất 2 ký tự";
      return "";
    },
  ],
  studyHourPerWeek: [
    (value) => {
      if (!value && value !== 0) return "Thời gian học là bắt buộc";
      const num = Number(value);
      if (isNaN(num)) return "Vui lòng nhập số hợp lệ";
      if (num < 0) return "Thời gian học không thể âm";
      if (num > 168) return "Thời gian học không thể vượt quá 168 giờ/tuần";
      return "";
    },
  ],
  previousGrade: [
    (value) => {
      if (!value && value !== 0) return "Điểm kiểm tra kì trước là bắt buộc";
      const num = Number(value);
      if (isNaN(num)) return "Vui lòng nhập số hợp lệ";
      if (num < 0 || num > 100) return "Điểm phải từ 0 đến 100";
      return "";
    },
  ],
  attendanceRate: [
    (value) => {
      if (!value && value !== 0) return "Tỉ lệ có mặt là bắt buộc";
      const num = Number(value);
      if (isNaN(num)) return "Vui lòng nhập số hợp lệ";
      if (num < 0 || num > 100) return "Tỉ lệ có mặt phải từ 0% đến 100%";
      return "";
    },
  ],
  extracurricularActivities: [
    (value) => {
      if (!value) return "Hoạt động ngoại khóa là bắt buộc";
      if (value !== "Yes" && value !== "No") return "Vui lòng chọn Yes hoặc No";
      return "";
    },
  ],
  pastExamScores: [
    (value) => {
      if (!value && value !== 0) return "Điểm thi trước đó là bắt buộc";
      const num = Number(value);
      if (isNaN(num)) return "Vui lòng nhập số hợp lệ";
      if (num < 0 || num > 100) return "Điểm phải từ 0 đến 100";
      return "";
    },
  ],
  parentalEducationLevel: [
    (value) => {
      if (!value) return "Trình độ học vấn của phụ huynh là bắt buộc";
      const validLevels = ["HighSchool", "PhD", "Bachelors", "Masters"];
      if (!validLevels.includes(value)) return "Vui lòng chọn một trong các lựa chọn hợp lệ";
      return "";
    },
  ],
  internetAccessAtHome: [
    (value) => {
      if (!value) return "Truy cập internet tại nhà là bắt buộc";
      if (value !== "Yes" && value !== "No") return "Vui lòng chọn Yes hoặc No";
      return "";
    },
  ],
};

// Helper function to validate a single field
export const validateField = (fieldName, value, allValues = {}) => {
  const rules = validationRules[fieldName];
  if (!rules) return "";

  for (const rule of rules) {
    const error = rule(value, allValues);
    if (error) return error;
  }
  return "";
};

// Helper function to validate all fields
export const validateAllFields = (values, fieldsToValidate) => {
  const errors = {};
  let isValid = true;

  fieldsToValidate.forEach((fieldName) => {
    const error = validateField(fieldName, values[fieldName], values);
    errors[fieldName] = error;
    if (error) isValid = false;
  });

  return { errors, isValid };
};
