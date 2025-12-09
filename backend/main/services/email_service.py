from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


class EmailService:
    """Service để gửi email"""
    
    @staticmethod
    def send_otp_email(email, otp_code):
        """Gửi mã OTP qua email"""
        subject = 'Mã OTP đặt lại mật khẩu - Predict Learning'
        
        # HTML email template
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }}
                .otp-box {{
                    background: white;
                    border: 2px solid #667eea;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                    margin: 20px 0;
                }}
                .otp-code {{
                    font-size: 32px;
                    font-weight: bold;
                    color: #667eea;
                    letter-spacing: 8px;
                    margin: 10px 0;
                }}
                .warning {{
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    color: #6c757d;
                    margin-top: 30px;
                    font-size: 14px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Đặt lại mật khẩu</h1>
                </div>
                <div class="content">
                    <p>Xin chào,</p>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Đây là mã OTP của bạn:</p>
                    
                    <div class="otp-box">
                        <p style="margin: 0; color: #6c757d;">Mã OTP của bạn</p>
                        <div class="otp-code">{otp_code}</div>
                        <p style="margin: 0; color: #6c757d; font-size: 14px;">Mã này có hiệu lực trong 10 phút</p>
                    </div>
                    
                    <div class="warning">
                        <strong>⚠️ Lưu ý bảo mật:</strong>
                        <ul style="margin: 10px 0 0 0;">
                            <li>Không chia sẻ mã OTP này với bất kỳ ai</li>
                            <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                            <li>Mã OTP sẽ hết hạn sau 10 phút</li>
                        </ul>
                    </div>
                    
                    <p>Nếu bạn gặp bất kỳ vấn đề nào, vui lòng liên hệ với chúng tôi.</p>
                    
                    <div class="footer">
                        <p>© Predict Learning. All rights reserved.</p>
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Đặt lại mật khẩu - Predict Learning
        
        Xin chào,
        
        Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.
        
        Mã OTP của bạn là: {otp_code}
        
        Mã này có hiệu lực trong 10 phút.
        
        Lưu ý bảo mật:
        - Không chia sẻ mã OTP này với bất kỳ ai
        - Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này
        
        ©  Predict Learning
        """
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error sending OTP email: {str(e)}")
            return False
    
    @staticmethod
    def send_password_reset_success_email(email):
        """Gửi email thông báo đặt lại mật khẩu thành công"""
        subject = 'Mật khẩu đã được đặt lại - Predict Learning'
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }}
                .success-box {{
                    background: #d1fae5;
                    border: 2px solid #10b981;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    color: #6c757d;
                    margin-top: 30px;
                    font-size: 14px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Đặt lại mật khẩu thành công</h1>
                </div>
                <div class="content">
                    <p>Xin chào,</p>
                    
                    <div class="success-box">
                        <h2 style="color: #059669; margin: 0;">🎉 Hoàn tất!</h2>
                        <p style="margin: 10px 0 0 0;">Mật khẩu của bạn đã được đặt lại thành công.</p>
                    </div>
                    
                    <p>Bạn có thể đăng nhập ngay bây giờ với mật khẩu mới của mình.</p>
                    
                    <p><strong>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.</strong></p>
                    
                    <div class="footer">
                        <p>©  Predict Learning. All rights reserved.</p>
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Đặt lại mật khẩu thành công - Predict Learning
        
        Xin chào,
        
        Mật khẩu của bạn đã được đặt lại thành công.
        
        Bạn có thể đăng nhập ngay bây giờ với mật khẩu mới của mình.
        
        Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.
        
        ©  Predict Learning
        """
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error sending success email: {str(e)}")
            return False
    
    @staticmethod
    def send_prediction_result_email(student_email, student_name, teacher_name, input_data, predicted_score):
        """Gửi email kết quả dự đoán cho học sinh"""
        subject = f'Kết quả dự đoán điểm học tập - Từ giáo viên {teacher_name}'
        
        # Format input data for display
        parental_level_map = {
            'High School': 'Trung học phổ thông',
            'Bachelor': 'Cử nhân',
            'Master': 'Thạc sĩ',
            'PhD': 'Tiến sĩ'
        }
        
        internet_map = {
            'Yes': 'Có',
            'No': 'Không'
        }
        
        extracurricular_map = {
            'Yes': 'Có',
            'No': 'Không'
        }
        
        # Get score color based on value
        if predicted_score >= 80:
            score_color = '#10b981'  # Green
            score_label = 'Xuất sắc'
        elif predicted_score >= 65:
            score_color = '#3b82f6'  # Blue
            score_label = 'Khá'
        elif predicted_score >= 50:
            score_color = '#f59e0b'  # Orange
            score_label = 'Trung bình'
        else:
            score_color = '#ef4444'  # Red
            score_label = 'Cần cải thiện'
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }}
                .score-box {{
                    background: white;
                    border: 3px solid {score_color};
                    border-radius: 15px;
                    padding: 25px;
                    text-align: center;
                    margin: 25px 0;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }}
                .score-value {{
                    font-size: 48px;
                    font-weight: bold;
                    color: {score_color};
                    margin: 10px 0;
                }}
                .score-label {{
                    font-size: 18px;
                    color: {score_color};
                    font-weight: 600;
                }}
                .teacher-info {{
                    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
                    border-left: 4px solid #667eea;
                    padding: 15px 20px;
                    margin: 20px 0;
                    border-radius: 0 8px 8px 0;
                }}
                .data-table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }}
                .data-table th {{
                    background: #667eea;
                    color: white;
                    padding: 12px 15px;
                    text-align: left;
                }}
                .data-table td {{
                    padding: 12px 15px;
                    border-bottom: 1px solid #eee;
                }}
                .data-table tr:last-child td {{
                    border-bottom: none;
                }}
                .data-table tr:nth-child(even) {{
                    background: #f8f9fa;
                }}
                .footer {{
                    text-align: center;
                    color: #6c757d;
                    margin-top: 30px;
                    font-size: 14px;
                }}
                .highlight {{
                    color: #667eea;
                    font-weight: 600;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 Kết quả dự đoán điểm học tập</h1>
                    <p style="margin: 0; opacity: 0.9;">Predict Learning System</p>
                </div>
                <div class="content">
                    <p>Xin chào <strong>{student_name}</strong>,</p>
                    
                    <div class="teacher-info">
                        <p style="margin: 0;">
                            👨‍🏫 <strong>Giáo viên:</strong> <span class="highlight">{teacher_name}</span> đã thực hiện dự đoán điểm học tập cho bạn.
                        </p>
                    </div>
                    
                    <div class="score-box">
                        <p style="margin: 0; color: #6c757d; font-size: 16px;">Điểm dự đoán của bạn</p>
                        <div class="score-value">{predicted_score}/100</div>

                    </div>
                    
                    <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                        📋 Thông tin đầu vào
                    </h3>
                    
                    <table class="data-table">
                        <tr>
                            <th colspan="2">Chi tiết dữ liệu học tập</th>
                        </tr>
                        <tr>
                            <td><strong>📚 Số giờ học/tuần</strong></td>
                            <td>{input_data.get('studyHoursPerWeek', 'N/A')} giờ</td>
                        </tr>
                        <tr>
                            <td><strong>✅ Tỉ lệ đi học</strong></td>
                            <td>{input_data.get('attendanceRate', 'N/A')}%</td>
                        </tr>
                        <tr>
                            <td><strong>📝 Điểm thi trước đó</strong></td>
                            <td>{input_data.get('pastExamScores', 'N/A')}/100</td>
                        </tr>
                        <tr>
                            <td><strong>🎓 Trình độ phụ huynh</strong></td>
                            <td>{parental_level_map.get(input_data.get('parentalEducationLevel', ''), input_data.get('parentalEducationLevel', 'N/A'))}</td>
                        </tr>
                        <tr>
                            <td><strong>🌐 Internet tại nhà</strong></td>
                            <td>{internet_map.get(input_data.get('internetAccessAtHome', ''), input_data.get('internetAccessAtHome', 'N/A'))}</td>
                        </tr>
                        <tr>
                            <td><strong>🎯 Hoạt động ngoại khóa</strong></td>
                            <td>{extracurricular_map.get(input_data.get('extracurricularActivities', ''), input_data.get('extracurricularActivities', 'N/A'))}</td>
                        </tr>
                    </table>
                    
                    <p style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 0 8px 8px 0;">
                        💡 <strong>Lưu ý:</strong> Đây là kết quả dự đoán dựa trên mô hình học máy. 
                        Kết quả thực tế có thể khác biệt. Hãy tiếp tục nỗ lực học tập!
                    </p>
                    
                    <div class="footer">
                        <p>©  Predict Learning. All rights reserved.</p>
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Kết quả dự đoán điểm học tập - Predict Learning
        
        Xin chào {student_name},
        
        Giáo viên {teacher_name} đã thực hiện dự đoán điểm học tập cho bạn.
        
        === KẾT QUẢ DỰ ĐOÁN ===
        Điểm dự đoán: {predicted_score}/100
        
        === THÔNG TIN ĐẦU VÀO ===
        - Số giờ học/tuần: {input_data.get('studyHoursPerWeek', 'N/A')} giờ
        - Tỉ lệ đi học: {input_data.get('attendanceRate', 'N/A')}%
        - Điểm thi trước đó: {input_data.get('pastExamScores', 'N/A')}/100
        - Trình độ phụ huynh: {input_data.get('parentalEducationLevel', 'N/A')}
        - Internet tại nhà: {input_data.get('internetAccessAtHome', 'N/A')}
        - Hoạt động ngoại khóa: {input_data.get('extracurricularActivities', 'N/A')}
        
        Lưu ý: Đây là kết quả dự đoán dựa trên mô hình học máy. 
        Kết quả thực tế có thể khác biệt.
        
        ©  Predict Learning
        """
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[student_email],
                html_message=html_message,
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error sending prediction result email: {str(e)}")
            return False

