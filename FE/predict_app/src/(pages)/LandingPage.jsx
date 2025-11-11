import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  landingContainer,
  hero,
  heroContent,
  heroTitle,
  heroSubtitle,
  ctaButton,
  ctaButtonHover,
  heroImage,
  mockChart,
  chartTitle,
  chartBars,
  chartBar,
  chartBarHover,
  barLabel,
  featuresSection,
  sectionTitle,
  featuresGrid,
  featureCard,
  featureCardHover,
  featureIcon,
  featureTitle,
  featureDesc,
  howItWorks,
  stepsContainer,
  step,
  stepNumber,
  stepNumberHover,
  stepContent,
  stepContentTitle,
  stepContentDesc,
  stepArrow,
  ctaSection,
  ctaTitle,
  ctaSubtitle,
  container,
} from '../../assets/styles/landing.styles';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hoveredElement, setHoveredElement] = useState(null);

  const handlePredictNow = () => {
    if (user) {
      navigate('/predict');
    } else {
      navigate('/auth?mode=login');
    }
  };

  const getHoverStyle = (elementType, hoverStyle) => {
    return hoveredElement === elementType ? hoverStyle : {};
  };

  return (
    <div style={landingContainer}>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section style={hero}>
        <div style={heroContent}>
          <h1 style={heroTitle}>
            Dự Đoán Điểm Học Tập Thông Minh
          </h1>
          <p style={heroSubtitle}>
            Sử dụng trí tuệ nhân tạo để dự đoán kết quả học tập, giúp học sinh và giáo viên có cái nhìn tổng quan về tiến độ học tập và đưa ra những khuyến nghị cải thiện hiệu quả.
          </p>
          
          <button 
            style={{
              ...ctaButton,
              ...getHoverStyle('cta-button', ctaButtonHover)
            }}
            onClick={handlePredictNow}
            onMouseEnter={() => setHoveredElement('cta-button')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            🚀 Bắt đầu dự đoán ngay
          </button>
        </div>
        
        <div style={heroImage}>
          <div style={mockChart}>
            <div style={chartTitle}>Biểu đồ dự đoán điểm số</div>
            <div style={chartBars}>
              {[
                { height: '60%', color: '#3b82f6', label: 'Toán' },
                { height: '75%', color: '#10b981', label: 'Văn' },
                { height: '45%', color: '#f59e0b', label: 'Anh' },
                { height: '80%', color: '#8b5cf6', label: 'Lý' },
                { height: '65%', color: '#ef4444', label: 'Hóa' },
              ].map((bar, index) => (
                <div
                  key={index}
                  style={{
                    ...chartBar,
                    height: bar.height,
                    backgroundColor: bar.color,
                    ...getHoverStyle(`chart-bar-${index}`, chartBarHover)
                  }}
                  onMouseEnter={() => setHoveredElement(`chart-bar-${index}`)}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <span style={barLabel}>{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={featuresSection}>
        <div style={container}>
          <h2 style={sectionTitle}>Tính năng nổi bật</h2>
          
          <div style={featuresGrid}>
            {[
              {
                icon: '🎯',
                title: 'Dự đoán chính xác',
                desc: 'Sử dụng thuật toán machine learning hiện đại để dự đoán điểm số với độ chính xác cao, dựa trên dữ liệu học tập lịch sử.',
                id: 'feature-1'
              },
              {
                icon: '📈',
                title: 'Phân tích xu hướng',
                desc: 'Theo dõi tiến độ học tập qua thời gian, phân tích điểm mạnh, điểm yếu và đưa ra khuyến nghị cải thiện cụ thể.',
                id: 'feature-2'
              },
              {
                icon: '⚡',
                title: 'Nhanh chóng',
                desc: 'Chỉ cần nhập thông tin đơn giản về kết quả học tập, hệ thống sẽ đưa ra dự đoán ngay lập tức trong vài giây.',
                id: 'feature-3'
              },
              {
                icon: '👥',
                title: 'Dễ sử dụng',
                desc: 'Giao diện thân thiện, trực quan và dễ hiểu, phù hợp với cả học sinh, phụ huynh và giáo viên.',
                id: 'feature-4'
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  ...featureCard,
                  ...getHoverStyle(feature.id, featureCardHover)
                }}
                onMouseEnter={() => setHoveredElement(feature.id)}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div style={featureIcon}>{feature.icon}</div>
                <h3 style={featureTitle}>{feature.title}</h3>
                <p style={featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={howItWorks}>
        <div style={container}>
          <h2 style={sectionTitle}>Cách thức hoạt động</h2>
          
          <div style={stepsContainer}>
            {[
              {
                number: 1,
                title: 'Đăng ký tài khoản',
                desc: 'Tạo tài khoản miễn phí hoặc đăng nhập vào hệ thống để bắt đầu',
                id: 'step-1'
              },
              {
                number: 2,
                title: 'Nhập thông tin học tập',
                desc: 'Điền các thông tin về điểm số, môn học và các yếu tố ảnh hưởng',
                id: 'step-2'
              },
              {
                number: 3,
                title: 'Nhận kết quả dự đoán',
                desc: 'Xem dự đoán điểm số chi tiết và nhận tư vấn cải thiện kết quả học tập',
                id: 'step-3'
              }
            ].map((stepData, index) => (
              <React.Fragment key={index}>
                <div style={step}>
                  <div
                    style={{
                      ...stepNumber,
                      ...getHoverStyle(stepData.id, stepNumberHover)
                    }}
                    onMouseEnter={() => setHoveredElement(stepData.id)}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    {stepData.number}
                  </div>
                  <div style={stepContent}>
                    <h3 style={stepContentTitle}>{stepData.title}</h3>
                    <p style={stepContentDesc}>{stepData.desc}</p>
                  </div>
                </div>
                {index < 2 && <div style={stepArrow}>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaSection}>
        <div style={container}>
          <h2 style={ctaTitle}>Sẵn sàng khám phá tiềm năng học tập?</h2>
          <p style={ctaSubtitle}>
            Bắt đầu hành trình dự đoán điểm số thông minh và nâng cao kết quả học tập ngay hôm nay. Hoàn toàn miễn phí và dễ sử dụng!
          </p>
          <button 
            style={{
              ...ctaButton,
              ...getHoverStyle('cta-button-2', ctaButtonHover)
            }}
            onClick={handlePredictNow}
            onMouseEnter={() => setHoveredElement('cta-button-2')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            🎓 Dự đoán điểm ngay bây giờ
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;