const BG    = '#0a0000';
const BG2   = '#130000';
const RED   = '#DC2626';
const RDIM  = '#3d0808';
const WHITE = '#F5ECEC';
const MUTED = '#9a7a7a';

const Section = ({ num, title, children }: { num: string; title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '40px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
      <div style={{ width: '3px', height: '22px', background: RED, flexShrink: 0 }} />
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 700, color: WHITE }}>
        {num}. {title}
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

const Terms = () => (
  <div style={{ background: BG, minHeight: '100vh', padding: '56px 24px 80px' }} className="fade-in">
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>

      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '5px', color: RED, textTransform: 'uppercase', marginBottom: '8px' }}>
          SushiMate · Legal
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 700, color: WHITE, marginBottom: '10px' }}>
          Terms & Conditions
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#5a2a2a', fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px' }}>
          Last updated: May 2026 · Effective immediately
        </p>
        <div style={{ width: '40px', height: '2px', background: RED, marginTop: '16px' }} />
      </div>

      <div style={{ background: BG2, border: `1px solid ${RDIM}`, borderRadius: '3px', padding: '20px 24px', marginBottom: '40px' }}>
        <P>
          These Terms and Conditions ("Terms") govern your use of the SushiMate website and food delivery services
          operated by <strong style={{ color: WHITE }}>SushiMate Canada Inc.</strong>, a company incorporated under the laws
          of Canada. By placing an order or creating an account, you agree to be bound by these Terms.
        </P>
      </div>

      <Section num="1" title="Definitions">
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li><strong style={{ color: WHITE }}>"SushiMate"</strong> refers to SushiMate Canada Inc., its affiliates, employees, and agents.</Li>
          <Li><strong style={{ color: WHITE }}>"Services"</strong> refers to the website, mobile application, food ordering, and delivery services.</Li>
          <Li><strong style={{ color: WHITE }}>"User", "you", "your"</strong> refers to any person using our Services.</Li>
          <Li><strong style={{ color: WHITE }}>"Order"</strong> refers to a request for food and/or beverages placed through our platform.</Li>
        </ul>
      </Section>

      <Section num="2" title="Eligibility">
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>You must be at least the age of majority in your province of residence (18 or 19 depending on province).</Li>
          <Li>You must provide accurate, complete, and current personal information.</Li>
          <Li>Our Services are currently available in select Canadian cities.</Li>
          <Li>SushiMate reserves the right to refuse service to anyone for any lawful reason.</Li>
        </ul>
      </Section>

      <Section num="3" title="Orders & Acceptance">
        <P>
          Placing an order constitutes an offer to purchase. An order is confirmed only when you receive a
          confirmation email or SMS. We reserve the right to reject or cancel any order for reasons including:
        </P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Product unavailability or stock shortages.</Li>
          <Li>Errors in pricing or product description.</Li>
          <Li>Failure to verify payment or delivery address.</Li>
          <Li>Suspected fraudulent activity.</Li>
        </ul>
      </Section>

      <Section num="4" title="Pricing & Payment">
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>All prices are listed in Canadian Dollars (CAD) and may be subject to applicable federal and provincial taxes (GST/HST/PST).</Li>
          <Li>Delivery fees are displayed at checkout before payment confirmation.</Li>
          <Li>We accept major credit/debit cards (Visa, Mastercard, American Express), Apple Pay, and Google Pay.</Li>
          <Li>Card payments are processed by PCI-DSS compliant payment gateways.</Li>
          <Li>Prices are subject to change without notice, but changes will not affect already-confirmed orders.</Li>
        </ul>
      </Section>

      <Section num="5" title="Delivery">
        <P>We deliver to select areas in Vancouver, Toronto, Montreal, Calgary, Ottawa, and other Canadian cities.</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Target delivery time: 30–45 minutes. Actual times may vary due to traffic, weather, or demand.</Li>
          <Li>Free delivery on orders above 75 CAD. Below this threshold, a delivery fee applies.</Li>
          <Li>You are responsible for providing an accurate delivery address. SushiMate is not liable for failed deliveries due to incorrect address information.</Li>
          <Li>If no one is available to receive the order, our driver will wait 5 minutes before returning the order. No refund will be issued for unclaimed orders.</Li>
          <Li>During extreme weather conditions, delivery times may be extended. You will be notified.</Li>
        </ul>
      </Section>

      <Section num="6" title="Cancellations & Refunds">
        <P>Orders may be cancelled within 2 minutes of placement. After this window:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li><strong style={{ color: WHITE }}>Order being prepared:</strong> cancellation is not possible. No refund.</Li>
          <Li><strong style={{ color: WHITE }}>Incorrect or missing items:</strong> contact us within 30 minutes of delivery for replacement or credit.</Li>
          <Li><strong style={{ color: WHITE }}>Quality issues:</strong> contact us with photographic evidence within 1 hour of delivery.</Li>
          <Li><strong style={{ color: WHITE }}>Refund processing:</strong> 5–10 business days to original payment method.</Li>
        </ul>
      </Section>

      <Section num="7" title="Allergen & Dietary Information">
        <P>
          Our kitchen handles common allergens including fish, shellfish, sesame, soy, gluten, dairy, and eggs.
          We cannot guarantee the complete absence of any allergen. If you have a severe food allergy, please
          contact us before ordering. SushiMate is not liable for allergic reactions.
        </P>
      </Section>

      <Section num="8" title="Intellectual Property">
        <P>
          All content on our platform — including text, images, logos, design, and software — is the exclusive
          property of SushiMate Canada Inc. or its licensors. You may not copy, reproduce, or create derivative
          works without express written permission.
        </P>
      </Section>

      <Section num="9" title="User Conduct">
        <P>You agree not to:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Use our platform for any unlawful purpose.</Li>
          <Li>Attempt to gain unauthorized access to our systems.</Li>
          <Li>Submit false or fraudulent orders.</Li>
          <Li>Harass or abuse SushiMate staff or delivery drivers.</Li>
        </ul>
      </Section>

      <Section num="10" title="Limitation of Liability">
        <P>
          To the maximum extent permitted by Canadian law, SushiMate's total liability is limited to the amount
          paid for the specific order. We are not liable for indirect, incidental, or consequential damages.
          SushiMate is not responsible for delays caused by circumstances beyond our reasonable control
          (force majeure).
        </P>
      </Section>

      <Section num="11" title="Governing Law & Disputes">
        <P>
          These Terms are governed by the laws of Canada and the Province of British Columbia. Any dispute shall
          first be subject to good-faith negotiation. If unresolved within 30 days, disputes shall be submitted
          to the courts of British Columbia.
        </P>
      </Section>

      <Section num="12" title="Changes to These Terms">
        <P>
          We reserve the right to update these Terms. Changes will be posted with an updated effective date.
          Continued use constitutes acceptance of the revised Terms.
        </P>
      </Section>

      <Section num="13" title="Contact Us">
        <P>For questions regarding these Terms:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Email: <strong style={{ color: WHITE }}>legal@sushimate.ca</strong></Li>
          <Li>Phone: <strong style={{ color: WHITE }}>+1 604 123 4567</strong></Li>
          <Li>Address: SushiMate Canada Inc., Vancouver, BC, Canada</Li>
        </ul>
      </Section>

    </div>
  </div>
);

export default Terms;