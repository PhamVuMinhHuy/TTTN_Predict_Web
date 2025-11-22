import React, { useState, useCallback, useEffect } from "react";
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
  studyHoursPerWeek: validationRules.studyHourPerWeek,
  attendanceRate: validationRules.attendanceRate,
  pastExamScores: validationRules.pastExamScores,
  parentalEducationLevel: validationRules.parentalEducationLevel,
  internetAccessAtHome: validationRules.internetAccessAtHome,
  extracurricularActivities: validationRules.extracurricularActivities,
};

import { predictionService } from "../services/predictionService";

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
      studyHoursPerWeek: "",
      attendanceRate: "",
      pastExamScores: "",
      parentalEducationLevel: "",
      internetAccessAtHome: "",
      extracurricularActivities: "",
    },
    PREDICT_VALIDATION_RULES
  );

  // Load reused data from localStorage if available
  useEffect(() => {
    const reuseKey = `reuse_prediction_${user?.id || "guest"}`;
    const reusedData = localStorage.getItem(reuseKey);
    if (reusedData) {
      try {
        const parsed = JSON.parse(reusedData);
        localStorage.removeItem(reuseKey); // Clear after use
        // Populate form with reused data
        if (parsed.studyHoursPerWeek || parsed.studyHourPerWeek) {
          setValue("studyHoursPerWeek", parsed.studyHoursPerWeek || parsed.studyHourPerWeek);
        }
        if (parsed.attendanceRate) {
          setValue("attendanceRate", parsed.attendanceRate);
        }
        if (parsed.pastExamScores || parsed.previousGrade) {
          setValue("pastExamScores", parsed.pastExamScores || parsed.previousGrade);
        }
        if (parsed.parentalEducationLevel) {
          setValue("parentalEducationLevel", parsed.parentalEducationLevel);
        }
        if (parsed.internetAccessAtHome) {
          setValue("internetAccessAtHome", parsed.internetAccessAtHome);
        }
        if (parsed.extracurricularActivities) {
          setValue("extracurricularActivities", parsed.extracurricularActivities);
        }
      } catch (e) {
        console.error("Error parsing reused data:", e);
      }
    }
  }, [user?.id, setValue]);

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

      try {
        // Gọi API dự đoán
        const result = await predictionService.predict({
          studyHoursPerWeek: parseFloat(values.studyHoursPerWeek),
          attendanceRate: parseFloat(values.attendanceRate),
          pastExamScores: parseFloat(values.pastExamScores),
          parentalEducationLevel: values.parentalEducationLevel,
          internetAccessAtHome: values.internetAccessAtHome,
          extracurricularActivities: values.extracurricularActivities,
        });

        if (result.success) {
          const finalGrade = result.data.predictedScore;

          setResult({
            finalExamScore: finalGrade,
            inputs: { ...values },
            timestamp: new Date().toISOString(),
          });

          // Save to history
          const newHistoryItem = {
            timestamp: new Date().toISOString(),
            details: `Thời gian học: ${values.studyHoursPerWeek}h/tuần, Tỉ lệ có mặt: ${values.attendanceRate}%, Điểm thi trước: ${values.pastExamScores}, Trình độ phụ huynh: ${values.parentalEducationLevel}, Internet tại nhà: ${values.internetAccessAtHome}, Hoạt động ngoại khóa: ${values.extracurricularActivities}`,
            finalExamScore: finalGrade,
            inputs: { ...values },
          };

          setPredictionHistory((prev) => [newHistoryItem, ...prev]);
        } else {
          // Hiển thị lỗi
          setResult({
            error: result.error,
            inputs: { ...values },
          });
        }
      } catch (error) {
        console.error("Error predicting:", error);
        setResult({
          error: error.message || "Có lỗi xảy ra khi dự đoán",
          inputs: { ...values },
        });
      } finally {
        setIsSubmitting(false);
      }
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
              Thời gian học mỗi tuần (giờ) *
            </label>
            <input
              type="number"
              value={values.studyHoursPerWeek}
              onChange={(e) => setValue("studyHoursPerWeek", e.target.value)}
              onBlur={() => setFieldTouched("studyHoursPerWeek")}
              onFocus={() => setFocusedField("studyHoursPerWeek")}
              placeholder="Ví dụ: 20"
              min="0"
              max="168"
              step="0.5"
              style={{
                ...formInput,
                ...(touched.studyHoursPerWeek && errors.studyHoursPerWeek
                  ? formInputError
                  : focusedField === "studyHoursPerWeek"
                  ? formInputFocus
                  : {}),
              }}
              disabled={isSubmitting}
            />
            {touched.studyHoursPerWeek && errors.studyHoursPerWeek && (
              <div style={errorMessage}>{errors.studyHoursPerWeek}</div>
            )}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Tỉ lệ có mặt (%) *</label>
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
              Điểm thi trước đó (thang điểm 100) *
            </label>
            <input
              type="number"
              value={values.pastExamScores}
              onChange={(e) => setValue("pastExamScores", e.target.value)}
              onBlur={() => setFieldTouched("pastExamScores")}
              onFocus={() => setFocusedField("pastExamScores")}
              placeholder="Ví dụ: 75.5"
              min="0"
              max="100"
              step="0.1"
              style={{
                ...formInput,
                ...(touched.pastExamScores && errors.pastExamScores
                  ? formInputError
                  : focusedField === "pastExamScores"
                  ? formInputFocus
                  : {}),
              }}
              disabled={isSubmitting}
            />
            {touched.pastExamScores && errors.pastExamScores && (
              <div style={errorMessage}>{errors.pastExamScores}</div>
            )}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>
              Trình độ học vấn của phụ huynh *
            </label>
            <select
              value={values.parentalEducationLevel}
              onChange={(e) => setValue("parentalEducationLevel", e.target.value)}
              onBlur={() => setFieldTouched("parentalEducationLevel")}
              onFocus={() => setFocusedField("parentalEducationLevel")}
              style={{
                ...formInput,
                ...(touched.parentalEducationLevel && errors.parentalEducationLevel
                  ? formInputError
                  : focusedField === "parentalEducationLevel"
                  ? formInputFocus
                  : {}),
              }}
              disabled={isSubmitting}
            >
              <option value="">-- Chọn trình độ --</option>
              <option value="HighSchool">HighSchool</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
            </select>
            {touched.parentalEducationLevel && errors.parentalEducationLevel && (
              <div style={errorMessage}>{errors.parentalEducationLevel}</div>
            )}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Truy cập internet tại nhà *</label>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="internetAccessAtHome"
                  value="Yes"
                  checked={values.internetAccessAtHome === "Yes"}
                  onChange={(e) => setValue("internetAccessAtHome", e.target.value)}
                  onBlur={() => setFieldTouched("internetAccessAtHome")}
                  disabled={isSubmitting}
                  style={{ marginRight: "0.5rem", cursor: "pointer" }}
                />
                Yes
              </label>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="internetAccessAtHome"
                  value="No"
                  checked={values.internetAccessAtHome === "No"}
                  onChange={(e) => setValue("internetAccessAtHome", e.target.value)}
                  onBlur={() => setFieldTouched("internetAccessAtHome")}
                  disabled={isSubmitting}
                  style={{ marginRight: "0.5rem", cursor: "pointer" }}
                />
                No
              </label>
            </div>
            {touched.internetAccessAtHome && errors.internetAccessAtHome && (
              <div style={errorMessage}>{errors.internetAccessAtHome}</div>
            )}
          </div>

          <div style={formGroup}>
            <label style={formLabel}>Hoạt động ngoại khóa *</label>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="extracurricularActivities"
                  value="Yes"
                  checked={values.extracurricularActivities === "Yes"}
                  onChange={(e) => setValue("extracurricularActivities", e.target.value)}
                  onBlur={() => setFieldTouched("extracurricularActivities")}
                  disabled={isSubmitting}
                  style={{ marginRight: "0.5rem", cursor: "pointer" }}
                />
                Yes
              </label>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="extracurricularActivities"
                  value="No"
                  checked={values.extracurricularActivities === "No"}
                  onChange={(e) => setValue("extracurricularActivities", e.target.value)}
                  onBlur={() => setFieldTouched("extracurricularActivities")}
                  disabled={isSubmitting}
                  style={{ marginRight: "0.5rem", cursor: "pointer" }}
                />
                No
              </label>
            </div>
            {touched.extracurricularActivities && errors.extracurricularActivities && (
              <div style={errorMessage}>{errors.extracurricularActivities}</div>
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
            {isSubmitting ? "Đang dự đoán..." : "📊 Dự đoán điểm thi cuối kì"}
          </button>
        </form>

        {result && (
          <div style={resultContainer}>
            {result.error ? (
              <>
                <h2 style={resultTitle}>Lỗi</h2>
                <div style={{ color: "#e74c3c", padding: "1rem" }}>
                  {result.error}
                </div>
              </>
            ) : (
              <>
                <h2 style={resultTitle}>Kết quả dự đoán</h2>
                <div style={resultGrade}>{result.finalExamScore}/100</div>
                <div style={resultDetails}>
                  <div>
                    <strong>Thời gian học:</strong> {result.inputs.studyHoursPerWeek}{" "}
                    giờ/tuần
                  </div>
                  <div>
                    <strong>Tỉ lệ có mặt:</strong> {result.inputs.attendanceRate}%
                  </div>
                  <div>
                    <strong>Điểm thi trước đó:</strong> {result.inputs.pastExamScores}
                    /100
                  </div>
                  <div>
                    <strong>Trình độ phụ huynh:</strong> {result.inputs.parentalEducationLevel}
                  </div>
                  <div>
                    <strong>Internet tại nhà:</strong> {result.inputs.internetAccessAtHome}
                  </div>
                  <div>
                    <strong>Hoạt động ngoại khóa:</strong> {result.inputs.extracurricularActivities}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictPage;
