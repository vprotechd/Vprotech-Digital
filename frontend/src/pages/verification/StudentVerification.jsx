import { useEffect, useMemo, useRef, useState } from "react";

// Put your picture at src/assets/designn.jpg (adjust the path if your folder is different)
import designBg from "../../assets/designn.jpg";

/**
 * StudentVerification
 * Usage: <StudentVerification />
 *
 * Flow: only the Reference number box is shown at first. After the student enters it
 * and clicks "Look up" (or presses Enter), all the other details appear, filled in.
 *
 * Props
 *  - navOffset        space kept free for your fixed navbar (number = px, or any CSS value). Default 80px.
 *  - backgroundImage  override the background picture (defaults to ../assets/designn.jpg)
 *
 * No dependencies besides React. Styles are scoped under .sv-root.
 * Replace `fetchStudent` with your real API call (return null when nothing is found).
 */

const EMPTY = {
  reference: "",
  firstName: "",
  lastName: "",
  gender: "",
  fatherName: "",
  email: "",
  phone: "",
  college: "",
  course: "",
  duration: "",
  joiningDate: "",
  address: "",
};

const REQUIRED = Object.keys(EMPTY);

// --- Demo lookup. Swap for a real request, e.g. fetch(`/api/students/${ref}`) ---
// Return null/undefined when the reference number does not exist.
const fetchStudent = (reference) =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          firstName: "Aarav",
          lastName: "Sharma",
          gender: "Male",
          fatherName: "Rajesh Sharma",
          email: "aarav.sharma@example.com",
          phone: "9876543210",
          college: "Government College of Engineering, Solan, Himachal Pradesh",
          course: "B.Tech Computer Science",
          duration: "6 months",
          joiningDate: "2024-08-01",
          address: "Ward 5, Near Bus Stand, Kalka, Himachal Pradesh 173204",
        }),
      1200
    )
  );

