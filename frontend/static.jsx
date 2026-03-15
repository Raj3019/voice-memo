import { useState, useEffect, useRef } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const themes = {
  dark: {
    bg: "#0B0B12",
    surface: "#13131E",
    card: "#1C1C2E",
    cardHover: "#222235",
    border: "#2A2A40",
    accent: "#E07A5F",
    accentSoft: "#E07A5F22",
    accentGlow: "#E07A5F44",
    gold: "#F2CC8F",
    teal: "#81B29A",
    text: "#F0EDE8",
    textSub: "#9998B3",
    textMuted: "#55546A",
    inputBg: "#1C1C2E",
    navBg: "#13131Eee",
    waveColor: "#E07A5F",
    tagBg: "#252538",
    pill: "#E07A5F",
    danger: "#E05F5F",
    success: "#81B29A",
    shadow: "0 4px 24px #00000055",
    cardShadow: "0 2px 12px #00000033",
  },
  light: {
    bg: "#F5F2EC",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    cardHover: "#F9F7F4",
    border: "#E8E4DE",
    accent: "#E07A5F",
    accentSoft: "#E07A5F18",
    accentGlow: "#E07A5F33",
    gold: "#C9973C",
    teal: "#4A8C6F",
    text: "#1A1826",
    textSub: "#6B6880",
    textMuted: "#A8A5B8",
    inputBg: "#F5F2EC",
    navBg: "#FFFFFFee",
    waveColor: "#E07A5F",
    tagBg: "#F0EDE8",
    pill: "#E07A5F",
    danger: "#D94F4F",
    success: "#4A8C6F",
    shadow: "0 4px 24px #00000015",
    cardShadow: "0 2px 12px #0000000D",
  },
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 1.8 }) => {
  const paths = {
    mic: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    folder: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
    play: <><polygon points="5 3 19 12 5 21 5 3"/></>,
    pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    back: <><polyline points="15 18 9 12 15 6"/></>,
    close: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon: <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
    upload: <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    moreV: <><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></>,
    tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    wave: <><path d="M2 12h2M6 6v12M10 9v6M14 4v16M18 9v6M22 12h-2"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    google: <><path d="M21.805 10.023H12v3.977h5.618C16.923 16.2 14.693 17.5 12 17.5c-3.033 0-5.5-2.467-5.5-5.5S8.967 6.5 12 6.5c1.395 0 2.663.52 3.627 1.373l2.829-2.83C16.686 3.39 14.465 2.5 12 2.5 6.753 2.5 2.5 6.753 2.5 12S6.753 21.5 12 21.5c5.248 0 9.5-3.798 9.5-9.5 0-.656-.07-1.295-.195-1.977z"/></>,
    apple: <><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/><path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff: <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    bookOpen: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// ─── WAVEFORM ─────────────────────────────────────────────────────────────────
const Waveform = ({ color, animated = false, bars = 28, height = 36 }) => {
  const heights = [30, 55, 40, 80, 60, 90, 45, 70, 85, 50, 65, 95, 55, 75, 40, 85, 60, 70, 50, 90, 65, 45, 80, 55, 40, 70, 55, 35];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height }}>
      {heights.slice(0, bars).map((h, i) => (
        <div
          key={i}
          style={{
            width: 2.5,
            height: `${h}%`,
            borderRadius: 99,
            background: color,
            opacity: animated ? 0.9 : 0.5 + (h / 200),
            animation: animated ? `wave ${0.8 + (i % 5) * 0.15}s ease-in-out infinite alternate` : "none",
            animationDelay: `${i * 0.04}s`,
          }}
        />
      ))}
      <style>{`@keyframes wave { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
    </div>
  );
};

// ─── RECORDING PULSE ──────────────────────────────────────────────────────────
const RecordingPulse = ({ color }) => (
  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        position: "absolute",
        width: 80 + i * 30,
        height: 80 + i * 30,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        opacity: 0.3 - i * 0.08,
        animation: `pulse 2s ease-out infinite`,
        animationDelay: `${i * 0.5}s`,
      }}/>
    ))}
    <style>{`@keyframes pulse { 0%{transform:scale(0.95);opacity:0.4} 100%{transform:scale(1.15);opacity:0} }`}</style>
  </div>
);

// ─── NOTE CARD ────────────────────────────────────────────────────────────────
const NoteCard = ({ t, title, category, duration, time, hasAudio, onClick }) => (
  <div onClick={onClick} style={{
    background: t.card,
    border: `1px solid ${t.border}`,
    borderRadius: 16,
    padding: "14px 16px",
    marginBottom: 12,
    boxShadow: t.cardShadow,
    cursor: "pointer",
    transition: "all 0.18s",
  }}
    onMouseEnter={e => e.currentTarget.style.background = t.cardHover}
    onMouseLeave={e => e.currentTarget.style.background = t.card}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: t.text, fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.2px", lineHeight: 1.3, maxWidth: "75%" }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {hasAudio && <Icon name="mic" size={13} color={t.accent} />}
        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "monospace" }}>{time}</span>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {category && (
        <span style={{ fontSize: 11, background: t.accentSoft, color: t.accent, padding: "2px 8px", borderRadius: 99, fontWeight: 500 }}>
          {category}
        </span>
      )}
      {duration && <span style={{ fontSize: 11, color: t.textMuted }}>{duration}</span>}
    </div>
  </div>
);

// ─── BOTTOM NAV ──────────────────────────────────────────────────────────────
const BottomNav = ({ t, screen, onNavigate }) => {
  const items = [
    { id: "home", icon: "home", label: "Notes" },
    { id: "search", icon: "search", label: "Search" },
    { id: "categories", icon: "folder", label: "Categories" },
    { id: "profile", icon: "user", label: "Profile" },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: t.navBg,
      backdropFilter: "blur(20px)",
      borderTop: `1px solid ${t.border}`,
      display: "flex",
      padding: "10px 0 20px",
      zIndex: 10,
    }}>
      {items.map(item => {
        const active = screen === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
          }}>
            <Icon name={item.icon} size={22} color={active ? t.accent : t.textMuted} strokeWidth={active ? 2.2 : 1.6} />
            <span style={{ fontSize: 10, color: active ? t.accent : t.textMuted, fontWeight: active ? 600 : 400 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

const SplashScreen = ({ t, onNext }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 32, textAlign: "center", background: t.bg }}>
    <div style={{ marginBottom: 32, position: "relative" }}>
      <div style={{ width: 90, height: 90, borderRadius: 28, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${t.accentGlow}` }}>
        <Icon name="mic" size={42} color="#fff" strokeWidth={1.5} />
      </div>
    </div>
    <div style={{ fontSize: 36, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-1px", marginBottom: 8 }}>
      Voco
    </div>
    <div style={{ fontSize: 14, color: t.textSub, lineHeight: 1.6, marginBottom: 48, maxWidth: 240 }}>
      Capture thoughts as they come. AI does the rest.
    </div>
    <Waveform color={t.accent} bars={24} height={40} />
    <div style={{ height: 48 }} />
    <button onClick={onNext} style={{
      width: "100%", padding: "16px 0", borderRadius: 16, background: t.accent,
      border: "none", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer",
      letterSpacing: "-0.2px", boxShadow: `0 8px 32px ${t.accentGlow}`,
    }}>Get Started</button>
    <button onClick={onNext} style={{ marginTop: 16, background: "none", border: "none", color: t.textSub, fontSize: 14, cursor: "pointer", padding: 8 }}>
      I already have an account →
    </button>
  </div>
);

const LoginScreen = ({ t, onNavigate }) => {
  const [showPw, setShowPw] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "24px 24px 32px", background: t.bg, overflowY: "auto" }}>
      <div style={{ marginTop: 32, marginBottom: 40 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.8px", marginBottom: 6 }}>Welcome back 👋</div>
        <div style={{ fontSize: 14, color: t.textSub }}>Log in to your Voco account</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "14px 16px" }}>
          <Icon name="mail" size={17} color={t.textMuted} />
          <span style={{ fontSize: 15, color: t.textMuted }}>you@example.com</span>
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Password</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "14px 16px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="lock" size={17} color={t.textMuted} />
            <span style={{ fontSize: 15, color: t.textMuted }}>••••••••</span>
          </div>
          <button onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Icon name={showPw ? "eye" : "eyeOff"} size={17} color={t.textMuted} />
          </button>
        </div>
      </div>
      <div style={{ textAlign: "right", marginBottom: 28 }}>
        <span style={{ fontSize: 13, color: t.accent, cursor: "pointer" }}>Forgot password?</span>
      </div>
      <button onClick={() => onNavigate("home")} style={{ width: "100%", padding: "16px 0", borderRadius: 16, background: t.accent, border: "none", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", boxShadow: `0 8px 32px ${t.accentGlow}`, marginBottom: 20 }}>
        Log In
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: t.border }} />
        <span style={{ fontSize: 12, color: t.textMuted }}>or continue with</span>
        <div style={{ flex: 1, height: 1, background: t.border }} />
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        {["google", "apple"].map(p => (
          <button key={p} style={{ flex: 1, padding: "14px 0", borderRadius: 14, background: t.card, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
            <Icon name={p} size={18} color={t.text} />
            <span style={{ fontSize: 14, color: t.text, fontWeight: 500, textTransform: "capitalize" }}>{p}</span>
          </button>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: 14, color: t.textSub }}>Don't have an account? </span>
        <span onClick={() => onNavigate("signup")} style={{ fontSize: 14, color: t.accent, fontWeight: 600, cursor: "pointer" }}>Sign Up</span>
      </div>
    </div>
  );
};

const SignupScreen = ({ t, onNavigate }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "24px 24px 32px", background: t.bg, overflowY: "auto" }}>
    <button onClick={() => onNavigate("login")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6, marginBottom: 28, color: t.textSub }}>
      <Icon name="back" size={18} color={t.textSub} /><span style={{ fontSize: 14 }}>Back</span>
    </button>
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.8px", marginBottom: 6 }}>Create account</div>
      <div style={{ fontSize: 14, color: t.textSub }}>Start capturing your thoughts today</div>
    </div>
    {["Full Name", "Email", "Password", "Confirm Password"].map((label, i) => (
      <div key={i} style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>{label}</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "14px 16px" }}>
          <Icon name={i === 0 ? "user" : i === 1 ? "mail" : "lock"} size={17} color={t.textMuted} />
          <span style={{ fontSize: 15, color: t.textMuted }}>{label}</span>
        </div>
      </div>
    ))}
    <div style={{ height: 12 }} />
    <button onClick={() => onNavigate("home")} style={{ width: "100%", padding: "16px 0", borderRadius: 16, background: t.accent, border: "none", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", boxShadow: `0 8px 32px ${t.accentGlow}` }}>
      Create Account
    </button>
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <span style={{ fontSize: 14, color: t.textSub }}>Already have an account? </span>
      <span onClick={() => onNavigate("login")} style={{ fontSize: 14, color: t.accent, fontWeight: 600, cursor: "pointer" }}>Log In</span>
    </div>
  </div>
);

const HomeScreen = ({ t, onNavigate }) => {
  const notes = [
    { title: "Team sync ideas for Q3 product roadmap", category: "Work", duration: "2:34", time: "Today", hasAudio: true },
    { title: "Grocery list & weekend errands reminder", category: "Personal", duration: null, time: "Yesterday", hasAudio: false },
    { title: "Podcast note: Lex Fridman on consciousness", category: "Learning", duration: "1:12", time: "Mon", hasAudio: true },
    { title: "Morning reflection — felt really energised", category: "Journal", duration: "0:48", time: "Mon", hasAudio: true },
    { title: "React query caching strategy for the app", category: "Work", duration: null, time: "Sun", hasAudio: false },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <div style={{ padding: "52px 24px 16px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 2 }}>Good morning ☀️</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.5px" }}>Your Notes</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onNavigate("search")} style={{ width: 38, height: 38, borderRadius: 12, background: t.card, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="search" size={17} color={t.textSub} />
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16, overflowX: "auto", paddingBottom: 2 }}>
          {["All", "Work", "Personal", "Learning", "Journal"].map((cat, i) => (
            <div key={i} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 99, background: i === 0 ? t.accent : t.tagBg, fontSize: 13, color: i === 0 ? "#fff" : t.textSub, fontWeight: i === 0 ? 600 : 400, cursor: "pointer" }}>{cat}</div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 100px" }}>
        <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 12 }}>Recent — {notes.length} notes</div>
        {notes.map((n, i) => (
          <NoteCard key={i} t={t} {...n} onClick={() => onNavigate("noteDetail")} />
        ))}
      </div>
      <button onClick={() => onNavigate("createNote")} style={{
        position: "absolute", right: 22, bottom: 80, width: 54, height: 54, borderRadius: "50%",
        background: t.accent, border: "none", display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", boxShadow: `0 8px 28px ${t.accentGlow}`, zIndex: 20,
      }}>
        <Icon name="plus" size={24} color="#fff" strokeWidth={2.5} />
      </button>
      <BottomNav t={t} screen="home" onNavigate={onNavigate} />
    </div>
  );
};

