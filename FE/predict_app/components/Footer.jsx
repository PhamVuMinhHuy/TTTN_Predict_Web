import React from "react";
import { footer, footerText, container } from "../assets/styles/landing.styles";

const Footer = () => {
  return (
    <footer style={footer}>
      <div style={container}>
        <p style={footerText}>
          © 2024 PredictGrade - Hệ thống dự đoán điểm học tập thông minh | Phát
          triển bởi TTTN
        </p>
      </div>
    </footer>
  );
};

export default Footer;
