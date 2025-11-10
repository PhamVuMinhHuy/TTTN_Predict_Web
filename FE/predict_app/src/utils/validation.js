export const validationRules = {
  email: [
    (value) => {
      if (!value) return 'Email là bắt buộc';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Định dạng email không hợp lệ';
      }
      return '';
    }
  ],
  password: [
    (value) => {
      if (!value) return 'Mật khẩu là bắt buộc';
      if (value.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
      }
      return '';
    }
  ],
  confirmPassword: [
    (value, allValues) => {
      if (!value) return 'Xác nhận mật khẩu là bắt buộc';
      if (value !== allValues?.password) return 'Mật khẩu xác nhận không khớp';
      return '';
    }
  ],
  name: [
    (value) => {
      if (!value) return 'Tên là bắt buộc';
      if (value.length < 2) return 'Tên phải có ít nhất 2 ký tự';
      return '';
    }
  ]
};

// Helper function to validate a single field
export const validateField = (fieldName, value, allValues = {}) => {
  const rules = validationRules[fieldName];
  if (!rules) return '';

  for (const rule of rules) {
    const error = rule(value, allValues);
    if (error) return error;
  }
  return '';
};

// Helper function to validate all fields
export const validateAllFields = (values, fieldsToValidate) => {
  const errors = {};
  let isValid = true;

  fieldsToValidate.forEach(fieldName => {
    const error = validateField(fieldName, values[fieldName], values);
    errors[fieldName] = error;
    if (error) isValid = false;
  });

  return { errors, isValid };
};