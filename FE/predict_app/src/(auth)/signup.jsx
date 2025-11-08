import React from "react";
import {
  containerStyle,
  cardStyle,
  headerStyle,
  brandStyle,
  subtitleStyle,
  formStyle,
  labelStyle,
  inputStyle,
  primaryButton,
  smallLink,
} from "../../assets/styles/auth.styles";

// UI-only Signup page. onBack should be a function that navigates back to login (e.g. setMode('login')).
export default function Signup({ onBack }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <div style={brandStyle}>Tạo tài khoản mới</div>
            <div style={subtitleStyle}>Điền thông tin để tạo tài khoản</div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} style={formStyle}>
          <div>
            <label style={labelStyle}>Địa chỉ email</label>
            <input
              type="email"
              required
              placeholder="abc@gmail.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Mật khẩu</label>
            <input
              type="password"
              required
              placeholder="Ít nhất 8 ký tự"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Xác nhận mật khẩu</label>
            <input
              type="password"
              required
              placeholder="Nhập lại mật khẩu"
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: 14 }}>
            <button type="submit" style={primaryButton}>
              Hoàn tất đăng ký
            </button>
          </div>

          <div style={{ marginTop: 12, textAlign: "center" }}>
            <button type="button" style={smallLink} onClick={onBack}>
              Quay lại Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
