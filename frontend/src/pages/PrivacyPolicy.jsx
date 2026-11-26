
import "./PrivacyPolicy.css";

const pageStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "clamp(2rem, 5vw, 5rem) 1.5rem",
  color: "#252525",
  lineHeight: 1.8,
};

const sectionStyle = {
  marginTop: "2rem",
};

const headingStyle = {
  color: "#123b70",
  fontSize: "1.35rem",
  marginBottom: "0.75rem",
};

export default function PrivacyPolicy() {
  const lastUpdated = "26 November 2026";

  return (
    <main className="privacy-policy-page" style={pageStyle}>
      <header>
        <h1>Privacy Policy</h1>

        <p>
          <strong>Last Updated:</strong> {lastUpdated}
        </p>

        <p>
          Welcome to VProTech Digital. Your privacy is important to us.
          This Privacy Policy explains how VProTech Digital collects,
          uses, stores, processes and protects personal information
          when you visit our website, enquire about our services,
          register for training programs or communicate with our team.
        </p>

        <p>
          By accessing our website or voluntarily submitting your
          information through our forms, you acknowledge that you
          have read this Privacy Policy.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>1. About VProTech Digital</h2>

        <p>
          VProTech Digital is an IT training and digital solutions
          company based in Mohali, Punjab, India.
        </p>

        <p>Our services include:</p>

        <ul>
          <li>Six-month and six-week industrial training programs.</li>
          <li>Technical and professional skill development.</li>
          <li>Practical assignments and live project training.</li>
          <li>Web design and web development services.</li>
          <li>Android and mobile application development.</li>
          <li>Digital marketing and social media marketing.</li>
          <li>Logo design and branding services.</li>
          <li>Career guidance and placement assistance.</li>
          <li>Business and technology consultancy.</li>
        </ul>

        <p>
          This policy applies to information collected through our
          website, enquiry forms, registration forms and other
          communications with VProTech Digital.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>2. Information We Collect</h2>

        <p>
          We may collect personal and professional information
          that you voluntarily provide when interacting with us.
          Depending on the service you request, this may include:
        </p>

        <h3>Personal Information</h3>
        <ul>
          <li>Full name.</li>
          <li>Email address.</li>
          <li>Mobile or contact number.</li>
          <li>City and location details.</li>
          <li>Educational qualifications and academic details.</li>
        </ul>

        <h3>Student Registration Information</h3>
        <ul>
          <li>Course or training program selected.</li>
          <li>College, university and educational background.</li>
          <li>Training duration and enrolment details.</li>
          <li>Assignment and training-related information.</li>
          <li>Information required for certificates and student records.</li>
        </ul>

        <h3>Career and Employment Information</h3>
        <ul>
          <li>Resume or CV, if submitted.</li>
          <li>Technical skills and work experience.</li>
          <li>Internship and job application details.</li>
          <li>Career preferences and placement-related information.</li>
        </ul>

        <h3>Client and Business Information</h3>
        <ul>
          <li>Business name and contact information.</li>
          <li>Website or application project requirements.</li>
          <li>Information shared through project enquiries.</li>
          <li>Other details necessary to provide requested services.</li>
        </ul>

        <p>
          We only request information relevant to the enquiry,
          registration or service being provided.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>3. How We Use Your Information</h2>

        <p>We may use your information for the following purposes:</p>

        <ul>
          <li>
            To respond to course enquiries and provide training details.
          </li>
          <li>
            To process student registrations and maintain enrolment records.
          </li>
          <li>
            To communicate class schedules, assignments and training updates.
          </li>
          <li>
            To provide information about courses, internships and programs.
          </li>
          <li>
            To maintain student attendance, progress and certification records.
          </li>
          <li>
            To provide career guidance and placement assistance.
          </li>
          <li>
            To evaluate student profiles for relevant employment opportunities,
            where applicable and with appropriate permission.
          </li>
          <li>
            To understand client requirements and deliver development,
            marketing and consultancy services.
          </li>
          <li>
            To improve our website, services and customer experience.
          </li>
          <li>
            To prevent misuse, fraudulent activities and unauthorized access.
          </li>
          <li>
            To comply with applicable legal and regulatory requirements.
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>4. Student Information and Verification</h2>

        <p>
          VProTech Digital maintains student-related records for
          training administration, enrolment management and
          certificate verification.
        </p>

        <p>
          If a student verification facility is made available on
          our website, certain limited information may be displayed
          to confirm whether a person has completed or participated
          in a training program with VProTech Digital.
        </p>

        <p>
          Such verification should be limited to information
          necessary to establish the authenticity of the training
          or certificate. Private contact details, personal documents
          and other confidential student information will not be
          intentionally displayed as part of public verification.
        </p>

        <p>
          Students may contact us regarding incorrect student
          records or verification information.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>5. Sharing of Personal Information</h2>

        <p>
          VProTech Digital does not sell personal information
          to third parties.
        </p>

        <p>
          We may share relevant information only when reasonably
          necessary for the following purposes:
        </p>

        <ul>
          <li>
            With authorized trainers and staff for training
            administration and student support.
          </li>
          <li>
            With service providers who assist in operating our
            website or delivering requested services.
          </li>
          <li>
            With prospective employers or recruitment partners
            for placement assistance, where the student has
            provided appropriate permission.
          </li>
          <li>
            With clients or authorized project personnel when
            necessary to provide contracted services.
          </li>
          <li>
            With government authorities or legal agencies when
            disclosure is required by applicable law.
          </li>
        </ul>

        <p>
          We expect authorized personnel and service providers
          handling personal information on our behalf to protect
          it appropriately.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>6. Cookies and Website Technologies</h2>

        <p>
          Our website may use cookies or similar technologies
          to support website functionality, improve browsing
          experience and understand website usage.
        </p>

        <p>
          Depending on the technologies enabled on the website,
          these may collect technical information such as browser
          type, device information, pages visited and general
          website usage data.
        </p>

        <p>
          You can manage or disable cookies through your browser
          settings. However, disabling certain cookies may affect
          some website features.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>7. Data Storage and Retention</h2>

        <p>
          We retain personal information only for as long as
          reasonably necessary for the purposes for which it
          was collected, including:
        </p>

        <ul>
          <li>Responding to enquiries and providing requested services.</li>
          <li>Maintaining student enrolment and training records.</li>
          <li>Maintaining certificate and verification records.</li>
          <li>Providing ongoing client and placement support.</li>
          <li>Meeting applicable legal and regulatory obligations.</li>
        </ul>

        <p>
          When information is no longer required, we will take
          appropriate steps to delete or anonymize it, subject
          to applicable legal retention requirements.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>8. Data Security</h2>

        <p>
          We take reasonable technical and organizational measures
          to protect personal information against unauthorized
          access, alteration, disclosure, loss or misuse.
        </p>

        <p>
          Access to student, client and business information should
          be restricted to authorized individuals who require it
          for legitimate business purposes.
        </p>

        <p>
          However, no website, electronic transmission or storage
          system can be guaranteed to be completely secure.
          Therefore, we cannot guarantee absolute security
          of information transmitted online.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>9. Your Privacy Rights and Choices</h2>

        <p>
          Subject to applicable law, you may contact us to:
        </p>

        <ul>
          <li>Request information about personal data we hold about you.</li>
          <li>Request correction of inaccurate or incomplete information.</li>
          <li>Request deletion of personal information where applicable.</li>
          <li>Withdraw consent where processing is based on consent.</li>
          <li>
            Raise concerns about the collection or use of your information.
          </li>
        </ul>

        <p>
          We may need to verify your identity before processing
          a privacy-related request. Certain records may need
          to be retained where required by law or for legitimate
          administrative purposes.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>10. Third-Party Websites and Services</h2>

        <p>
          Our website may contain links to third-party websites,
          platforms or services.
        </p>

        <p>
          These external websites operate under their own privacy
          policies and practices. VProTech Digital is not responsible
          for the privacy practices, content or security of external
          websites.
        </p>

        <p>
          We recommend reviewing the privacy policy of any
          third-party website before submitting personal information.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>11. Children's Privacy</h2>

        <p>
          Our training programs may be relevant to students of
          different educational levels. Where personal information
          of individuals under 18 years of age is collected,
          we will handle it in accordance with applicable
          Indian laws and requirements relating to parental
          or guardian consent, where required.
        </p>

        <p>
          Parents or legal guardians may contact us with
          questions or concerns regarding information submitted
          by a minor.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>12. Changes to This Privacy Policy</h2>

        <p>
          VProTech Digital may revise this Privacy Policy from
          time to time to reflect changes in our services,
          website features, business practices or applicable
          legal requirements.
        </p>

        <p>
          Any revised policy will be published on this page
          along with an updated revision date.
        </p>

        <p>
          We encourage visitors and students to review this
          page periodically.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>13. Applicable Law</h2>

        <p>
          This Privacy Policy is intended to be interpreted
          in accordance with the applicable laws of India,
          including relevant data protection and privacy
          legislation, as applicable.
        </p>

        <p>
          This includes the Digital Personal Data Protection
          Act, 2023, and applicable rules and regulations
          brought into force under it.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>14. Contact Us</h2>

        <p>
          If you have questions, concerns or requests relating
          to this Privacy Policy or the handling of your
          personal information, please contact VProTech Digital.
        </p>

        <p>
          <strong>Company:</strong> VProTech Digital
        </p>

        <p>
          <strong>Address:</strong> SCF-116, 2nd Floor,
          Industrial Area, Sector 58, Phase 5, Mohali,
          Punjab, India.
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          <a href="tel:+918894110026">+91-88941-10026</a>
        </p>

        <p>
          <strong>Telephone:</strong>{" "}
          <a href="tel:01723503511">0172-3503511</a>
        </p>

        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:vprotechdigitalmohali@gmail.com">
            vprotechdigitalmohali@gmail.com
          </a>
        </p>

        <p>
          <strong>Website:</strong>{" "}
          <a
            href="https://vprotechdigital.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.vprotechdigital.com
          </a>
        </p>
      </section>

      <section style={sectionStyle}>
        <p>
          <strong>VProTech Digital</strong>
        </p>
        <p>
          You Grow, We Grow. Together We Are VPro.
        </p>
      </section>
    </main>
  );
}
