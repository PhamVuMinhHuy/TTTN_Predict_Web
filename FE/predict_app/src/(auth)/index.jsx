import React, { useState } from "react";
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
  footerStyle,
} from "../../assets/styles/auth.styles";
import Signup from "./signup";

function LoginForm({ onSwitch }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} style={formStyle}>
      <div>
        <label style={labelStyle}>Địa chỉ email</label>
        <input
          type="email"
          required
          placeholder="Nhập email của bạn"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Mật khẩu</label>
        <input
          type="password"
          required
          placeholder="Nhập mật khẩu của bạn"
          style={inputStyle}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button type="submit" style={primaryButton}>
          Đăng nhập
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <button
          type="button"
          style={smallLink}
          onClick={() => window.alert("Quên mật khẩu - placeholder")}
        >
          Quên mật khẩu?
        </button>
        <div style={footerStyle}>
          Bạn chưa có tài khoản?{" "}
          <button
            style={{ ...smallLink, marginLeft: 6 }}
            onClick={() => onSwitch("register")}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </form>
  );
}

// Register form moved into src/(auth)/signup.jsx as Signup component

export default function Auth() {
  const [mode, setMode] = useState("login");

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <div style={brandStyle}>Chào mừng trở lại!</div>
            <div style={subtitleStyle}>
              Đăng nhập vào hệ thống dự đoán điểm học tập
            </div>
          </div>
          {/* tabs removed - single-column card design like the mock */}
        </div>

        {mode === "login" ? (
          <LoginForm onSwitch={setMode} />
        ) : (
          <Signup onBack={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}
