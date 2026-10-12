import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Award,
  UserRound,
  Settings,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Clock3,
} from "lucide-react";

const pageDetails = {
  "/student/courses": {
    title: "My Courses",
    subtitle: "Your learning journey starts here.",
    description:
      "We're preparing your personalized learning space with course materials, lessons, and progress tracking.",
    icon: BookOpen,
    label: "COURSES",
    color: "#feca42",
  },
  "/student/certificates": {
    title: "Certificates",
    subtitle: "Your achievements deserve to shine.",
    description:
      "We're building your certificate center so you can view and access your learning achievements in one place.",
    icon: Award,
    label: "CERTIFICATES",
    color: "#feca42",
  },
  "/student/profile": {
    title: "My Profile",
    subtitle: "Your personal space is coming soon.",
    description:
      "We're preparing your profile page where you will be able to manage your personal information and student details.",
    icon: UserRound,
    label: "PROFILE",
    color: "#feca42",
  },
  "/student/settings": {
    title: "Settings",
    subtitle: "Your preferences, your way.",
    description:
      "We're working on your settings page to help you personalize your learning experience.",
    icon: Settings,
    label: "SETTINGS",
    color: "#feca42",
  },
};

export default function ComingSoon() {
  const location = useLocation();
  const navigate = useNavigate();

  const page = pageDetails[location.pathname] || {
    title: "Coming Soon",
    subtitle: "Something exciting is on the way.",
    description:
      "We're working on this section to make your learning experience even better.",
    icon: Sparkles,
    label: "COMING SOON",
    color: "#feca42",
  };

  const PageIcon = page.icon;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Decorative background */}
        <div style={styles.glow} />
        <div style={styles.dotOne} />
        <div style={styles.dotTwo} />

        {/* Status */}
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          {page.label}
        </div>

        {/* Illustration */}
        <div style={styles.illustration}>
          <div style={styles.orbit} />

          <div style={styles.backCard}>
            <div style={styles.backCardLine} />
            <div style={styles.backCardLineShort} />
            <div style={styles.backCardLine} />
          </div>

          <div style={styles.mainIllustration}>
            <div style={styles.iconCircle}>
              <PageIcon
                size={55}
                strokeWidth={1.7}
                color="#00323f"
              />
            </div>

            <div style={styles.illustrationFooter}>
              <span style={styles.miniDot} />
              <span style={styles.miniLine} />
            </div>
          </div>

          <div style={styles.floatingIcon}>
            <Sparkles size={23} color="#00323f" />
          </div>

          <div style={styles.clockIcon}>
            <Clock3 size={22} color="#00323f" />
          </div>
        </div>

        {/* Text */}
        <div style={styles.content}>
          <p style={styles.eyebrow}>
            <Sparkles size={14} />
            SOMETHING EXCITING IS BREWING
          </p>

          <h1 style={styles.heading}>
            {page.title}
            <br />
            <span style={styles.headingAccent}>Coming Soon!</span>
          </h1>

          <h2 style={styles.subtitle}>{page.subtitle}</h2>

          <p style={styles.description}>{page.description}</p>

          <div style={styles.progressTrack}>
            <div style={styles.progressFill} />
          </div>

          <p style={styles.progressText}>
            <span>Building something better</span>
            <span>In progress</span>
          </p>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.backButton}
            >
              <ArrowLeft size={17} />
              Go Back
            </button>

            <button
              type="button"
              onClick={() => navigate("/student/dashboard")}
              style={styles.homeButton}
            >
              Dashboard
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerLogo}>
            <BookOpen size={15} />
            LMS
          </span>
          <span>Keep learning. Keep growing.</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    width: "100%",
    minHeight: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 12px",
    background: "linear-gradient(180deg, #f4f7fc 0%, #eef2f8 100%)",
    overflow: "hidden",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#00323f",
  },

  card: {
    position: "relative",
    isolation: "isolate",
    width: "100%",
    maxWidth: "780px",
    minWidth: 0,
    padding: "32px 36px 0",
    overflow: "hidden",
    background: "#ffffff",
    border: "1px solid #e8edf4",
    borderRadius: "24px",
    boxShadow: "0 18px 55px rgba(0, 50, 63, 0.08)",
    textAlign: "center",
  },

  glow: {
    position: "absolute",
    zIndex: -1,
    top: "-180px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "420px",
    height: "360px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(254,202,66,0.20) 0%, rgba(254,202,66,0) 70%)",
    pointerEvents: "none",
  },

  dotOne: {
    position: "absolute",
    top: "110px",
    left: "10%",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#feca42",
    opacity: 0.8,
  },

  dotTwo: {
    position: "absolute",
    top: "175px",
    right: "12%",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#00323f",
    opacity: 0.3,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "9px 15px",
    borderRadius: "30px",
    border: "1px solid #f3d778",
    background: "#fff9e6",
    color: "#00323f",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.1px",
  },

  badgeDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#d9a900",
  },

  illustration: {
    position: "relative",
    width: "210px",
    height: "185px",
    margin: "18px auto 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  orbit: {
    position: "absolute",
    width: "170px",
    height: "170px",
    borderRadius: "50%",
    border: "1px dashed #e8d48d",
  },

  backCard: {
    position: "absolute",
    top: "31px",
    left: "27px",
    width: "108px",
    height: "119px",
    padding: "18px 12px",
    borderRadius: "15px",
    background: "#fff8df",
    border: "1px solid #f4df9b",
    transform: "rotate(-12deg)",
  },

  backCardLine: {
    height: "6px",
    width: "100%",
    marginBottom: "9px",
    borderRadius: "5px",
    background: "#f1dfa6",
  },

  backCardLineShort: {
    height: "6px",
    width: "65%",
    marginBottom: "9px",
    borderRadius: "5px",
    background: "#f1dfa6",
  },

  mainIllustration: {
    position: "relative",
    zIndex: 1,
    width: "116px",
    padding: "12px",
    borderRadius: "22px",
    background: "linear-gradient(145deg, #ffffff, #fff7d9)",
    border: "1px solid #f0d778",
    boxShadow: "0 15px 32px rgba(0, 50, 63, 0.12)",
    transform: "rotate(5deg)",
  },

  iconCircle: {
    width: "90px",
    height: "90px",
    borderRadius: "18px",
    background: "#feca42",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  illustrationFooter: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    marginTop: "12px",
    padding: "0 3px",
  },

  miniDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#198754",
  },

  miniLine: {
    width: "48px",
    height: "5px",
    borderRadius: "4px",
    background: "#dfe6ed",
  },

  floatingIcon: {
    position: "absolute",
    zIndex: 2,
    top: "20px",
    right: "20px",
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    background: "#feca42",
    boxShadow: "0 8px 18px rgba(0, 50, 63, 0.10)",
    transform: "rotate(9deg)",
  },

  clockIcon: {
    position: "absolute",
    zIndex: 2,
    bottom: "19px",
    left: "15px",
    width: "43px",
    height: "43px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#ffffff",
    border: "1px solid #e5eaf0",
    boxShadow: "0 6px 16px rgba(0, 50, 63, 0.10)",
  },

  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: "540px",
    margin: "0 auto",
  },

  eyebrow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    margin: "0 0 13px",
    color: "#9a7800",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.3px",
  },

  heading: {
    margin: "0",
    color: "#00323f",
    fontSize: "clamp(30px, 5vw, 43px)",
    fontWeight: 850,
    lineHeight: 1.17,
    letterSpacing: "-1.5px",
  },

  headingAccent: {
    color: "#bd8e00",
  },

  subtitle: {
    margin: "18px 0 10px",
    color: "#263746",
    fontSize: "17px",
    fontWeight: 700,
    lineHeight: 1.5,
  },

  description: {
    maxWidth: "440px",
    margin: "0 auto",
    color: "#748091",
    fontSize: "14px",
    lineHeight: 1.8,
  },

  progressTrack: {
    width: "100%",
    maxWidth: "290px",
    height: "6px",
    margin: "24px auto 9px",
    borderRadius: "10px",
    background: "#edf0f4",
    overflow: "hidden",
  },

  progressFill: {
    width: "55%",
    height: "100%",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #fbc02d, #feca42)",
  },

  progressText: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    maxWidth: "290px",
    margin: "0 auto",
    color: "#8a95a3",
    fontSize: "10px",
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "12px",
    margin: "27px 0 30px",
  },

  backButton: {
    minHeight: "45px",
    padding: "0 20px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    border: "1px solid #dfe5eb",
    borderRadius: "11px",
    background: "#ffffff",
    color: "#00323f",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },

  homeButton: {
    minHeight: "45px",
    padding: "0 22px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    border: "1px solid #feca42",
    borderRadius: "11px",
    background: "#feca42",
    color: "#00323f",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
  },

  footer: {
    minHeight: "54px",
    margin: "0 -36px",
    padding: "14px 24px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    borderTop: "1px solid #edf0f4",
    background: "#fcfcfd",
    color: "#8a95a3",
    fontSize: "11px",
  },

  footerLogo: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#00323f",
    fontSize: "13px",
    fontWeight: 850,
  },
};