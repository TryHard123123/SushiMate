const BG    = '#0a0000';
const BG2   = '#130000';
const RED   = '#DC2626';
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

      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '5px', color: RED, textTransform: 'uppercase', marginBottom: '8px' }}>
          SushiMate · Legal
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 700, color: WHITE, marginBottom: '10px' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#5a2a2a', fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px' }}>
          Last updated: May 2026 · Effective immediately
        </p>
        <div style={{ width: '40px', height: '2px', background: RED, marginTop: '16px' }} />
      </div>

      <div style={{ background: BG2, border: `1px solid ${RDIM}`, borderRadius: '3px', padding: '20px 24px', marginBottom: '40px' }}>
        <P>
          SushiMate ("we", "our", "us") is committed to protecting your personal information. This Privacy Policy
          explains what data we collect when you use our website, how we use it, and the rights you have under
          Canadian privacy laws, including the Personal Information Protection and Electronic Documents Act (PIPEDA)
          and applicable provincial legislation.
        </P>
      </div>

      <Section title="1. Information We Collect">
        <P>We collect the following categories of personal information:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li><strong style={{ color: WHITE }}>Identity data:</strong> full name.</Li>
          <Li><strong style={{ color: WHITE }}>Contact data:</strong> email address, phone number, delivery address, postal code.</Li>
          <Li><strong style={{ color: WHITE }}>Order data:</strong> items ordered, order history, special instructions, timestamps.</Li>
          <Li><strong style={{ color: WHITE }}>Payment data:</strong> we do not store full card numbers. Payments are processed by certified third-party payment processors compliant with PCI-DSS standards. We only retain transaction IDs and payment status.</Li>
          <Li><strong style={{ color: WHITE }}>Device & usage data:</strong> IP address, browser type, operating system, pages visited, session duration.</Li>
          <Li><strong style={{ color: WHITE }}>Location data:</strong> approximate location based on IP address to facilitate delivery.</Li>
        </ul>
      </Section>

      <Section title="2. How We Collect Your Data">
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Directly from you when you place an order, create an account, or contact support.</Li>
          <Li>Automatically through cookies and analytics tools when you browse our website.</Li>
          <Li>From payment processors who confirm transaction outcomes.</Li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <P>We process your personal information only for legitimate purposes:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>To process and fulfil your orders, including coordinating delivery.</Li>
          <Li>To send order confirmations, status updates, and delivery notifications via SMS or email.</Li>
          <Li>To manage your account and maintain order history.</Li>
          <Li>To respond to your questions, complaints, or feedback.</Li>
          <Li>To improve our website, menu, and service based on anonymised analytics.</Li>
          <Li>To send promotional offers and loyalty rewards — only with your express consent (CASL compliant).</Li>
          <Li>To comply with Canadian legal and regulatory obligations.</Li>
          <Li>To prevent fraud and unauthorized access to our systems.</Li>
        </ul>
      </Section>

      <Section title="4. Legal Basis for Processing">
        <P>Under Canadian privacy law, we rely on the following legal bases:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li><strong style={{ color: WHITE }}>Consent:</strong> we obtain your express or implied consent before collecting, using, or disclosing your personal information.</Li>
          <Li><strong style={{ color: WHITE }}>Contract performance:</strong> to deliver orders you have placed.</Li>
          <Li><strong style={{ color: WHITE }}>Legal obligation:</strong> to comply with Canadian laws and regulations.</Li>
          <Li><strong style={{ color: WHITE }}>Legitimate interests:</strong> to improve our services, prevent fraud, and maintain security.</Li>
        </ul>
      </Section>

      <Section title="5. Cookies & Tracking Technologies">
        <P>
          We use cookies and similar technologies to personalize your experience, remember cart contents, and
          analyze traffic. You may control cookie preferences through your browser settings.
        </P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li><strong style={{ color: WHITE }}>Essential cookies:</strong> required for the website to function (cart, session).</Li>
          <Li><strong style={{ color: WHITE }}>Analytics cookies:</strong> help us understand how visitors interact with our site (anonymized).</Li>
          <Li><strong style={{ color: WHITE }}>Marketing cookies:</strong> used only with your consent.</Li>
        </ul>
      </Section>

      <Section title="6. Data Sharing & Third Parties">
        <P>We do not sell your personal information. We share data only with:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li><strong style={{ color: WHITE }}>Delivery partners</strong> (name, phone, address) to complete your order.</Li>
          <Li><strong style={{ color: WHITE }}>Payment processors</strong> compliant with PCI-DSS standards.</Li>
          <Li><strong style={{ color: WHITE }}>Cloud infrastructure providers</strong> subject to strict data processing agreements.</Li>
          <Li><strong style={{ color: WHITE }}>Canadian government authorities</strong> if legally required by court order or regulatory demand.</Li>
        </ul>
      </Section>

      <Section title="7. Cross-Border Data Transfers">
        <P>
          Your personal information may be stored and processed in Canada or other jurisdictions. We ensure that
          any cross-border transfer complies with Canadian privacy laws and that appropriate safeguards are in place.
        </P>
      </Section>

      <Section title="8. Data Retention">
        <P>We retain personal information only as long as necessary:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Order and transaction records: 7 years (Canada Revenue Agency requirements).</Li>
          <Li>Account data: for the lifetime of your account, plus 12 months after deletion request.</Li>
          <Li>Marketing preferences: until you withdraw consent.</Li>
          <Li>Support communications: 2 years.</Li>
        </ul>
      </Section>

      <Section title="9. Data Security">
        <P>
          We implement industry-standard security measures including TLS encryption, access controls, regular
          security audits, and employee training. No system is 100% secure; if you suspect unauthorized access,
          contact us immediately.
        </P>
      </Section>

      <Section title="10. Your Rights Under Canadian Law">
        <P>Under PIPEDA and applicable provincial laws, you have the right to:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Access the personal information we hold about you.</Li>
          <Li>Request correction of inaccurate or incomplete information.</Li>
          <Li>Withdraw consent at any time, subject to legal or contractual restrictions.</Li>
          <Li>Challenge our compliance with Canadian privacy laws.</Li>
          <Li>File a complaint with the Office of the Privacy Commissioner of Canada.</Li>
        </ul>
        <P>
          To exercise any of these rights, contact us at <strong style={{ color: WHITE }}>privacy@sushimate.ca</strong>. 
          We will respond within 30 days as required by law.
        </P>
      </Section>

      <Section title="11. CASL Compliance (Anti-Spam)">
        <P>
          SushiMate complies with Canada's Anti-Spam Legislation (CASL). We will only send you commercial
          electronic messages with your express consent. Every marketing email includes an unsubscribe mechanism.
          You may withdraw consent at any time.
        </P>
      </Section>

      <Section title="12. Children's Privacy">
        <P>
          Our services are not directed to individuals under the age of majority in their province of residence.
          We do not knowingly collect personal information from minors without parental consent.
        </P>
      </Section>

      <Section title="13. Changes to This Policy">
        <P>
          We may update this Privacy Policy periodically. Material changes will be posted with a revised date.
          Continued use of our services constitutes acceptance of the updated policy.
        </P>
      </Section>

      <Section title="14. Contact Us">
        <P>For privacy-related queries or to exercise your rights:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Email: <strong style={{ color: WHITE }}>privacy@sushimate.ca</strong></Li>
          <Li>Phone: <strong style={{ color: WHITE }}>+1 604 123 4567</strong></Li>
          <Li>Address: SushiMate Canada Inc., Vancouver, BC, Canada</Li>
          <Li>Hours: Monday – Friday, 09:00 – 17:00 PST</Li>
          <Li>Privacy Commissioner of Canada: <strong style={{ color: WHITE }}>www.priv.gc.ca</strong></Li>
        </ul>
      </Section>

    </div>
  </div>
);

export default Policy;