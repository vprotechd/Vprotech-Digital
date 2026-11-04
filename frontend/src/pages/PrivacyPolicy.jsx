import "./PrivacyPolicy.css";

const pageStyle = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "clamp(2rem, 6vw, 5rem) 1.5rem",
  color: "#252525",
  lineHeight: 1.7,
};

const sectionStyle = { marginTop: "2rem" };

export default function PrivacyPolicy() {
  return (
    <main className="privacy-policy-page">
      <header>
        <h1>Privacy Policy</h1>
        <p>
          This policy explains how VProTech Digital handles information when
          you visit our website or contact us through it.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2>Information you provide</h2>
        <p>
          We may receive information you choose to submit through our website,
          such as your name, email address, phone number, and the details of
          your enquiry. The information requested depends on the form or
          service you use.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>How we use information</h2>
        <p>
          Information you provide may be used to respond to enquiries, provide
          requested services, administer website features, and communicate
          with you about your request.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>Sharing and retention</h2>
        <p>
          We use information only as needed for the purposes described above
          and retain it for as long as needed to address your request, provide
          our services, or meet applicable obligations. We do not sell personal
          information. Information may be disclosed when required by law.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>Your choices and security</h2>
        <p>
          You may contact us to ask about or request a correction to
          information you have submitted. We take reasonable steps to protect
          information, but no method of online transmission or storage can be
          guaranteed to be completely secure.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>Changes and contact</h2>
        <p>
          We may update this policy from time to time by publishing a revised
          version on this page. For privacy-related questions, contact us at{" "}
          <a href="mailto:vprotechdigitalmohali@gmail.com">
            vprotechdigitalmohali@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}