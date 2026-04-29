const BG    = '#0a0000';
const BG2   = '#130000';
const RED   = '#D42B2B';
const RDIM  = '#3d0808';
const WHITE = '#F5ECEC';
const MUTED = '#9a7a7a';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '40px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
      <div style={{ width: '3px', height: '22px', background: RED, flexShrink: 0 }} />
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 700, color: WHITE }}>
        {title}
      </h2>
    </div>
    <div style={{ paddingLeft: '15px', borderLeft: `1px solid ${RDIM}` }}>
      {children}
    </div>
  </div>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: '0.88rem', color: MUTED, lineHeight: 1.75, marginBottom: '12px' }}>{children}</p>
);

const Li = ({ children }: { children: React.ReactNode }) => (
  <li style={{ fontSize: '0.88rem', color: MUTED, lineHeight: 1.75, marginBottom: '6px', display: 'flex', gap: '8px' }}>
    <span style={{ color: RED, flexShrink: 0, marginTop: '2px' }}>—</span>
    <span>{children}</span>
  </li>
);

const Policy = () => (
  <div style={{ background: BG, minHeight: '100vh', padding: '56px 24px 80px' }} className="fade-in">
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '5px', color: RED, textTransform: 'uppercase', marginBottom: '8px' }}>
          SushiMate · Legal
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 700, color: WHITE, marginBottom: '10px' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#5a2a2a', fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px' }}>
          Last updated: 25 April 2026 · Effective immediately
        </p>
        <div style={{ width: '40px', height: '2px', background: RED, marginTop: '16px' }} />
      </div>

      {/* Intro */}
      <div style={{ background: BG2, border: `1px solid ${RDIM}`, borderRadius: '3px', padding: '20px 24px', marginBottom: '40px' }}>
        <P>
          SushiMate ("we", "our", "us") is committed to protecting your personal information. This Privacy Policy
          explains what data we collect when you use our website or mobile application, how we use it, and the
          rights you have over your information. This policy applies to all users located in the United Arab Emirates
          and is compliant with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection.
        </P>
      </div>

      <Section title="1. Information We Collect">
        <P>We collect the following categories of personal data:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li><strong style={{ color: WHITE }}>Identity data:</strong> full name, date of birth (where required for age-restricted products).</Li>
          <Li><strong style={{ color: WHITE }}>Contact data:</strong> email address, mobile phone number, delivery address.</Li>
          <Li><strong style={{ color: WHITE }}>Order data:</strong> items ordered, order history, special instructions, timestamps.</Li>
          <Li><strong style={{ color: WHITE }}>Payment data:</strong> we do not store card numbers. Payments are processed by certified third-party payment gateways (Stripe / Network International). We only retain transaction IDs and payment status.</Li>
          <Li><strong style={{ color: WHITE }}>Device & usage data:</strong> IP address, browser type, operating system, pages visited, session duration, referring URLs.</Li>
          <Li><strong style={{ color: WHITE }}>Location data:</strong> approximate or precise GPS location (only when you grant permission) to facilitate delivery.</Li>
          <Li><strong style={{ color: WHITE }}>Communication data:</strong> messages you send us via chat, email or support tickets.</Li>
        </ul>
      </Section>

      <Section title="2. How We Collect Your Data">
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Directly from you when you register, place an order, or contact support.</Li>
          <Li>Automatically through cookies and analytics tools when you browse our website or app.</Li>
          <Li>From payment processors who confirm transaction outcomes.</Li>
          <Li>From delivery partners who update order status in real time.</Li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <P>We process your personal data only for legitimate, specified purposes:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>To process and fulfil your orders, including coordinating with delivery riders.</Li>
          <Li>To send order confirmations, status updates, and delivery notifications via SMS or email.</Li>
          <Li>To manage your account and maintain order history.</Li>
          <Li>To respond to your questions, complaints, or feedback.</Li>
          <Li>To improve our website, menu, and service based on anonymised analytics.</Li>
          <Li>To send promotional offers and loyalty rewards — only with your explicit consent, and you may opt out at any time.</Li>
          <Li>To comply with UAE legal and regulatory obligations, including tax records.</Li>
          <Li>To prevent fraud, abuse, or unauthorised access to our systems.</Li>
        </ul>
      </Section>

      <Section title="4. Legal Basis for Processing">
        <P>We rely on the following legal bases to process your personal data:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li><strong style={{ color: WHITE }}>Contract performance:</strong> to deliver orders you have placed.</Li>
          <Li><strong style={{ color: WHITE }}>Legal obligation:</strong> to comply with UAE laws and regulations.</Li>
          <Li><strong style={{ color: WHITE }}>Legitimate interests:</strong> to improve our services, prevent fraud, and maintain security.</Li>
          <Li><strong style={{ color: WHITE }}>Consent:</strong> for marketing communications. You may withdraw consent at any time.</Li>
        </ul>
      </Section>

      <Section title="5. Cookies & Tracking Technologies">
        <P>
          We use cookies and similar technologies to personalise your experience, remember cart contents, and
          analyse traffic. You may control cookie preferences through your browser settings. Disabling cookies may
          affect the functionality of our website.
        </P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li><strong style={{ color: WHITE }}>Essential cookies:</strong> required for the website to function (e.g., cart, session).</Li>
          <Li><strong style={{ color: WHITE }}>Analytics cookies:</strong> help us understand how visitors interact with our site (Google Analytics, anonymised).</Li>
          <Li><strong style={{ color: WHITE }}>Marketing cookies:</strong> used only with your consent to show relevant advertisements.</Li>
        </ul>
      </Section>

      <Section title="6. Data Sharing & Third Parties">
        <P>We do not sell your personal data. We share data only with:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li><strong style={{ color: WHITE }}>Delivery partners</strong> (name, phone, address) to complete your order.</Li>
          <Li><strong style={{ color: WHITE }}>Payment processors</strong> (transaction data) to process payments securely.</Li>
          <Li><strong style={{ color: WHITE }}>Cloud infrastructure providers</strong> (e.g., AWS, Google Cloud) for hosting — subject to strict data processing agreements.</Li>
          <Li><strong style={{ color: WHITE }}>Analytics providers</strong> (anonymised usage data) to improve our services.</Li>
          <Li><strong style={{ color: WHITE }}>UAE government authorities</strong> if legally required by court order or regulatory demand.</Li>
        </ul>
      </Section>

      <Section title="7. Data Retention">
        <P>
          We retain personal data only as long as necessary for the purposes described in this policy or as
          required by UAE law. Typically:
        </P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Order and transaction records: 5 years (UAE tax and commercial law).</Li>
          <Li>Account data: for the lifetime of your account, plus 12 months after deletion request.</Li>
          <Li>Marketing preferences: until you withdraw consent.</Li>
          <Li>Support communications: 2 years.</Li>
        </ul>
      </Section>

      <Section title="8. Data Security">
        <P>
          We implement industry-standard technical and organisational security measures, including TLS encryption
          in transit, AES-256 encryption at rest, access controls, regular security audits, and employee training.
          No system is 100% secure; if you suspect unauthorised access to your account, contact us immediately.
        </P>
      </Section>

      <Section title="9. Your Rights">
        <P>Under UAE data protection law, you have the right to:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Access a copy of the personal data we hold about you.</Li>
          <Li>Request correction of inaccurate or incomplete data.</Li>
          <Li>Request deletion of your data (subject to legal retention obligations).</Li>
          <Li>Withdraw consent for marketing at any time.</Li>
          <Li>Object to processing based on legitimate interests.</Li>
          <Li>Lodge a complaint with the UAE Data Office.</Li>
        </ul>
        <P>To exercise any of these rights, contact us at <strong style={{ color: WHITE }}>privacy@sushimate.ae</strong>. We will respond within 30 days.</P>
      </Section>

      <Section title="10. Children's Privacy">
        <P>
          Our services are not directed to children under 13 years of age. We do not knowingly collect personal
          data from children. If you believe a child has provided us with personal data, please contact us
          immediately.
        </P>
      </Section>

      <Section title="11. Changes to This Policy">
        <P>
          We may update this Privacy Policy periodically. We will notify you of material changes by posting the
          updated policy on our website with a revised date. Continued use of our services after changes are posted
          constitutes acceptance of the updated policy.
        </P>
      </Section>

      <Section title="12. Contact Us">
        <P>For privacy-related queries or to exercise your rights:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Email: <strong style={{ color: WHITE }}>privacy@sushimate.ae</strong></Li>
          <Li>Phone: <strong style={{ color: WHITE }}>+971 4 123 4567</strong></Li>
          <Li>Address: SushiMate LLC, Dubai, United Arab Emirates</Li>
          <Li>Hours: Sunday – Thursday, 09:00 – 18:00 GST</Li>
        </ul>
      </Section>

    </div>
  </div>
);

export default Policy;
