import React, { useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { validationRules } from "../utils/validation";
import Header from "../components/Header";
import {
  predictContainer,
  predictContent,
  predictTitle,
  predictForm,
  formGroup,
  formLabel,
  formInput,
  formInputError,
  formInputFocus,
  errorMessage,
  submitButton,
  submitButtonHover,
  submitButtonDisabled,
  resultContainer,
  resultTitle,
  resultGrade,
  resultDetails,
} from "../../assets/styles/predict.styles";

const PREDICT_VALIDATION_RULES = {
  studyHourPerWeek: validationRules.studyHourPerWeek,
  previousGrade: validationRules.previousGrade,
  attendanceRate: validationRules.attendanceRate,
  extracurricularActivities: validationRules.extracurricularActivities,
};

// Hàm dự đoán tạm thời - sẽ thay thế bằng API thật sau
const predictFinalGrade = async () => {
  // TODO: Thay thế bằng API call thật khi backend ready
  // const response = await fetch("/api/predict/", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify({
  //     studyHourPerWeek,
  //     previousGrade,
  //     attendanceRate,
  //     extracurricularActivities,
  //   }),
  // });
  // const data = await response.json();
  // return data.predictedGrade;

  // Tạm thời return giá trị mặc định
  return 75;
};

const PredictPage = () => {
  const { user } = useAuth();
  const [_predictionHistory, setPredictionHistory] = useLocalStorage(
    `prediction_history_${user?.id || "guest"}`,
    []
  );
  const [result, setResult] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredSubmit, setHoveredSubmit] = useState(false);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    setValue,
    setFieldTouched,
    validateAll,
  } = useForm(
    {
      studyHourPerWeek: "",
      previousGrade: "",
      attendanceRate: "",
      extracurricularActivities: "",
    },
    PREDICT_VALIDATION_RULES
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const isValid = validateAll();
      if (!isValid) {
        Object.keys(PREDICT_VALIDATION_RULES).forEach((field) => {
          setFieldTouched(field);
        });
        return;
      }

      setIsSubmitting(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const finalGrade = await predictFinalGrade();

      setResult({
        finalGrade,
        inputs: { ...values },
        timestamp: new Date().toISOString(),
      });

      // Save to history
      const newHistoryItem = {
        timestamp: new Date().toISOString(),
        details: `Thời gian học: ${values.studyHourPerWeek}h/tuần, Điểm kì trước: ${values.previousGrade}, Tỉ lệ có mặt: ${values.attendanceRate}%, Hoạt động ngoại khóa: ${values.extracurricularActivities}`,
        finalGrade,
        inputs: { ...values },
      };

      setPredictionHistory((prev) => [newHistoryItem, ...prev]);

      setIsSubmitting(false);
    },
    [
      values,
      validateAll,
      setIsSubmitting,
      setFieldTouched,
      setPredictionHistory,
    ]
  );

  const isFormValid = Object.keys(PREDICT_VALIDATION_RULES).every(
    (key) => !errors[key] && values[key] !== ""
  );

  return (
    <div style={predictContainer}>
      <Header />
      <div style={predictContent}>
        <h1 style={predictTitle}>🎓 Trang Dự Đoán Điểm Số</h1>

        <form onSubmit={handleSubmit} style={predictForm}>
          <div style={formGroup}>
            <label style={formLabel}>
              Thời gian học trung bình mỗi tuần (giờ) *
            </label>
            <input
              type="number"
              value={values.studyHourPerWeek}
              onChange={(e) => setValue("studyHourPerWeek", e.target.value)}
              onBlur={() => setFieldTouched("studyHourPerWeek")}
              onFocus={() => setFocusedField("studyHourPerWeek")}
              placeholder="Ví dụ: 20"
              min="0"
              max="168"
              step="0.5"
              style={{
                ...formInput,
                ...(touched.studyHourPerWeek && errors.studyHourPerWeek
                  ? formInputError
                  : focusedField === "studyHourPerWeek"
                  ? formInputFocus
                  : {}),
              }}
              disabled={isSubmitting}
            />
            {touched.studyHourPerWeek && errors.studyHourPerWeek && (
              <div style={errorMessage}>{errors.studyHourPerWeek}</div>
            )}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>
              Điểm kiểm tra kì trước (thang điểm 100) *
            </label>
            <input
              type="number"
              value={values.previousGrade}
              onChange={(e) => setValue("previousGrade", e.target.value)}
              onBlur={() => setFieldTouched("previousGrade")}
              onFocus={() => setFocusedField("previousGrade")}
              placeholder="Ví dụ: 75.5"
              min="0"
              max="100"
              step="0.1"
              style={{
                ...formInput,
                ...(touched.previousGrade && errors.previousGrade
                  ? formInputError
                  : focusedField === "previousGrade"
                  ? formInputFocus
                  : {}),
              }}
              disabled={isSubmitting}
            />
            {touched.previousGrade && errors.previousGrade && (
              <div style={errorMessage}>{errors.previousGrade}</div>
            )}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Tỉ lệ có mặt tại các buổi học (%) *</label>
            <input
              type="number"
              value={values.attendanceRate}
              onChange={(e) => setValue("attendanceRate", e.target.value)}
              onBlur={() => setFieldTouched("attendanceRate")}
              onFocus={() => setFocusedField("attendanceRate")}
              placeholder="Ví dụ: 85"
              min="0"
              max="100"
              step="0.1"
              style={{
                ...formInput,
                ...(touched.attendanceRate && errors.attendanceRate
                  ? formInputError
                  : focusedField === "attendanceRate"
                  ? formInputFocus
                  : {}),
              }}
              disabled={isSubmitting}
            />
            {touched.attendanceRate && errors.attendanceRate && (
              <div style={errorMessage}>{errors.attendanceRate}</div>
            )}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>
              Số hoạt động ngoại khóa đã tham gia *
            </label>
            <input
              type="number"
              value={values.extracurricularActivities}
              onChange={(e) =>
                setValue("extracurricularActivities", e.target.value)
              }
              onBlur={() => setFieldTouched("extracurricularActivities")}
              onFocus={() => setFocusedField("extracurricularActivities")}
              placeholder="Ví dụ: 3"
              min="0"
              step="1"
              style={{
                ...formInput,
                ...(touched.extracurricularActivities &&
                errors.extracurricularActivities
                  ? formInputError
                  : focusedField === "extracurricularActivities"
                  ? formInputFocus
                  : {}),
              }}
              disabled={isSubmitting}
            />
            {touched.extracurricularActivities &&
              errors.extracurricularActivities && (
                <div style={errorMessage}>
                  {errors.extracurricularActivities}
                </div>
              )}
          </div>

          <button
            type="submit"
            style={{
              ...submitButton,
              ...(hoveredSubmit ? submitButtonHover : {}),
              ...(!isFormValid || isSubmitting ? submitButtonDisabled : {}),
            }}
            disabled={!isFormValid || isSubmitting}
            onMouseEnter={() => setHoveredSubmit(true)}
            onMouseLeave={() => setHoveredSubmit(false)}
          >
            {isSubmitting ? "Đang dự đoán..." : "📊 Dự đoán điểm cuối kì"}
          </button>
        </form>

        {result && (
          <div style={resultContainer}>
            <h2 style={resultTitle}>Kết quả dự đoán</h2>
            <div style={resultGrade}>{result.finalGrade}/100</div>
            <div style={resultDetails}>
              <div>
                <strong>Thời gian học:</strong> {result.inputs.studyHourPerWeek}{" "}
                giờ/tuần
              </div>
              <div>
                <strong>Điểm kì trước:</strong> {result.inputs.previousGrade}
                /100
              </div>
              <div>
                <strong>Tỉ lệ có mặt:</strong> {result.inputs.attendanceRate}%
              </div>
              <div>
                <strong>Hoạt động ngoại khóa:</strong>{" "}
                {result.inputs.extracurricularActivities}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictPage;
