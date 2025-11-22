import pickle
import joblib
import os
from django.conf import settings
from pathlib import Path
import numpy as np
import pandas as pd

class PredictionService:
    _model = None
    _encoder = None
    _model_path = None
    _encoder_path = None

    @classmethod
    def _get_model_path(cls):
        """Lấy đường dẫn đến file model.pkl"""
        if cls._model_path is None:
            # Tìm file model.pkl trong thư mục backend
            base_dir = Path(__file__).resolve().parent.parent.parent
            model_file = base_dir / "model.pkl"
            if model_file.exists():
                cls._model_path = str(model_file)
            else:
                raise FileNotFoundError(f"Model file not found at {model_file}")
        return cls._model_path

    @classmethod
    def _get_encoder_path(cls):
        """Lấy đường dẫn đến file encoder.pkl"""
        if cls._encoder_path is None:
            # Tìm file encoder.pkl trong thư mục backend
            base_dir = Path(__file__).resolve().parent.parent.parent
            encoder_file = base_dir / "encoder.pkl"
            if encoder_file.exists():
                cls._encoder_path = str(encoder_file)
            else:
                raise FileNotFoundError(f"Encoder file not found at {encoder_file}")
        return cls._encoder_path

    @classmethod
    def load_model(cls):
        """Load model từ file .pkl sử dụng joblib (lazy loading)"""
        if cls._model is None:
            try:
                model_path = cls._get_model_path()
                print(f"DEBUG: Loading model from {model_path}")
                cls._model = joblib.load(model_path)
                print("DEBUG: Model loaded successfully")
            except Exception as e:
                print(f"DEBUG: Error loading model: {str(e)}")
                raise
        return cls._model

    @classmethod
    def load_encoder(cls):
        """Load encoder từ file .pkl sử dụng joblib (lazy loading)"""
        if cls._encoder is None:
            try:
                encoder_path = cls._get_encoder_path()
                print(f"DEBUG: Loading encoder from {encoder_path}")
                cls._encoder = joblib.load(encoder_path)
                print("DEBUG: Encoder loaded successfully")
            except Exception as e:
                print(f"DEBUG: Error loading encoder: {str(e)}")
                raise
        return cls._encoder

    @classmethod
    def _normalize_categorical_values(cls, input_data):
        """
        Normalize categorical values từ frontend sang format mà encoder mong đợi
        
        Mapping:
        - Parental_Education_Level: "HighSchool" -> "High School"
        - Internet_Access_at_Home: "Yes"/"No" -> giữ nguyên
        - Extracurricular_Activities: "Yes"/"No" -> giữ nguyên
        """
        # Mapping cho Parental Education Level
        education_mapping = {
            'HighSchool': 'High School',
            'highschool': 'High School',
            'High School': 'High School',  # Giữ nguyên nếu đã đúng
            'Bachelors': 'Bachelors',
            'Masters': 'Masters',
            'PhD': 'PhD',
        }
        
        parental_edu = str(input_data.get('parentalEducationLevel', '')).strip()
        normalized_edu = education_mapping.get(parental_edu, parental_edu)
        
        # Normalize Yes/No (case insensitive)
        internet = str(input_data.get('internetAccessAtHome', '')).strip()
        if internet.lower() in ['yes', 'y', 'true', '1']:
            internet = 'Yes'
        elif internet.lower() in ['no', 'n', 'false', '0']:
            internet = 'No'
        
        extracurricular = str(input_data.get('extracurricularActivities', '')).strip()
        if extracurricular.lower() in ['yes', 'y', 'true', '1']:
            extracurricular = 'Yes'
        elif extracurricular.lower() in ['no', 'n', 'false', '0']:
            extracurricular = 'No'
        
        return {
            'parentalEducationLevel': normalized_edu,
            'internetAccessAtHome': internet,
            'extracurricularActivities': extracurricular,
        }

    @classmethod
    def predict(cls, input_data):
        """
        Dự đoán điểm dựa trên input data
        
        Args:
            input_data (dict): Dictionary chứa các features:
                - studyHoursPerWeek: float (tương ứng Study_Hours_per_Week)
                - attendanceRate: float (tương ứng Attendance_Rate)
                - pastExamScores: float (tương ứng Past_Exam_Scores)
                - parentalEducationLevel: str (tương ứng Parental_Education_Level)
                - internetAccessAtHome: str (tương ứng Internet_Access_at_Home)
                - extracurricularActivities: str (tương ứng Extracurricular_Activities)
        
        Returns:
            float: Điểm dự đoán (0-100)
        """
        try:
            # Load model và encoder nếu chưa load
            model = cls.load_model()
            encoder = cls.load_encoder()

            # Normalize categorical values
            normalized = cls._normalize_categorical_values(input_data)
            print(f"DEBUG: Normalized categorical values: {normalized}")

            # Tạo DataFrame với đúng thứ tự columns như khi train
            # Thứ tự: Study_Hours_per_Week, Attendance_Rate, Past_Exam_Scores,
            #         Parental_Education_Level, Internet_Access_at_Home, Extracurricular_Activities
            categorical_cols = ['Parental_Education_Level', 'Internet_Access_at_Home', 'Extracurricular_Activities']
            
            # Tạo DataFrame từ input data với giá trị đã được normalize
            df_input = pd.DataFrame({
                'Study_Hours_per_Week': [float(input_data.get('studyHoursPerWeek', 0))],
                'Attendance_Rate': [float(input_data.get('attendanceRate', 0))],
                'Past_Exam_Scores': [float(input_data.get('pastExamScores', 0))],
                'Parental_Education_Level': [normalized['parentalEducationLevel']],
                'Internet_Access_at_Home': [normalized['internetAccessAtHome']],
                'Extracurricular_Activities': [normalized['extracurricularActivities']],
            })

            print(f"DEBUG: Input DataFrame before encoding:\n{df_input}")

            # Encode categorical columns bằng OrdinalEncoder
            try:
                df_input[categorical_cols] = encoder.transform(df_input[categorical_cols])
                print(f"DEBUG: Input DataFrame after encoding:\n{df_input}")
            except Exception as e:
                print(f"DEBUG: Error encoding categorical features: {str(e)}")
                raise ValueError(f"Error encoding categorical features: {str(e)}")

            # Predict
            prediction = model.predict(df_input)
            
            # Đảm bảo kết quả trong khoảng 0-100
            predicted_score = float(prediction[0]) if hasattr(prediction, '__iter__') else float(prediction)
            predicted_score = max(0, min(100, predicted_score))  # Clamp between 0-100
            
            print(f"DEBUG: Prediction result: {predicted_score}")
            return predicted_score

        except Exception as e:
            print(f"DEBUG: Error in prediction: {str(e)}")
            import traceback
            traceback.print_exc()
            raise

