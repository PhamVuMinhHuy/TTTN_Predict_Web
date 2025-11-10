import { useState, useCallback } from 'react';

export const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return '';

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) return error;
    }
    return '';
  }, [validationRules, values]);

  const setValue = useCallback((name, value) => {
    setValues(prev => {
      const newValues = { ...prev, [name]: value };
      
      // Validate on change if field was touched
      if (touched[name]) {
        const error = validate(name, value);
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
      }
      
      // Also validate confirmPassword when password changes
      if (name === 'password' && touched.confirmPassword) {
        const confirmPasswordError = validate('confirmPassword', newValues.confirmPassword);
        setErrors(prevErrors => ({ ...prevErrors, confirmPassword: confirmPasswordError }));
      }
      
      return newValues;
    });
  }, [validate, touched]);

  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    const error = validate(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validate, values]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validate(fieldName, values[fieldName]);
      newErrors[fieldName] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    return isValid;
  }, [validate, values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    setValue,
    setFieldTouched,
    validateAll,
    reset
  };
};