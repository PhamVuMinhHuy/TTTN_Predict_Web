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
                        <p>© 2024 Predict Learning. All rights reserved.</p>
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
        
        © 2024 Predict Learning
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
                        <p>© 2024 Predict Learning. All rights reserved.</p>
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
        
        © 2024 Predict Learning
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
