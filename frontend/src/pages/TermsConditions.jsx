import "./TermsConditions.css";

const pageStyle = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "clamp(2rem, 6vw, 5rem) 1.5rem",
  color: "#252525",
  lineHeight: 1.7,
};

const sectionStyle = { marginTop: "2rem" };

export default function TermsConditions() {
  return (
    <main className="terms-conditions-page">
      <header>
        <h1>Terms &amp; Conditions</h1>
        <p>
          These terms apply to your use of the VProTech Digital website. By
          using the website, you agree to use it lawfully and responsibly.
        </p>
      </header>
      

      <section style={sectionStyle}>
        <h2>Website information and services</h2>
        <p>
          Website content is provided for general information about our
          services, programs, and work. Details may change, and information on
          this website does not create a service agreement. Any specific
          engagement is subject to separately agreed terms.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>Acceptable use</h2>
        <p>
          You must not misuse the website, interfere with its operation, attempt
          unauthorized access, or submit content that is unlawful or infringes
          another person&apos;s rights.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>Intellectual property</h2>
        <p>
          Unless otherwise stated, website content and branding belong to
          VProTech Digital or are used with permission. You may not reproduce
          or redistribute website material for commercial purposes without
          prior permission.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>Third-party websites and availability</h2>
        <p>
          The website may link to third-party websites, which are governed by
          their own terms and policies. We do not guarantee uninterrupted or
          error-free availability of this website.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>Changes and contact</h2>
        <p>
          We may update these terms by publishing a revised version on this
          page. Questions can be sent to{" "}
          <a href="mailto:vprotechdigitalmohali@gmail.com">
            vprotechdigitalmohali@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}