const validate = (v) => {
  const e = {};
  if (!v.reference.trim()) e.reference = "Enter the reference number";
  if (!v.firstName.trim()) e.firstName = "First name is required";
  if (!v.lastName.trim()) e.lastName = "Last name is required";
  if (!v.gender) e.gender = "Choose a gender";
  if (!v.fatherName.trim()) e.fatherName = "Father's name is required";
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email address";
  if (!/^\d{10}$/.test(v.phone)) e.phone = "Phone must be 10 digits";
  if (!v.college.trim()) e.college = "College name and address are required";
  if (!v.course.trim()) e.course = "Course is required";
  if (!v.duration.trim()) e.duration = "Duration is required";
  if (!v.joiningDate) e.joiningDate = "Pick the joining date";
  if (!v.address.trim()) e.address = "Address is required";
  return e;
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/* ---------- small icon set (stroke icons, 24px grid) ---------- */
const ICONS = {
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  ),
  college: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  pin: (
    <>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  hash: <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  close: <path d="M18 6 6 18M6 6l12 12" />,
};

const Icon = ({ name, className = "sv-ico" }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

/* Defined outside the page component so inputs keep focus while typing */
const Field = ({ label, id, error, span, icon, children }) => (
  <div className={`sv-field ${span ? "span-2" : ""}`}>
    <label className="sv-label" htmlFor={id}>
      {label}
    </label>
    <div className={`sv-ctl ${icon ? "has-icon" : ""}`}>
      {icon && <Icon name={icon} />}
      {children}
    </div>
    <span className={`sv-error ${error ? "is-on" : ""}`} role="alert">
      {error || "\u00A0"}
    </span>
  </div>
);

const Section = ({ icon, title }) => (
  <div className="sv-sec">
    <span className="sv-sec-ico">
      <Icon name={icon} />
    </span>
    <h3>{title}</h3>
  </div>
);

export default function StudentVerification({
  navOffset = "var(--navbar-height, 80px)",
  backgroundImage = designBg,
}) {
  const navValue = typeof navOffset === "number" ? `${navOffset}px` : navOffset;

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false); // details stay hidden until a lookup succeeds
  const [verified, setVerified] = useState(false);
  const [fillWave, setFillWave] = useState(0); // bumps to replay the fill animation
  const refInput = useRef(null);

  const progress = useMemo(() => {
    const done = REQUIRED.filter((k) => String(values[k]).trim() !== "").length;
    return Math.round((done / REQUIRED.length) * 100);
  }, [values]);

  useEffect(() => {
    if (!verified) return undefined;
    const onKey = (e) => e.key === "Escape" && setVerified(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [verified]);

  const set = (key) => (e) => {
    const val = e.target.value;
    setValues((v) => ({ ...v, [key]: val }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const handleShow = async () => {
    if (loading) return;
    if (!values.reference.trim()) {
      setErrors((er) => ({ ...er, reference: "Enter the reference number" }));
      refInput.current?.focus();
      return;
    }
    setLoading(true);
    try {
      const data = await fetchStudent(values.reference.trim());
      if (!data) {
        setFound(false);
        setErrors({ reference: "No student found with this reference number" });
        return;
      }
      setValues((v) => ({ ...v, ...data }));
      setErrors({});
      setFound(true);
      setFillWave((n) => n + 1);
    } catch {
      setErrors({ reference: "Could not look this up. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!found) return handleShow(); // Enter key before lookup = look up
    const er = validate(values);
    setErrors(er);
    if (Object.keys(er).length === 0) setVerified(true);
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setVerified(false);
    setFound(false);
    setFillWave(0);
    setTimeout(() => refInput.current?.focus(), 0);
  };

  // Row-by-row stagger so looked-up data fills in one after another
  const fillClass = fillWave ? `sv-fill-${fillWave % 2}` : "";
  const fillStyle = (i) => (fillWave ? { animationDelay: `${i * 70}ms` } : undefined);

  // shared props for plain text inputs
  const bind = (key, i, extra = {}) => ({
    id: key,
    value: values[key],
    onChange: set(key),
    className: `sv-input ${fillClass} ${errors[key] ? "has-error" : ""}`,
    style: fillStyle(i),
    ...extra,
  });

  return (
    <div className="sv-root" style={{ "--sv-nav": navValue }}>
      <style>{css}</style>

      {/* background picture + colour wash */}
      <div className="sv-bg" style={{ backgroundImage: `url(${backgroundImage})` }} aria-hidden="true" />
      <div className="sv-wash" aria-hidden="true" />

      <div className="sv-shell">
        {/* ---------------- left: intro ---------------- */}
        <aside className="sv-hero">
          <div className="sv-brand">
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 8 3 19l21 11 21-11L24 8Z" />
              <path d="M12 25v9c0 3 6 6 12 6s12-3 12-6v-9" />
              <path d="M45 19v12" />
            </svg>
            <span>VProTech Digital</span>
          </div>

          <h1>
            Check a student’s
            <br />
            training record
          </h1>
          <p className="sv-lead">
            Confirm that a student trained with us. Enter the reference number from their
            certificate and we’ll bring up the details.
          </p>

          <ol className="sv-steps">
            <li>
              <b>1</b>
              <div>
                <strong>Enter the reference number</strong>
                <span>Find it on the student’s certificate or ID.</span>
              </div>
            </li>
            <li>
              <b>2</b>
              <div>
                <strong>Review the details</strong>
                <span>Name, course, college and joining date.</span>
              </div>
            </li>
            <li>
              <b>3</b>
              <div>
                <strong>Confirm the verification</strong>
                <span>You get a verified summary you can keep.</span>
              </div>
            </li>
          </ol>
        </aside>

        {/* ---------------- right: form card ---------------- */}
        <main className={`sv-card ${loading ? "is-loading" : ""}`}>
          <div className="sv-bar" role="progressbar" aria-valuenow={found ? progress : 0} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${found ? progress : 0}%` }} />
          </div>

          <header className="sv-card-head">
            <div>
              <h2>{found ? "Student details" : "Find a student"}</h2>
              <p>
                {found
                  ? "Review the details below, then confirm."
                  : "Enter the reference number to see the student’s details."}
              </p>
            </div>
            {found && <span className="sv-pill">{progress}% complete</span>}
          </header>

          <form className="sv-form" onSubmit={handleSubmit} noValidate>
            {/* lookup (always visible) */}
            <div className="sv-lookup">
              <label className="sv-label" htmlFor="reference">
                Reference number
              </label>
              <div className="sv-inline">
                <div className="sv-ctl has-icon">
                  <Icon name="hash" />
                  <input
                    ref={refInput}
                    id="reference"
                    className={`sv-input ${errors.reference ? "has-error" : ""}`}
                    value={values.reference}
                    onChange={set("reference")}
                    placeholder="e.g. STU-2024-0148"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  className={`sv-show ${loading ? "is-loading" : ""}`}
                  onClick={handleShow}
                  disabled={loading}
                >
                  <span className="sv-show-text">
                    <Icon name="search" /> Look up
                  </span>
                  <span className="sv-spinner" aria-hidden="true" />
                </button>
              </div>
              <span className={`sv-error ${errors.reference ? "is-on" : ""}`} role="alert">
                {errors.reference || "\u00A0"}
              </span>
            </div>

            {/* everything below appears only after a successful lookup */}
            {found && (
              <div className="sv-details">
                {/* student */}
                <Section icon="user" title="Student" />
                <div className="sv-grid">
                  <Field label="First name" id="firstName" error={errors.firstName} icon="user">
                    <input {...bind("firstName", 0, { autoComplete: "given-name" })} />
                  </Field>
                  <Field label="Last name" id="lastName" error={errors.lastName} icon="user">
                    <input {...bind("lastName", 1, { autoComplete: "family-name" })} />
                  </Field>
                  <Field label="Father’s name" id="fatherName" error={errors.fatherName} icon="user">
                    <input {...bind("fatherName", 2)} />
                  </Field>
                  <Field label="Gender" id="gender-Male" error={errors.gender}>
                    <div
                      className={`sv-segment ${fillClass}`}
                      style={fillStyle(3)}
                      role="radiogroup"
                      aria-label="Gender"
                    >
                      {["Male", "Female", "Other"].map((g) => (
                        <button
                          key={g}
                          id={`gender-${g}`}
                          type="button"
                          role="radio"
                          aria-checked={values.gender === g}
                          className={values.gender === g ? "is-active" : ""}
                          onClick={() => {
                            setValues((v) => ({ ...v, gender: g }));
                            setErrors((er) => ({ ...er, gender: undefined }));
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>

                {/* contact */}
                <Section icon="mail" title="Contact" />
                <div className="sv-grid">
                  <Field label="Email" id="email" error={errors.email} icon="mail">
                    <input {...bind("email", 4, { type: "email", autoComplete: "email" })} />
                  </Field>
                  <Field label="Phone" id="phone" error={errors.phone} icon="phone">
                    <input
                      {...bind("phone", 5, {
                        type: "tel",
                        inputMode: "numeric",
                        maxLength: 10,
                        autoComplete: "tel",
                      })}
                    />
                  </Field>
                </div>

                {/* training */}
                <Section icon="book" title="Training" />
                <div className="sv-grid">
                  <Field label="College name / address" id="college" span error={errors.college} icon="college">
                    <input {...bind("college", 6)} />
                  </Field>
                  <Field label="Course" id="course" span error={errors.course} icon="book">
                    <input {...bind("course", 7)} />
                  </Field>
                  <Field label="Duration" id="duration" error={errors.duration} icon="clock">
                    <input {...bind("duration", 8, { placeholder: "e.g. 6 months" })} />
                  </Field>
                  <Field label="Joining date" id="joiningDate" error={errors.joiningDate} icon="calendar">
                    <input {...bind("joiningDate", 9, { type: "date" })} />
                  </Field>
                </div>

                {/* address */}
                <Section icon="pin" title="Address" />
                <div className="sv-grid">
                  <Field label="Full address" id="address" span error={errors.address}>
                    <textarea
                      {...bind("address", 10, { rows: 3 })}
                      className={`sv-input sv-textarea ${fillClass} ${errors.address ? "has-error" : ""}`}
                    />
                  </Field>
                </div>

                <div className="sv-actions">
                  <button type="button" className="sv-ghost" onClick={reset}>
                    Clear form
                  </button>
                  <button type="submit" className="sv-submit">
                    Verify student
                  </button>
                </div>
              </div>
            )}
          </form>
        </main>
      </div>

      {/* ---------------- success ---------------- */}
      {verified && (
        <div
          className="sv-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Student verified"
          onClick={(e) => e.target === e.currentTarget && setVerified(false)}
        >
          <div className="sv-ticket">
            <button type="button" className="sv-x" onClick={() => setVerified(false)} aria-label="Close">
              <Icon name="close" />
            </button>

            <svg className="sv-seal" viewBox="0 0 120 120" aria-hidden="true">
              <circle className="sv-seal-ring" cx="60" cy="60" r="52" />
              <path className="sv-seal-check" d="M36 62l16 16 32-34" />
            </svg>
            <h2>Verified</h2>
            <p className="sv-ticket-name">
              {values.firstName} {values.lastName}
            </p>

            <dl className="sv-facts">
              <div>
                <dt>Reference</dt>
                <dd>{values.reference}</dd>
              </div>
              <div>
                <dt>Course</dt>
                <dd>{values.course}</dd>
              </div>
              <div>
                <dt>College</dt>
                <dd>{values.college.split(",")[0]}</dd>
              </div>
              <div>
                <dt>Joined</dt>
                <dd>{formatDate(values.joiningDate)}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{values.duration}</dd>
              </div>
            </dl>

            <button type="button" className="sv-submit" onClick={reset}>
              Verify another student
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&display=swap');

.sv-root{
  --ink:#0d1b2e; --ink-soft:#506074; --paper:#ffffff; --field:#f1f5fa; --line:#e1e8f2;
  --blue:#1769e0; --blue-dark:#0f4fc4; --sky:#3fa4f9; --amber:#f2b04a; --rose:#d1435b; --green:#16a37f;
  position:relative; isolation:isolate; box-sizing:border-box;
  min-height:100vh; min-height:100dvh; overflow:clip;
  padding:calc(var(--sv-nav, 0px) + clamp(16px,3.5vw,44px)) clamp(14px,4vw,40px) calc(clamp(28px,6vw,72px) + env(safe-area-inset-bottom));
  font-family:'Figtree',system-ui,sans-serif; color:var(--ink);
  background:#0a1a33;
}
.sv-root *,.sv-root *::before,.sv-root *::after{box-sizing:border-box}

/* ---------- background picture ---------- */
.sv-bg{
  position:fixed; inset:0; z-index:-2;
  background-size:cover; background-position:center; background-repeat:no-repeat;
  transform-origin:60% 40%; animation:sv-kenburns 30s ease-in-out infinite alternate;
}
@keyframes sv-kenburns{to{transform:scale(1.09)}}
.sv-wash{
  position:fixed; inset:0; z-index:-1; pointer-events:none;
  background:
    radial-gradient(900px 500px at 85% 10%, rgba(63,164,249,.28), transparent 60%),
    linear-gradient(105deg, rgba(6,18,40,.94) 0%, rgba(10,40,95,.82) 48%, rgba(8,28,60,.62) 100%);
}

/* ---------- layout ---------- */
.sv-shell{
  width:100%; max-width:1180px; margin:0 auto;
  display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.12fr); gap:clamp(32px,5vw,72px); align-items:start;
}

/* ---------- hero (left) ---------- */
.sv-hero{
  position:sticky; top:calc(var(--sv-nav, 0px) + 28px);
  color:#fff; padding-top:clamp(8px,3vw,40px);
}
.sv-hero > *{animation:sv-rise .8s cubic-bezier(.2,.8,.2,1) both}
.sv-hero > :nth-child(2){animation-delay:.08s}
.sv-hero > :nth-child(3){animation-delay:.16s}
.sv-hero > :nth-child(4){animation-delay:.26s}
@keyframes sv-rise{from{opacity:0;transform:translateY(22px)}}

.sv-brand{display:inline-flex;align-items:center;gap:10px;padding:8px 16px 8px 12px;border-radius:999px;
  background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(8px);
  font-weight:600;font-size:14px}
.sv-brand svg{width:24px;height:24px;fill:none;stroke:var(--amber);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}

.sv-hero h1{
  margin:22px 0 16px; font-family:'Bricolage Grotesque',sans-serif; font-weight:800;
  font-size:clamp(32px,4.6vw,56px); line-height:1.06; letter-spacing:-.02em;
}
.sv-lead{margin:0;max-width:44ch;font-size:clamp(15px,1.5vw,17.5px);line-height:1.7;color:#cfdcf0}

.sv-steps{list-style:none;margin:34px 0 0;padding:0;display:grid;gap:14px;max-width:420px}
.sv-steps li{display:flex;gap:14px;align-items:flex-start}
.sv-steps b{flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;
  font-size:14px;color:#0a1a33;background:linear-gradient(135deg,#ffd48a,var(--amber));box-shadow:0 6px 16px -4px rgba(242,176,74,.55)}
.sv-steps strong{display:block;font-size:15.5px;margin-bottom:2px}
.sv-steps span{font-size:13.5px;color:#aebfd8;line-height:1.5}

/* ---------- card (right) ---------- */
.sv-card{
  position:relative; overflow:hidden; background:rgba(255,255,255,.96);
  border-radius:24px; border:1px solid rgba(255,255,255,.6);
  box-shadow:0 40px 90px -30px rgba(2,10,28,.75), 0 0 0 1px rgba(255,255,255,.08);
  backdrop-filter:blur(14px);
  animation:sv-slide .9s .12s cubic-bezier(.2,.8,.2,1) both;
}
@keyframes sv-slide{from{opacity:0;transform:translateX(34px)}}

.sv-bar{height:5px;background:#e6edf7}
.sv-bar i{display:block;height:100%;border-radius:0 4px 4px 0;background:linear-gradient(90deg,var(--blue),var(--sky));transition:width .6s cubic-bezier(.3,.8,.3,1)}

.sv-card-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:24px clamp(18px,4vw,34px) 6px}
.sv-card-head h2{margin:0;font-family:'Bricolage Grotesque',sans-serif;font-size:clamp(21px,3vw,26px);font-weight:800;letter-spacing:-.01em}
.sv-card-head p{margin:3px 0 0;font-size:13.5px;color:var(--ink-soft)}
.sv-pill{flex:none;padding:6px 12px;border-radius:999px;background:#e8f1ff;color:var(--blue-dark);font-size:12.5px;font-weight:700;animation:sv-rise .5s both}

.sv-form{padding:10px clamp(18px,4vw,34px) clamp(22px,4vw,32px)}

/* lookup box */
.sv-lookup{margin-top:12px;padding:16px;border-radius:16px;background:linear-gradient(135deg,#eaf3ff,#f4f9ff);border:1px dashed #a9c8f5}
.sv-inline{display:flex;gap:10px}
.sv-inline .sv-ctl{flex:1;min-width:0}

/* details revealed after lookup */
.sv-details{animation:sv-reveal .65s cubic-bezier(.2,.8,.2,1) both}
@keyframes sv-reveal{from{opacity:0;transform:translateY(18px)}}

/* section headers */
.sv-sec{display:flex;align-items:center;gap:10px;margin:22px 0 6px}
.sv-sec::after{content:"";flex:1;height:1px;background:var(--line)}
.sv-sec h3{margin:0;font-size:14px;font-weight:700;color:var(--ink)}
.sv-sec-ico{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:#e8f1ff;color:var(--blue)}
.sv-sec-ico .sv-ico{width:15px;height:15px}

/* fields */
.sv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 16px}
.span-2{grid-column:1/-1}
.sv-field{min-width:0}
.sv-label{display:block;margin:10px 0 6px;font-size:13px;font-weight:600;color:var(--ink-soft)}
.sv-lookup .sv-label{margin-top:0;color:var(--blue-dark)}
.sv-ctl{position:relative}
.sv-ico{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.sv-ctl > .sv-ico{position:absolute;left:14px;top:14px;color:#8aa0bb;pointer-events:none;transition:color .2s}
.sv-ctl:focus-within > .sv-ico{color:var(--blue)}

.sv-input{
  width:100%; min-height:46px; padding:11px 14px; font:inherit; font-size:16px; color:var(--ink);
  -webkit-appearance:none; appearance:none;
  background:var(--field); border:2px solid transparent; border-radius:12px; outline:none;
  transition:border-color .2s, background .2s, box-shadow .2s;
}
.sv-ctl.has-icon .sv-input{padding-left:42px}
.sv-input::placeholder{color:#94a3b8}
.sv-input:hover{background:#e9eff7}
.sv-input:focus{background:#fff;border-color:var(--blue);box-shadow:0 0 0 4px rgba(23,105,224,.14)}
.sv-input.has-error{border-color:var(--rose);background:#fff4f6;animation:sv-shake .35s}
.sv-textarea{resize:vertical;min-height:90px;padding-top:12px}
input[type=date].sv-input{display:block;text-align:left}
@keyframes sv-shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}

.sv-error{display:block;min-height:18px;padding:3px 2px 0;font-size:12px;color:var(--rose);opacity:0;transform:translateY(-4px);transition:.2s}
.sv-error.is-on{opacity:1;transform:none}

/* looked-up values flash in, row by row */
.sv-fill-0,.sv-fill-1{animation-duration:1s;animation-fill-mode:both}
.sv-fill-0{animation-name:sv-flash}
.sv-fill-1{animation-name:sv-flash-b}
@keyframes sv-flash{0%{background:#c7e0ff;transform:scale(1.012)}100%{background:var(--field);transform:none}}
@keyframes sv-flash-b{0%{background:#c7e0ff;transform:scale(1.012)}100%{background:var(--field);transform:none}}

/* shimmer on the lookup box while the lookup runs */
.sv-card.is-loading .sv-lookup .sv-input{
  background-image:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.85) 50%,transparent 100%);
  background-size:220% 100%; animation:sv-shimmer 1.1s linear infinite;
}
@keyframes sv-shimmer{from{background-position:120% 0}to{background-position:-120% 0}}

/* look-up button */
.sv-show{
  position:relative;flex:none;min-width:124px;min-height:46px;padding:0 20px;border:0;border-radius:12px;cursor:pointer;
  font:inherit;font-weight:700;font-size:14.5px;color:#fff;
  background:linear-gradient(135deg,var(--blue-dark),var(--sky));
  box-shadow:0 10px 22px -8px rgba(23,105,224,.7);
  transition:transform .15s, box-shadow .2s, filter .2s;
}
.sv-show-text{display:inline-flex;align-items:center;gap:8px;transition:opacity .15s}
.sv-show-text .sv-ico{width:17px;height:17px}
.sv-spinner{position:absolute;inset:0;margin:auto;width:20px;height:20px;border-radius:50%;
  border:3px solid rgba(255,255,255,.4);border-top-color:#fff;opacity:0;animation:sv-spin .7s linear infinite}
.sv-show.is-loading .sv-show-text{opacity:0}
.sv-show.is-loading .sv-spinner{opacity:1}
.sv-show:disabled{cursor:progress;filter:saturate(.85)}
.sv-show:active{transform:scale(.97)}
@keyframes sv-spin{to{transform:rotate(360deg)}}

/* gender segmented control */
.sv-segment{display:flex;padding:4px;background:var(--field);border-radius:12px;gap:2px;min-height:46px;align-items:center}
.sv-segment button{
  flex:1;min-height:38px;padding:6px 8px;border:0;border-radius:9px;background:transparent;cursor:pointer;
  font:inherit;font-size:14px;font-weight:500;color:var(--ink-soft);transition:all .25s cubic-bezier(.3,.8,.3,1)
}
.sv-segment button.is-active{background:#fff;color:var(--blue-dark);font-weight:700;box-shadow:0 3px 10px rgba(13,27,46,.14)}

/* actions */
.sv-actions{display:flex;justify-content:flex-end;align-items:center;gap:12px;margin-top:26px;padding-top:20px;border-top:1px solid var(--line)}
.sv-submit{
  min-height:50px;padding:13px 30px;border:0;border-radius:14px;cursor:pointer;font:inherit;font-weight:700;font-size:15.5px;color:#fff;
  background:linear-gradient(135deg,var(--blue-dark),var(--blue) 55%,var(--sky));
  box-shadow:0 14px 28px -10px rgba(23,105,224,.8);transition:transform .15s, box-shadow .2s;
}
.sv-submit:active{transform:scale(.97)}
.sv-ghost{min-height:50px;padding:12px 18px;border:0;background:none;cursor:pointer;font:inherit;font-weight:600;color:var(--ink-soft);border-radius:12px}
.sv-ghost:hover{background:var(--field)}

@media (hover:hover){
  .sv-show:hover{transform:translateY(-2px);box-shadow:0 14px 26px -8px rgba(23,105,224,.8)}
  .sv-submit:hover{transform:translateY(-2px);box-shadow:0 18px 32px -10px rgba(23,105,224,.9)}
  .sv-segment button:hover{color:var(--ink)}
}
.sv-segment button:focus-visible,.sv-show:focus-visible,.sv-submit:focus-visible,.sv-ghost:focus-visible,.sv-x:focus-visible{outline:3px solid var(--amber);outline-offset:2px}

/* ---------- success ticket ---------- */
.sv-overlay{
  position:fixed; inset:var(--sv-nav, 0px) 0 0 0; z-index:50; overflow-y:auto; display:grid; place-items:center; padding:20px;
  background:rgba(5,14,32,.72); backdrop-filter:blur(8px); animation:sv-fade .3s both;
}
@keyframes sv-fade{from{opacity:0}}
.sv-ticket{
  position:relative; width:100%; max-width:440px; padding:30px 26px 26px; text-align:center;
  background:#fff; border-radius:26px; box-shadow:0 40px 90px -20px rgba(0,0,0,.6);
  animation:sv-pop .55s cubic-bezier(.2,1.2,.4,1) both;
}
@keyframes sv-pop{from{opacity:0;transform:translateY(24px) scale(.94)}}
.sv-x{position:absolute;top:14px;right:14px;width:38px;height:38px;border:0;border-radius:50%;display:grid;place-items:center;background:var(--field);color:var(--ink-soft);cursor:pointer}
.sv-seal{width:112px;height:112px;animation:sv-stamp .6s .45s cubic-bezier(.3,1.6,.5,1) both}
.sv-seal-ring{fill:rgba(22,163,127,.1);stroke:var(--green);stroke-width:5;stroke-dasharray:330;stroke-dashoffset:330;animation:sv-draw .7s .1s ease forwards}
.sv-seal-check{fill:none;stroke:var(--green);stroke-width:9;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:90;stroke-dashoffset:90;animation:sv-draw .45s .55s ease forwards}
@keyframes sv-draw{to{stroke-dashoffset:0}}
@keyframes sv-stamp{from{transform:scale(1.35) rotate(-10deg)}to{transform:none}}
.sv-ticket h2{margin:6px 0 2px;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:clamp(28px,7vw,34px);color:var(--green);animation:sv-rise .5s .8s both}
.sv-ticket-name{margin:0 0 18px;font-size:18px;font-weight:700;animation:sv-rise .5s .9s both}
.sv-facts{margin:0 0 22px;padding:6px 16px;text-align:left;border-radius:16px;background:var(--field);animation:sv-rise .5s 1s both}
.sv-facts div{display:flex;justify-content:space-between;gap:16px;padding:11px 0;border-bottom:1px dashed #cdd8e6}
.sv-facts div:last-child{border-bottom:0}
.sv-facts dt{font-size:13px;color:var(--ink-soft)}
.sv-facts dd{margin:0;font-size:14px;font-weight:700;text-align:right;overflow-wrap:anywhere}
.sv-ticket .sv-submit{width:100%;animation:sv-rise .5s 1.1s both}

/* ---------- responsive ---------- */
@media (min-width:1500px){
  .sv-shell{max-width:1280px}
}

/* tablet: stack, hero on top */
@media (max-width:1000px){
  .sv-shell{grid-template-columns:minmax(0,1fr);gap:28px;max-width:700px}
  .sv-hero{position:static;padding-top:0}
  .sv-hero h1 br{display:none}
  .sv-steps{grid-template-columns:repeat(3,minmax(0,1fr));max-width:none;gap:12px;margin-top:26px}
  .sv-steps li{flex-direction:column;gap:8px}
  .sv-steps span{display:none}
  .sv-card{animation-name:sv-rise}
}

/* phones */
@media (max-width:620px){
  .sv-hero h1{margin:16px 0 10px;font-size:clamp(28px,8.5vw,36px)}
  .sv-steps{display:none}
  .sv-card{border-radius:20px}
  .sv-card-head{flex-direction:column;align-items:flex-start;gap:10px;padding-top:20px}
  .sv-grid{grid-template-columns:minmax(0,1fr)}
  .sv-inline{flex-direction:column}
  .sv-show{width:100%}
  .sv-actions{flex-direction:column-reverse;align-items:stretch;gap:8px}
  .sv-submit,.sv-ghost{width:100%}
  .sv-lookup{padding:14px}
  .sv-ticket{padding:26px 18px 20px;border-radius:22px}
}

/* landscape phones: keep the ticket reachable */
@media (max-height:480px){
  .sv-overlay{place-items:start center}
}

@media (prefers-reduced-motion:reduce){
  .sv-root *,.sv-root *::before,.sv-root *::after{animation-duration:.01ms!important;animation-delay:0ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
  .sv-seal-ring,.sv-seal-check{stroke-dashoffset:0}
}
`;