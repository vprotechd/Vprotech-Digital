import { Link } from "react-router-dom";

// Put your picture at src/assets/aboutt.jpg (adjust the path/name if yours is different)
import aboutBg from ".././assets/aboutt.jpg";

/**
 * Verification  (landing page with the two choices)
 * Usage: <Verification />
 *
 * Props
 *  - navOffset        space kept free for your fixed navbar (number = px, or any CSS value). Default 80px.
 *  - backgroundImage  override the background picture
 *  - studentPath      route of the student page   (default "/studentverification")
 *  - employeePath     route of the employee page  (default "/employeeverification")
 */

const CapIcon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path d="M24 8 3 19l21 11 21-11L24 8Z" />
    <path d="M12 25v9c0 3 6 6 12 6s12-3 12-6v-9" />
    <path d="M45 19v12" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <path d="M2 13h20" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function Verification({
  navOffset = "var(--navbar-height, 80px)",
  backgroundImage = aboutBg,
  studentPath = "/studentverification",
  employeePath = "/employeeverification",
}) {
  const navValue = typeof navOffset === "number" ? `${navOffset}px` : navOffset;

  const choices = [
    {
      key: "student",
      to: studentPath,
      Icon: CapIcon,
      title: "Student verification",
      text: "Check a training record using the reference number on the student’s certificate.",
    },
    {
      key: "employee",
      to: employeePath,
      Icon: BriefcaseIcon,
      title: "Employee verification",
      text: "Confirm employment using the employee ID from an ID card or offer letter.",
    },
  ];

  return (
    <div className="vh-root" style={{ "--vh-nav": navValue }}>
      <style>{css}</style>

      <div className="vh-bg" style={{ backgroundImage: `url(${backgroundImage})` }} aria-hidden="true" />
      <div className="vh-wash" aria-hidden="true" />

      <main className="vh-shell">
        <header className="vh-hero">
          <span className="vh-chip">VProTech Digital</span>
          <h1>Who would you like to verify?</h1>
          <p>
            Choose a type below, enter the ID, and review the details that come up.
          </p>
        </header>

        <nav className="vh-cards" aria-label="Verification type">
          {choices.map(({ key, to, Icon, title, text }, i) => (
            <Link key={key} to={to} className={`vh-card vh-${key}`} style={{ "--d": `${0.25 + i * 0.1}s` }}>
              <span className="vh-icon">
                <Icon />
              </span>

              <span className="vh-body">
                <strong>{title}</strong>
                <span>{text}</span>
              </span>

              <span className="vh-go" aria-hidden="true">
                <ArrowIcon />
              </span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&display=swap');

.vh-root{
  --ink:#0d1b2e; --ink-soft:#506074; --field:#f1f5fa;
  --blue:#1769e0; --blue-dark:#0f4fc4; --sky:#3fa4f9; --amber:#f2b04a; --amber-dark:#d98d1f;
  position:relative; isolation:isolate; box-sizing:border-box; overflow:clip;
  min-height:100vh; min-height:100dvh;
  padding:calc(var(--vh-nav, 0px) + clamp(20px,4vw,56px)) clamp(14px,4vw,40px) calc(clamp(32px,6vw,80px) + env(safe-area-inset-bottom));
  display:flex; align-items:center; justify-content:center;
  font-family:'Figtree',system-ui,sans-serif; color:var(--ink); background:#0a1a33;
}
.vh-root *,.vh-root *::before,.vh-root *::after{box-sizing:border-box}

/* background picture + colour wash */
.vh-bg{position:fixed;inset:0;z-index:-2;background-size:cover;background-position:center;background-repeat:no-repeat;
  transform-origin:50% 40%;animation:vh-kenburns 30s ease-in-out infinite alternate}
@keyframes vh-kenburns{to{transform:scale(1.09)}}
.vh-wash{position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:
    radial-gradient(800px 460px at 50% 0%, rgba(63,164,249,.30), transparent 62%),
    linear-gradient(180deg, rgba(6,18,40,.90) 0%, rgba(10,40,95,.80) 55%, rgba(6,18,40,.92) 100%)}

.vh-shell{width:100%;max-width:560px;margin:0 auto}

/* hero */
.vh-hero{text-align:center;color:#fff;margin:0 auto clamp(22px,4vw,34px)}
.vh-hero > *{animation:vh-rise .8s cubic-bezier(.2,.8,.2,1) both}
.vh-hero > :nth-child(2){animation-delay:.08s}
.vh-hero > :nth-child(3){animation-delay:.16s}
@keyframes vh-rise{from{opacity:0;transform:translateY(20px)}}

.vh-chip{display:inline-block;padding:7px 15px;border-radius:999px;background:rgba(255,255,255,.1);
  border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(8px);font-weight:600;font-size:13px}
.vh-hero h1{margin:18px 0 10px;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;
  font-size:clamp(28px,5vw,42px);line-height:1.12;letter-spacing:-.02em}
.vh-hero p{margin:0 auto;max-width:44ch;font-size:clamp(14.5px,1.6vw,16.5px);line-height:1.65;color:#cfdcf0}

/* compact vertical list of choices */
.vh-cards{display:flex;flex-direction:column;gap:14px}

.vh-card{
  position:relative; display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:16px;
  padding:16px 18px; background:rgba(255,255,255,.96); border:1px solid rgba(255,255,255,.6); border-radius:18px;
  color:inherit; text-decoration:none; overflow:hidden;
  box-shadow:0 24px 50px -26px rgba(2,10,28,.85);
  backdrop-filter:blur(12px);
  animation:vh-up .7s var(--d) cubic-bezier(.2,.8,.2,1) both;
  transition:transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s, background .25s;
}
@keyframes vh-up{from{opacity:0;transform:translateY(24px)}}

/* thin accent bar on the left edge, tinted per card */
.vh-card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px}
.vh-student::before{background:linear-gradient(180deg,var(--sky),var(--blue-dark))}
.vh-employee::before{background:linear-gradient(180deg,#ffd48a,var(--amber-dark))}

.vh-icon{width:52px;height:52px;border-radius:14px;display:grid;place-items:center;flex:none}
.vh-student .vh-icon{background:#e8f1ff}
.vh-employee .vh-icon{background:#fff3dc}
.vh-icon svg{width:26px;height:26px;fill:none;stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round}
.vh-student .vh-icon svg{stroke:var(--blue)}
.vh-employee .vh-icon svg{stroke:var(--amber-dark)}

.vh-body{display:flex;flex-direction:column;gap:3px;min-width:0}
.vh-body strong{font-size:17px;font-weight:700;letter-spacing:-.005em}
.vh-body span{font-size:14px;line-height:1.5;color:var(--ink-soft)}

.vh-go{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:var(--field);color:var(--ink-soft);
  transition:background .25s,color .25s,transform .25s}
.vh-go svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round}

@media (hover:hover){
  .vh-card:hover{transform:translateY(-3px);background:#fff;box-shadow:0 30px 60px -24px rgba(2,10,28,.9)}
  .vh-card:hover .vh-go{background:var(--blue);color:#fff;transform:translateX(3px)}
}
.vh-card:active{transform:scale(.99)}
.vh-card:focus-visible{outline:3px solid var(--amber);outline-offset:3px}

@media (max-width:480px){
  .vh-root{align-items:flex-start}
  .vh-card{gap:12px;padding:14px 14px 14px 16px;border-radius:16px}
  .vh-icon{width:44px;height:44px;border-radius:12px}
  .vh-icon svg{width:22px;height:22px}
  .vh-body strong{font-size:16px}
  .vh-body span{font-size:13.5px}
  .vh-go{width:34px;height:34px}
}

@media (prefers-reduced-motion:reduce){
  .vh-root *,.vh-root *::before,.vh-root *::after{animation-duration:.01ms!important;animation-delay:0ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}
`;