const SearchScreen = ({ t, onNavigate }) => {
  const [mode, setMode] = useState("text");
  const results = [
    { title: "React query caching strategy", category: "Work", time: "Sun", hasAudio: false, duration: null },
    { title: "Podcast note: Lex Fridman on consciousness", category: "Learning", time: "Mon", hasAudio: true, duration: "1:12" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <div style={{ padding: "52px 24px 16px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.5px", marginBottom: 16 }}>Search</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 16px", marginBottom: 14 }}>
          <Icon name="search" size={17} color={t.textMuted} />
          <span style={{ fontSize: 15, color: t.textMuted }}>Search notes…</span>
        </div>
        <div style={{ display: "flex", background: t.tagBg, borderRadius: 12, padding: 4 }}>
          {["text", "semantic"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px 0", borderRadius: 9, background: mode === m ? t.accent : "transparent", border: "none", color: mode === m ? "#fff" : t.textSub, fontSize: 13, fontWeight: mode === m ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}>
              {m === "text" ? "🔤 Text" : "🧠 Semantic"}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 100px" }}>
        {mode === "semantic" && (
          <div style={{ background: t.accentSoft, border: `1px solid ${t.accent}44`, borderRadius: 12, padding: "12px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <Icon name="zap" size={15} color={t.accent} />
            <span style={{ fontSize: 12.5, color: t.accent, lineHeight: 1.5 }}>AI-powered search understands meaning, not just keywords</span>
          </div>
        )}
        <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 12 }}>Results</div>
        {results.map((n, i) => <NoteCard key={i} t={t} {...n} onClick={() => onNavigate("noteDetail")} />)}
      </div>
      <BottomNav t={t} screen="search" onNavigate={onNavigate} />
    </div>
  );
};

const NoteDetailScreen = ({ t, onNavigate }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <div style={{ padding: "52px 24px 16px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={() => onNavigate("home")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: t.textSub }}>
            <Icon name="back" size={20} color={t.textSub} /><span style={{ fontSize: 14 }}>Notes</span>
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onNavigate("editNote")} style={{ width: 36, height: 36, borderRadius: 11, background: t.card, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="edit" size={16} color={t.textSub} />
            </button>
            <button style={{ width: 36, height: 36, borderRadius: 11, background: t.card, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="trash" size={16} color={t.danger} />
            </button>
          </div>
        </div>
        <span style={{ fontSize: 11, background: t.accentSoft, color: t.accent, padding: "3px 10px", borderRadius: 99, fontWeight: 500, display: "inline-block", marginBottom: 10 }}>Work</span>
        <div style={{ fontSize: 22, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.5px", marginBottom: 6 }}>Team sync ideas for Q3 product roadmap</div>
        <div style={{ fontSize: 12, color: t.textMuted, display: "flex", gap: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={12} color={t.textMuted} /> Today, 9:41 AM</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="mic" size={12} color={t.textMuted} /> 2:34</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 32px" }}>
        {/* Audio player */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 18, padding: "16px 18px", marginBottom: 20, boxShadow: t.cardShadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <button onClick={() => setPlaying(!playing)} style={{ width: 42, height: 42, borderRadius: "50%", background: t.accent, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 4px 16px ${t.accentGlow}`, flexShrink: 0 }}>
              <Icon name={playing ? "pause" : "play"} size={18} color="#fff" />
            </button>
            <div style={{ flex: 1 }}>
              <Waveform color={t.waveColor} animated={playing} bars={30} height={32} />
            </div>
            <span style={{ fontSize: 12, color: t.textMuted, fontFamily: "monospace", flexShrink: 0 }}>2:34</span>
          </div>
          <div style={{ height: 3, background: t.border, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: "35%", height: "100%", background: t.accent, borderRadius: 99 }} />
          </div>
        </div>
        {/* AI summary */}
        <div style={{ background: t.accentSoft, border: `1px solid ${t.accent}33`, borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Icon name="zap" size={14} color={t.accent} />
            <span style={{ fontSize: 12, fontWeight: 700, color: t.accent, letterSpacing: "0.5px" }}>AI SUMMARY</span>
          </div>
          <div style={{ fontSize: 14, color: t.text, lineHeight: 1.7 }}>Discussion about Q3 roadmap priorities, focusing on user retention features, onboarding improvements, and the search functionality overhaul.</div>
        </div>
        {/* Transcript */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 12 }}>Transcript</div>
          <div style={{ fontSize: 14.5, color: t.text, lineHeight: 1.9, fontFamily: "Georgia, serif" }}>
            Okay so I wanted to jot down a few ideas before the team sync tomorrow. First thing — we really need to nail the onboarding flow, I've seen a huge drop-off in week two. Maybe we add a progress bar or some kind of goal-setting prompt on day one...
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateNoteScreen = ({ t, onNavigate }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
    <div style={{ padding: "52px 24px 16px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: t.textSub, fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="close" size={18} color={t.textSub} /> Cancel
        </button>
        <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>New Note</div>
        <button style={{ background: t.accent, border: "none", borderRadius: 99, padding: "6px 16px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Save</button>
      </div>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 8 }}>Title</div>
        <div style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "14px 16px" }}>
          <span style={{ fontSize: 16, color: t.textMuted, fontFamily: "'Fraunces', Georgia, serif" }}>Note title…</span>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 8 }}>Category</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Work", "Personal", "Learning", "Journal", "+ New"].map((c, i) => (
            <span key={i} style={{ padding: "6px 14px", borderRadius: 99, background: i === 0 ? t.accent : t.tagBg, color: i === 0 ? "#fff" : t.textSub, fontSize: 13, fontWeight: i === 0 ? 600 : 400, cursor: "pointer" }}>{c}</span>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 8 }}>Description</div>
        <div style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "14px 16px", minHeight: 160 }}>
          <span style={{ fontSize: 15, color: t.textMuted, lineHeight: 1.7 }}>Start typing your note…</span>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => onNavigate("audioUpload")} style={{ width: "100%", padding: "14px 0", borderRadius: 14, background: t.accentSoft, border: `1.5px dashed ${t.accent}66`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer" }}>
          <Icon name="mic" size={18} color={t.accent} />
          <span style={{ fontSize: 15, color: t.accent, fontWeight: 500 }}>Attach voice memo</span>
        </button>
      </div>
    </div>
  </div>
);

const AudioUploadScreen = ({ t, onNavigate }) => {
  const [state, setState] = useState("idle"); // idle, recording, processing, done
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <div style={{ padding: "52px 24px 16px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <button onClick={() => onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Icon name="back" size={20} color={t.textSub} />
          </button>
          <div style={{ fontSize: 20, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif" }}>Voice Memo</div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 32px", gap: 0 }}>
        {state === "idle" && (
          <>
            <div style={{ fontSize: 14, color: t.textSub, marginBottom: 48, textAlign: "center" }}>Tap the mic to start recording or upload an audio file</div>
            <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 48 }}>
              <RecordingPulse color={t.accent} />
              <button onClick={() => setState("recording")} style={{ position: "relative", width: 80, height: 80, borderRadius: "50%", background: t.accent, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 8px 32px ${t.accentGlow}`, zIndex: 1 }}>
                <Icon name="mic" size={32} color="#fff" />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <div style={{ flex: 1, height: 1, background: t.border }} /><span style={{ fontSize: 12, color: t.textMuted }}>or</span><div style={{ flex: 1, height: 1, background: t.border }} />
            </div>
            <button style={{ width: "100%", padding: "14px 0", borderRadius: 14, background: t.card, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer" }}>
              <Icon name="upload" size={18} color={t.textSub} /><span style={{ fontSize: 15, color: t.textSub, fontWeight: 500 }}>Upload audio file</span>
            </button>
          </>
        )}
        {state === "recording" && (
          <>
            <div style={{ width: "100%", marginBottom: 40 }}>
              <Waveform color={t.accent} animated bars={34} height={60} />
            </div>
            <div style={{ fontSize: 40, fontWeight: 200, color: t.text, fontFamily: "monospace", marginBottom: 8, letterSpacing: 2 }}>0:42</div>
            <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 40, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.danger, animation: "blink 1s infinite" }} />
              Recording
              <style>{`@keyframes blink{50%{opacity:0}}`}</style>
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <button onClick={() => setState("idle")} style={{ width: 52, height: 52, borderRadius: "50%", background: t.card, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="trash" size={20} color={t.danger} />
              </button>
              <button onClick={() => setState("processing")} style={{ width: 68, height: 68, borderRadius: "50%", background: t.danger, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 8px 32px ${t.danger}44` }}>
                <div style={{ width: 22, height: 22, borderRadius: 4, background: "#fff" }} />
              </button>
              <div style={{ width: 52, height: 52 }} />
            </div>
          </>
        )}
        {state === "processing" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: `1px solid ${t.accent}44` }}>
              <Icon name="zap" size={32} color={t.accent} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: t.text, fontFamily: "'Fraunces', Georgia, serif", marginBottom: 8 }}>AI is processing your memo…</div>
            <div style={{ fontSize: 13, color: t.textSub, lineHeight: 1.6, marginBottom: 32 }}>Transcribing → Generating title & summary → Creating embeddings</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Transcribing audio (Deepgram)", "Generating title & summary (Groq)", "Creating embeddings (Gemini)"].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: i === 0 ? t.success : i === 1 ? t.accent : t.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {i < 2 && <Icon name="check" size={11} color="#fff" />}
                  </div>
                  <span style={{ fontSize: 13, color: i < 2 ? t.text : t.textMuted }}>{step}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate("noteDetail")} style={{ marginTop: 32, background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 20px", color: t.textSub, fontSize: 13, cursor: "pointer" }}>
              Continue in background
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoriesScreen = ({ t, onNavigate }) => {
  const cats = [
    { name: "Work", count: 12, color: "#E07A5F" },
    { name: "Personal", count: 8, color: "#81B29A" },
    { name: "Learning", count: 15, color: "#F2CC8F" },
    { name: "Journal", count: 6, color: "#9E86D0" },
    { name: "Ideas", count: 4, color: "#6DC8D4" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <div style={{ padding: "52px 24px 16px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.5px" }}>Categories</div>
          <button style={{ width: 36, height: 36, borderRadius: 11, background: t.accent, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="plus" size={18} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {cats.map((cat, i) => (
            <div key={i} onClick={() => onNavigate("home")} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 18, padding: "18px 16px", cursor: "pointer", boxShadow: t.cardShadow, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -10, bottom: -10, width: 60, height: 60, borderRadius: "50%", background: cat.color + "22" }} />
              <div style={{ width: 36, height: 36, borderRadius: 12, background: cat.color + "22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon name="folder" size={18} color={cat.color} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 4 }}>{cat.name}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{cat.count} notes</div>
            </div>
          ))}
          <div style={{ background: t.tagBg, border: `1.5px dashed ${t.border}`, borderRadius: 18, padding: "18px 16px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 100 }}>
            <Icon name="plus" size={24} color={t.textMuted} />
            <div style={{ fontSize: 13, color: t.textMuted, marginTop: 8 }}>New Category</div>
          </div>
        </div>
      </div>
      <BottomNav t={t} screen="categories" onNavigate={onNavigate} />
    </div>
  );
};

const ProfileScreen = ({ t, onNavigate }) => {
  const items = [
    { icon: "settings", label: "Preferences", sub: "Themes, language, defaults" },
    { icon: "bell", label: "Notifications", sub: "Reminders and alerts" },
    { icon: "lock", label: "Security", sub: "Password & biometrics" },
    { icon: "star", label: "Upgrade to Pro", sub: "Unlimited AI processing", accent: true },
    { icon: "bookOpen", label: "Help & FAQ", sub: "Get support" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <div style={{ padding: "52px 24px 20px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${t.accent}, ${t.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", flexShrink: 0 }}>A</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif" }}>Alex Rivera</div>
            <div style={{ fontSize: 13, color: t.textSub }}>alex@example.com</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, background: t.card, borderRadius: 14, overflow: "hidden", border: `1px solid ${t.border}` }}>
          {[["45", "Notes"], ["5", "Categories"], ["28 min", "Recorded"]].map(([val, label], i) => (
            <div key={i} style={{ flex: 1, padding: "12px 0", textAlign: "center", borderRight: i < 2 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{val}</div>
              <div style={{ fontSize: 11, color: t.textMuted }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 100px" }}>
        {items.map((item, i) => item.label !== "bell" && (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: item.accent ? t.accentSoft : t.card, border: `1px solid ${item.accent ? t.accent + "44" : t.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: item.accent ? t.accent : t.tagBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={item.icon || "settings"} size={18} color={item.accent ? "#fff" : t.textSub} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: item.accent ? t.accent : t.text }}>{item.label}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{item.sub}</div>
            </div>
            <Icon name="back" size={16} color={t.textMuted} style={{ transform: "rotate(180deg)" }} />
          </div>
        ))}
        <button onClick={() => onNavigate("login")} style={{ width: "100%", padding: "14px 0", borderRadius: 14, background: "transparent", border: `1px solid ${t.danger}44`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", marginTop: 8 }}>
          <Icon name="logout" size={16} color={t.danger} />
          <span style={{ fontSize: 15, color: t.danger, fontWeight: 500 }}>Sign Out</span>
        </button>
      </div>
      <BottomNav t={t} screen="profile" onNavigate={onNavigate} />
    </div>
  );
};

const EditNoteScreen = ({ t, onNavigate }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
    <div style={{ padding: "52px 24px 16px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => onNavigate("noteDetail")} style={{ background: "none", border: "none", cursor: "pointer", color: t.textSub, fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="close" size={18} color={t.textSub} /> Cancel
        </button>
        <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Edit Note</div>
        <button onClick={() => onNavigate("noteDetail")} style={{ background: t.accent, border: "none", borderRadius: 99, padding: "6px 16px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Save</button>
      </div>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 8 }}>Title</div>
        <div style={{ background: t.inputBg, border: `1.5px solid ${t.accent}`, borderRadius: 14, padding: "14px 16px" }}>
          <span style={{ fontSize: 16, color: t.text, fontFamily: "'Fraunces', Georgia, serif" }}>Team sync ideas for Q3 product roadmap</span>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 8 }}>Category</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Work", "Personal", "Learning", "Journal"].map((c, i) => (
            <span key={i} style={{ padding: "6px 14px", borderRadius: 99, background: i === 0 ? t.accent : t.tagBg, color: i === 0 ? "#fff" : t.textSub, fontSize: 13, fontWeight: i === 0 ? 600 : 400, cursor: "pointer" }}>{c}</span>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 8 }}>Description</div>
        <div style={{ background: t.inputBg, border: `1.5px solid ${t.accent}`, borderRadius: 14, padding: "14px 16px", minHeight: 180 }}>
          <span style={{ fontSize: 15, color: t.text, lineHeight: 1.8, fontFamily: "Georgia, serif" }}>Discussion about Q3 roadmap priorities, focusing on user retention features, onboarding improvements, and the search functionality overhaul.</span>
        </div>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════
const SCREENS = [
  { id: "splash", label: "Splash" },
  { id: "login", label: "Login" },
  { id: "signup", label: "Sign Up" },
  { id: "home", label: "Home" },
  { id: "search", label: "Search" },
  { id: "noteDetail", label: "Note Detail" },
  { id: "createNote", label: "New Note" },
  { id: "editNote", label: "Edit Note" },
  { id: "audioUpload", label: "Voice Memo" },
  { id: "categories", label: "Categories" },
  { id: "profile", label: "Profile" },
];

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [screen, setScreen] = useState("splash");
  const t = themes[isDark ? "dark" : "light"];

  const renderScreen = () => {
    const props = { t, onNavigate: setScreen };
    switch (screen) {
      case "splash": return <SplashScreen {...props} onNext={() => setScreen("login")} />;
      case "login": return <LoginScreen {...props} />;
      case "signup": return <SignupScreen {...props} />;
      case "home": return <HomeScreen {...props} />;
      case "search": return <SearchScreen {...props} />;
      case "noteDetail": return <NoteDetailScreen {...props} />;
      case "createNote": return <CreateNoteScreen {...props} />;
      case "editNote": return <EditNoteScreen {...props} />;
      case "audioUpload": return <AudioUploadScreen {...props} />;
      case "categories": return <CategoriesScreen {...props} />;
      case "profile": return <ProfileScreen {...props} />;
      default: return <HomeScreen {...props} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", background: isDark ? "#0A0A10" : "#E8E4DC", padding: "24px 16px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header controls */}
      <div style={{ width: "100%", maxWidth: 400, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: isDark ? "#F0EDE8" : "#1A1826", fontFamily: "'Fraunces', serif", letterSpacing: "-0.5px" }}>
          🎙 Voco
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setIsDark(!isDark)} style={{ width: 36, height: 36, borderRadius: 10, background: isDark ? "#1C1C2E" : "#fff", border: `1px solid ${isDark ? "#2A2A40" : "#E0DCE0"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name={isDark ? "sun" : "moon"} size={16} color={isDark ? "#F2CC8F" : "#555"} />
          </button>
        </div>
      </div>

      {/* Screen nav pills */}
      <div style={{ width: "100%", maxWidth: 400, display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16, justifyContent: "center" }}>
        {SCREENS.map(s => (
          <button key={s.id} onClick={() => setScreen(s.id)} style={{ padding: "5px 12px", borderRadius: 99, background: screen === s.id ? t.accent : isDark ? "#1C1C2E" : "#fff", border: `1px solid ${screen === s.id ? t.accent : isDark ? "#2A2A40" : "#E0DCE0"}`, color: screen === s.id ? "#fff" : isDark ? "#9998B3" : "#6B6880", fontSize: 12, cursor: "pointer", fontWeight: screen === s.id ? 600 : 400, transition: "all 0.15s" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Phone frame */}
      <div style={{
        width: 375, height: 780,
        borderRadius: 48,
        background: isDark ? "#0B0B12" : "#F5F2EC",
        boxShadow: isDark ? "0 32px 80px #00000088, 0 0 0 1px #2A2A40, inset 0 1px 0 #ffffff10" : "0 32px 80px #00000030, 0 0 0 1px #D8D4CE, inset 0 1px 0 #ffffff80",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 32, background: isDark ? "#0B0B12" : "#F5F2EC", borderRadius: "0 0 20px 20px", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: isDark ? "#2A2A40" : "#D8D4CE" }} />
          <div style={{ width: 40, height: 5, borderRadius: 3, background: isDark ? "#2A2A40" : "#D8D4CE" }} />
        </div>
        <div style={{ position: "absolute", inset: 0 }}>
          {renderScreen()}
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: 12, color: isDark ? "#55546A" : "#AAA5B8", textAlign: "center" }}>
        Click any screen button above to navigate • Tap elements inside the phone
      </div>
    </div>
  );
}