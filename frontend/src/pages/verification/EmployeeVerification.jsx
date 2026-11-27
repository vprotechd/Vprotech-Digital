import { useRef, useState } from "react";
import { API_URL, employeeService } from "../../services/api";

// Put your picture at src/assets/designn.jpg (adjust the path if your folder is different)
import designBg from "../../assets/designn.jpg";

/**
 * EmployeeVerification
 * Usage: <EmployeeVerification />
 *
 * Flow: enter an employee ID and look it up. When an active record is found, a
 * verified badge (with the employee's photo) and the work record are shown.
 * There is no confirm button.
 *
 * Props
 *  - navOffset        space kept free for your fixed navbar (number = px, or any CSS value). Default 80px.
 *  - backgroundImage  override the background picture (defaults to ../../assets/designn.jpg)
 *
 * Employee photos and public work details are loaded from the employee record.
 * Styles are scoped under .sv-root.
 */

const EMPTY = {
  employeeId: "",
  photo: "",
  firstName: "",
  lastName: "",
  designation: "",
  department: "",
  joiningDate: "",
  employmentType: "",
  status: "",
};

const getEmployeePhotoUrl = (photo) => {
  if (!photo) return "";
  if (/^https?:\/\//i.test(photo)) return photo;

  const serverUrl = API_URL.replace(/\/api\/?$/, "");
  return `${serverUrl}${photo.startsWith("/") ? "" : "/"}${photo}`;
};

const fetchEmployee = async (employeeId) => {
  const response = await employeeService.verifyEmployee({ employeeId });
  if (!response.verified || !response.employee) return null;

  const employee = response.employee;
  return {
    employeeId: employee.employeeId || employeeId,
    photo: getEmployeePhotoUrl(employee.photo),
    firstName: employee.firstName || "",
    lastName: employee.lastName || "",
    designation: employee.designation || "",
    department: employee.department || "",
    joiningDate: employee.joiningDate || "",
    employmentType: employee.employmentType || "",
    status: employee.status || "",
  };
};

const formatDate = (iso) => {
  if (!iso) return "—";
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
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  hash: <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
};

const Icon = ({ name, className = "sv-ico" }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

/* Verified badge: a shield that pops in, then the tick draws itself */
const VerifiedBadge = ({ className = "sv-badge" }) => (
  <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
    <path
      className="sv-badge-shield"
      d="M32 4 10 12v18c0 14 9.4 24.6 22 30 12.6-5.4 22-16 22-30V12L32 4Z"
    />
    <path className="sv-badge-check" d="M21 33l8 8 15-17" />
  </svg>
);

/* Defined outside the page component so the lookup input keeps focus while typing */
const Section = ({ icon, title }) => (
  <div className="sv-sec">
    <span className="sv-sec-ico">
      <Icon name={icon} />
    </span>
    <h3>{title}</h3>
  </div>
);

const Item = ({ label, value, index, pill }) => (
  <div className="sv-item" style={{ "--i": index }}>
    <dt>{label}</dt>
    <dd>
      {pill && value ? (
        <span className={`sv-status ${/active|permanent|full/i.test(value) ? "is-good" : ""}`}>
          {value}
        </span>
      ) : (
        value || "—"
      )}
    </dd>
  </div>
);

export default function EmployeeVerification({
  navOffset = "var(--navbar-height, 80px)",
  backgroundImage = designBg,
}) {
  const navValue = typeof navOffset === "number" ? `${navOffset}px` : navOffset;

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false); // details stay hidden until a lookup succeeds
  const [photoBroken, setPhotoBroken] = useState(false); // image URL failed to load
  const refInput = useRef(null);

  const set = (key) => (e) => {
    const val = e.target.value;
    if (key === "employeeId") {
      setValues({ ...EMPTY, employeeId: val });
      setFound(false);
      setPhotoBroken(false);
    } else {
      setValues((v) => ({ ...v, [key]: val }));
    }

    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const handleShow = async () => {
    if (loading) return;
    if (!values.employeeId.trim()) {
      setErrors((er) => ({ ...er, employeeId: "Enter the employee ID" }));
      refInput.current?.focus();
      return;
    }
    setLoading(true);
    try {
      const data = await fetchEmployee(values.employeeId.trim());
      if (!data) {
        setFound(false);
        setErrors({ employeeId: "Active employee record not found for this ID" });
        return;
      }
      setValues((v) => ({ ...v, ...data }));
      setPhotoBroken(false);
      setErrors({});
      setFound(true);
    } catch (error) {
      setErrors({
        employeeId:
          error.response?.data?.message ||
          "Could not look this up. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Pressing Enter in the ID box looks the record up
  const handleSubmit = (e) => {
    e.preventDefault();
    handleShow();
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setFound(false);
    setPhotoBroken(false);
    setTimeout(() => refInput.current?.focus(), 0);
  };

  const hasPhoto = Boolean(values.photo) && !photoBroken;
  const fullName = `${values.firstName} ${values.lastName}`.trim();
  const initials = `${values.firstName.trim()[0] || ""}${values.lastName.trim()[0] || ""}`.toUpperCase();

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
            Check an employee’s
            <br />
            work record
          </h1>
          <p className="sv-lead">
            Confirm that someone works with us. Enter their employee ID and we’ll
            bring up the details.
          </p>

          <ol className="sv-steps">
            <li>
              <b>1</b>
              <div>
                <strong>Enter the employee ID</strong>
                <span>Find it on the employee’s ID card or offer letter.</span>
              </div>
            </li>
            <li>
              <b>2</b>
              <div>
                <strong>Look up the record</strong>
                <span>We search the active employee records.</span>
              </div>
            </li>
            <li>
              <b>3</b>
              <div>
                <strong>See the verified result</strong>
                <span>A verified badge appears with the photo and work details.</span>
              </div>
            </li>
          </ol>
        </aside>

        {/* ---------------- right: card ---------------- */}
        <main className={`sv-card ${loading ? "is-loading" : ""}`}>
          <header className="sv-card-head">
            <div>
              <h2>{found ? "Verification result" : "Find an employee"}</h2>
              <p>
                {found
                  ? "This record matches our active employee database."
                  : "Enter an employee ID to see the active employee record."}
              </p>
            </div>
          </header>

          <form className="sv-form" onSubmit={handleSubmit} noValidate>
            {/* lookup (always visible) */}
            <div className="sv-lookup">
              <div className="sv-inline">
                <div className="sv-lookup-credential">
                  <label className="sv-label" htmlFor="employeeId">
                    Employee ID
                  </label>
                  <div className="sv-ctl has-icon">
                    <Icon name="hash" />
                    <input
                      ref={refInput}
                      id="employeeId"
                      className={`sv-input ${errors.employeeId ? "has-error" : ""}`}
                      value={values.employeeId}
                      onChange={set("employeeId")}
                      placeholder="e.g. EMP-2023-0042"
                      autoComplete="off"
                      autoFocus
                      disabled={loading}
                    />
                  </div>
                  <span className={`sv-error ${errors.employeeId ? "is-on" : ""}`} role="alert">
                    {errors.employeeId || "\u00A0"}
                  </span>
                </div>
                <button
                  type="submit"
                  className={`sv-show ${loading ? "is-loading" : ""}`}
                  disabled={loading}
                >
                  <span className="sv-show-text">
                    <Icon name="search" /> Look up
                  </span>
                  <span className="sv-spinner" aria-hidden="true" />
                </button>
              </div>
            </div>
          </form>

          {/* Record details are only shown after the public lookup succeeds. */}
          {found && (
            <div className="sv-details" aria-live="polite">
              {/* verified banner with the employee's photo */}
              <div className="sv-verified">
                <div className="sv-avatar">
                  {hasPhoto ? (
                    <img
                      key={values.photo}
                      className="sv-avatar-img"
                      src={values.photo}
                      alt={fullName || "Employee photo"}
                      onError={() => setPhotoBroken(true)}
                    />
                  ) : (
                    <span className="sv-avatar-empty" aria-label="No photo on file">
                      {initials || <Icon name="user" className="sv-ico sv-ico-lg" />}
                    </span>
                  )}
                  <VerifiedBadge className="sv-badge sv-badge-corner" />
                </div>

                <div className="sv-verified-text">
                  <span className="sv-verified-kicker">Verified employee</span>
                  <strong>{fullName}</strong>
                  <span className="sv-verified-ref">
                    {values.designation ? `${values.designation} · ` : ""}
                    {values.employeeId}
                  </span>
                </div>
              </div>

              <Section icon="user" title="Employee" />
              <dl className="sv-record">
                <Item label="First name" value={values.firstName} index={0} />
                <Item label="Last name" value={values.lastName} index={1} />
                <Item label="Employee ID" value={values.employeeId} index={2} />
              </dl>

              <Section icon="briefcase" title="Work" />
              <dl className="sv-record">
                <Item label="Designation" value={values.designation} index={3} />
                <Item label="Department" value={values.department} index={4} />
                <Item label="Joining date" value={formatDate(values.joiningDate)} index={5} />
                <Item label="Employment type" value={values.employmentType} index={6} />
                <Item label="Status" value={values.status} index={7} pill />
              </dl>

              <div className="sv-actions">
                <button type="button" className="sv-ghost" onClick={reset}>
                  Check another employee
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&display=swap');

.sv-root{
  --ink:#0d1b2e; --ink-soft:#586a80; --field:#f1f5fa; --line:#e3e9f2;
  --blue:#1769e0; --blue-dark:#0f4fc4; --sky:#3fa4f9; --amber:#f2b04a; --rose:#d1435b; --green:#12906f; --green-soft:#e9f8f2;
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
  transform-origin:60% 40%; animation:sv-kenburns 40s ease-in-out infinite alternate;
}
@keyframes sv-kenburns{to{transform:scale(1.06)}}
.sv-wash{
  position:fixed; inset:0; z-index:-1; pointer-events:none;
  background:
    radial-gradient(900px 500px at 85% 10%, rgba(63,164,249,.22), transparent 60%),
    linear-gradient(105deg, rgba(6,18,40,.95) 0%, rgba(10,40,95,.84) 48%, rgba(8,28,60,.66) 100%);
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
  font-size:clamp(32px,4.6vw,54px); line-height:1.08; letter-spacing:-.02em;
}
.sv-lead{margin:0;max-width:44ch;font-size:clamp(15px,1.5vw,17px);line-height:1.7;color:#cfdcf0}

.sv-steps{list-style:none;margin:34px 0 0;padding:0;display:grid;gap:16px;max-width:420px}
.sv-steps li{display:flex;gap:14px;align-items:flex-start}
.sv-steps b{flex:none;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;
  font-size:13.5px;color:#fff;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.28)}
.sv-steps strong{display:block;font-size:15.5px;margin-bottom:2px}
.sv-steps span{font-size:13.5px;color:#aebfd8;line-height:1.5}

/* ---------- card (right) ---------- */
.sv-card{
  position:relative; overflow:hidden; background:#fff;
  border-radius:22px; border:1px solid rgba(255,255,255,.6);
  box-shadow:0 40px 90px -30px rgba(2,10,28,.75);
  animation:sv-slide .9s .12s cubic-bezier(.2,.8,.2,1) both;
}
@keyframes sv-slide{from{opacity:0;transform:translateX(34px)}}

.sv-card-head{padding:26px clamp(18px,4vw,34px) 4px}
.sv-card-head h2{margin:0;font-family:'Bricolage Grotesque',sans-serif;font-size:clamp(21px,3vw,26px);font-weight:800;letter-spacing:-.01em}
.sv-card-head p{margin:4px 0 0;font-size:14px;color:var(--ink-soft)}

.sv-form{padding:10px clamp(18px,4vw,34px) 24px}

/* lookup box */
.sv-lookup{margin-top:12px;padding:16px;border-radius:16px;background:#f5f9ff;border:1px solid #d6e5fb}
.sv-inline{display:flex;gap:10px}
.sv-inline .sv-ctl{flex:1;min-width:0}
.sv-lookup-credential{flex:1;min-width:0}
.sv-lookup-credential .sv-label{margin-top:0}
.sv-inline .sv-show{align-self:flex-start;margin-top:26px}

.sv-label{display:block;margin:0 0 6px;font-size:13px;font-weight:600;color:var(--blue-dark)}
.sv-ctl{position:relative}
.sv-ico{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.sv-ico-lg{width:34px;height:34px}
.sv-ctl > .sv-ico{position:absolute;left:14px;top:14px;color:#8aa0bb;pointer-events:none;transition:color .2s}
.sv-ctl:focus-within > .sv-ico{color:var(--blue)}

.sv-input{
  width:100%; min-height:46px; padding:11px 14px; font:inherit; font-size:16px; color:var(--ink);
  -webkit-appearance:none; appearance:none;
  background:#fff; border:2px solid #dbe5f2; border-radius:12px; outline:none;
  transition:border-color .2s, box-shadow .2s;
}
.sv-ctl.has-icon .sv-input{padding-left:42px}
.sv-input::placeholder{color:#94a3b8}
.sv-input:hover{border-color:#c3d4ea}
.sv-input:focus{border-color:var(--blue);box-shadow:0 0 0 4px rgba(23,105,224,.14)}
.sv-input.has-error{border-color:var(--rose);background:#fff8f9;animation:sv-shake .35s}
.sv-input:disabled{background:#f1f5fa;color:#7b8a9f}
@keyframes sv-shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}

.sv-error{display:block;min-height:18px;padding:3px 2px 0;font-size:12.5px;color:var(--rose);opacity:0;transform:translateY(-4px);transition:.2s}
.sv-error.is-on{opacity:1;transform:none}

/* shimmer on the lookup box while the lookup runs */
.sv-card.is-loading .sv-lookup .sv-input{
  background-image:linear-gradient(90deg,transparent 0%,rgba(23,105,224,.10) 50%,transparent 100%);
  background-size:220% 100%; animation:sv-shimmer 1.1s linear infinite;
}
@keyframes sv-shimmer{from{background-position:120% 0}to{background-position:-120% 0}}

/* look-up button */
.sv-show{
  position:relative;flex:none;min-width:124px;min-height:46px;padding:0 20px;border:0;border-radius:12px;cursor:pointer;
  font:inherit;font-weight:700;font-size:14.5px;color:#fff;
  background:linear-gradient(135deg,var(--blue-dark),var(--blue) 60%,var(--sky));
  box-shadow:0 10px 22px -10px rgba(23,105,224,.8);
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

/* ---------- result ---------- */
.sv-details{padding:4px clamp(18px,4vw,34px) clamp(22px,4vw,30px);animation:sv-reveal .6s cubic-bezier(.2,.8,.2,1) both}
@keyframes sv-reveal{from{opacity:0;transform:translateY(16px)}}

/* verified banner with photo */
.sv-verified{
  display:flex;align-items:center;gap:18px;padding:16px 18px;border-radius:16px;
  background:var(--green-soft);border:1px solid #bfe7d8;
}
.sv-avatar{position:relative;flex:none;width:84px;height:84px}
.sv-avatar-img,.sv-avatar-empty{
  width:100%;height:100%;border-radius:50%;display:grid;place-items:center;
  border:3px solid #fff;box-shadow:0 8px 20px -8px rgba(13,27,46,.5), 0 0 0 2px #bfe7d8;
}
.sv-avatar-img{display:block;object-fit:cover;background:#dfeaf8;animation:sv-photo-in .7s cubic-bezier(.2,.9,.3,1) both}
.sv-avatar-empty{background:#e3edf9;color:var(--blue);font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:28px;letter-spacing:.02em}
@keyframes sv-photo-in{from{opacity:0;transform:scale(1.1);filter:blur(6px)}}

.sv-badge{overflow:visible}
.sv-badge-corner{position:absolute;right:-8px;bottom:-6px;width:34px;height:34px;filter:drop-shadow(0 3px 6px rgba(13,27,46,.35))}
.sv-badge-shield{fill:var(--green);stroke:#fff;stroke-width:4;stroke-linejoin:round;transform-origin:50% 50%;animation:sv-pop .55s .25s cubic-bezier(.3,1.5,.5,1) both}
.sv-badge-check{fill:none;stroke:#fff;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:40;stroke-dashoffset:40;animation:sv-draw .45s .65s ease forwards}
@keyframes sv-pop{from{opacity:0;transform:scale(.4)}}
@keyframes sv-draw{to{stroke-dashoffset:0}}

.sv-verified-text{display:flex;flex-direction:column;gap:1px;min-width:0}
.sv-verified-kicker{font-size:12.5px;font-weight:700;color:var(--green);letter-spacing:.01em}
.sv-verified-text strong{font-size:clamp(18px,2.4vw,21px);font-weight:700;line-height:1.25;overflow-wrap:anywhere}
.sv-verified-ref{font-size:13px;color:var(--ink-soft);overflow-wrap:anywhere}

/* section headers */
.sv-sec{display:flex;align-items:center;gap:10px;margin:24px 0 8px}
.sv-sec::after{content:"";flex:1;height:1px;background:var(--line)}
.sv-sec h3{margin:0;font-size:14px;font-weight:700;color:var(--ink)}
.sv-sec-ico{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:#e8f1ff;color:var(--blue)}
.sv-sec-ico .sv-ico{width:15px;height:15px}

/* read-only record: label above value, in a tidy grid */
.sv-record{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 20px;margin:0}
.sv-item{
  padding:11px 0;border-bottom:1px solid var(--line);min-width:0;
  animation:sv-rise .5s calc(.25s + var(--i) * 45ms) cubic-bezier(.2,.8,.2,1) both;
}
.sv-item dt{margin:0 0 3px;font-size:12.5px;font-weight:600;color:var(--ink-soft)}
.sv-item dd{margin:0;font-size:15.5px;font-weight:600;color:var(--ink);overflow-wrap:anywhere}

.sv-status{display:inline-block;padding:3px 11px;border-radius:999px;background:#e8f1ff;color:var(--blue-dark);font-size:13.5px;font-weight:700}
.sv-status.is-good{background:var(--green-soft);color:var(--green)}

/* actions */
.sv-actions{display:flex;justify-content:flex-end;margin-top:22px}
.sv-ghost{min-height:46px;padding:11px 18px;border:1px solid #d6e0ee;background:#fff;cursor:pointer;font:inherit;font-weight:600;color:var(--ink-soft);border-radius:12px;transition:background .2s,border-color .2s,color .2s}

@media (hover:hover){
  .sv-show:hover{transform:translateY(-2px);box-shadow:0 14px 26px -10px rgba(23,105,224,.85)}
  .sv-ghost:hover{background:var(--field);color:var(--ink);border-color:#c3d4ea}
}
.sv-show:focus-visible,.sv-ghost:focus-visible{outline:3px solid var(--amber);outline-offset:2px}

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
  .sv-card{border-radius:18px}
  .sv-card-head{padding-top:22px}
  .sv-record{grid-template-columns:minmax(0,1fr)}
  .sv-inline{flex-direction:column}
  .sv-inline .sv-show{width:100%;margin-top:0}
  .sv-actions{justify-content:stretch}
  .sv-ghost{width:100%}
  .sv-lookup{padding:14px}
  .sv-verified{padding:14px;gap:14px}
  .sv-avatar{width:72px;height:72px}
  .sv-badge-corner{width:30px;height:30px}
}

@media (prefers-reduced-motion:reduce){
  .sv-root *,.sv-root *::before,.sv-root *::after{animation-duration:.01ms!important;animation-delay:0ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
  .sv-badge-check{stroke-dashoffset:0}
}
`;