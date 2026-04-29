const BG    = '#0a0000';
const BG2   = '#130000';
const RED   = '#D42B2B';
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

      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '5px', color: RED, textTransform: 'uppercase', marginBottom: '8px' }}>
          SushiMate · Legal
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 700, color: WHITE, marginBottom: '10px' }}>
          Terms & Conditions
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#5a2a2a', fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px' }}>
          Last updated: 25 April 2026 · Effective immediately
        </p>
        <div style={{ width: '40px', height: '2px', background: RED, marginTop: '16px' }} />
      </div>

      {/* Intro box */}
      <div style={{ background: BG2, border: `1px solid ${RDIM}`, borderRadius: '3px', padding: '20px 24px', marginBottom: '40px' }}>
        <P>
          These Terms and Conditions ("Terms") govern your use of the SushiMate website, mobile application, and
          food delivery services operated by <strong style={{ color: WHITE }}>SushiMate LLC</strong>, a company registered in Dubai,
          United Arab Emirates. By placing an order or creating an account, you agree to be bound by these Terms.
          If you do not agree, please do not use our services.
        </P>
      </div>

      <Section num="1" title="Eligibility">
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>You must be at least 18 years of age to use our services.</Li>
          <Li>You must provide accurate, complete, and current personal information during registration and checkout.</Li>
          <Li>Our services are currently available only within the United Arab Emirates.</Li>
          <Li>SushiMate reserves the right to refuse service to anyone for any lawful reason.</Li>
        </ul>
      </Section>

      <Section num="2" title="Orders & Acceptance">
        <P>
          Placing an order on our platform constitutes an offer to purchase. An order is confirmed only when you
          receive a confirmation email or SMS with an order number. We reserve the right to reject or cancel any
          order, including due to:
        </P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Product unavailability or stock shortages.</Li>
          <Li>Errors in pricing or product description on our platform.</Li>
          <Li>Failure to verify payment or delivery address.</Li>
          <Li>Suspected fraudulent activity.</Li>
        </ul>
        <P>
          If we cancel your confirmed order, you will receive a full refund within 3–5 business days.
        </P>
      </Section>

      <Section num="3" title="Pricing & Payment">
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>All prices are listed in UAE Dirhams (AED) and are inclusive of VAT at 5%, in accordance with UAE Federal Tax Authority regulations.</Li>
          <Li>Delivery fees, if applicable, are displayed at checkout before payment confirmation.</Li>
          <Li>We accept major credit/debit cards (Visa, Mastercard), Apple Pay, Google Pay, and cash on delivery (where available).</Li>
          <Li>Card payments are processed by PCI-DSS compliant payment gateways. SushiMate does not store your card details.</Li>
          <Li>Prices are subject to change without notice, but changes will not affect already-confirmed orders.</Li>
          <Li>Promotional prices and discount codes cannot be combined unless explicitly stated.</Li>
        </ul>
      </Section>

      <Section num="4" title="Delivery">
        <P>
          We currently deliver to Dubai, Abu Dhabi, and Sharjah. Delivery times are estimates only and may vary
          due to traffic, weather, or high demand. Our target delivery window is <strong style={{ color: WHITE }}>30–45 minutes</strong>.
        </P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Free delivery on orders of 100 AED or above. Orders below this threshold incur a delivery fee shown at checkout.</Li>
          <Li>You are responsible for providing an accurate and accessible delivery address. SushiMate is not liable for failed deliveries due to incorrect address information.</Li>
          <Li>If no one is available to receive the order upon arrival, our rider will wait up to 5 minutes. After that, the order may be returned and no refund will be issued for perishable items.</Li>
          <Li>Delivery is made to ground-floor or building lobby where access is restricted. SushiMate riders are not obligated to proceed beyond building entrances.</Li>
          <Li>During peak hours or extreme weather, delivery times may be extended. You will be notified.</Li>
        </ul>
      </Section>

      <Section num="5" title="Cancellations & Refunds">
        <P>Orders may be cancelled free of charge within <strong style={{ color: WHITE }}>2 minutes</strong> of placement. After this window, the following applies:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li><strong style={{ color: WHITE }}>Order already being prepared:</strong> cancellation is not possible. No refund will be issued.</Li>
          <Li><strong style={{ color: WHITE }}>Incorrect or missing items:</strong> contact us within 30 minutes of delivery. We will replace the item on your next order or issue a partial credit.</Li>
          <Li><strong style={{ color: WHITE }}>Quality issues:</strong> if food is received in unsatisfactory condition, please contact us with photographic evidence within 1 hour of delivery.</Li>
          <Li><strong style={{ color: WHITE }}>Refund processing:</strong> approved refunds are returned to the original payment method within 5–7 business days.</Li>
        </ul>
        <P>
          SushiMate does not accept returns of food products for hygiene and safety reasons, except in cases of
          verified quality failure.
        </P>
      </Section>

      <Section num="6" title="Halal Certification">
        <P>
          All food items prepared and delivered by SushiMate are Halal-certified in accordance with UAE regulatory
          standards. Our kitchen maintains strict Halal compliance, including sourcing, preparation, and storage.
          Our Halal certification is issued by an accredited UAE certification body and is renewed annually.
        </P>
      </Section>

      <Section num="7" title="Allergen & Dietary Information">
        <P>
          While we make every effort to provide accurate allergen information, our kitchen handles common
          allergens including fish, shellfish, sesame, soy, gluten, dairy, and eggs. We cannot guarantee the
          complete absence of any allergen. If you have a severe food allergy, please contact us before ordering.
          SushiMate is not liable for allergic reactions resulting from undisclosed allergies.
        </P>
      </Section>

      <Section num="8" title="Promotions, Vouchers & Loyalty">
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Promotional codes are single-use per customer unless stated otherwise.</Li>
          <Li>Promotions cannot be applied retroactively to completed orders.</Li>
          <Li>SushiMate reserves the right to withdraw, modify, or expire promotions at any time.</Li>
          <Li>Loyalty points (where applicable) have no cash value and cannot be transferred or sold.</Li>
          <Li>Fraudulent use of promotional codes will result in account suspension and forfeiture of any associated credits.</Li>
        </ul>
      </Section>

      <Section num="9" title="Intellectual Property">
        <P>
          All content on the SushiMate platform — including text, images, logos, design, and software — is the
          exclusive property of SushiMate LLC or its licensors. You may not copy, reproduce, distribute, or create
          derivative works without our express written permission.
        </P>
      </Section>

      <Section num="10" title="User Conduct">
        <P>You agree not to:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Use our platform for any unlawful purpose or in violation of UAE law.</Li>
          <Li>Attempt to gain unauthorised access to our systems or other users' accounts.</Li>
          <Li>Submit false, misleading, or fraudulent orders or reviews.</Li>
          <Li>Harass, threaten, or abuse SushiMate staff or delivery riders.</Li>
          <Li>Use automated tools to scrape, crawl, or spam our platform.</Li>
        </ul>
        <P>
          Violation of these rules may result in immediate account suspension and, where appropriate, reporting
          to UAE law enforcement authorities.
        </P>
      </Section>

      <Section num="11" title="Limitation of Liability">
        <P>
          To the maximum extent permitted by UAE law, SushiMate's total liability for any claim arising from your
          use of our services is limited to the amount paid by you for the specific order in question. We are not
          liable for indirect, incidental, consequential, or punitive damages.
        </P>
        <P>
          SushiMate is not responsible for delays or failures caused by circumstances beyond our reasonable control,
          including natural disasters, government restrictions, strikes, power failures, or acts of third parties.
        </P>
      </Section>

      <Section num="12" title="Governing Law & Disputes">
        <P>
          These Terms are governed by the laws of the United Arab Emirates and, specifically, the laws of the
          Emirate of Dubai. Any dispute arising from or relating to these Terms shall first be subject to
          good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to the exclusive
          jurisdiction of Dubai courts.
        </P>
      </Section>

      <Section num="13" title="Changes to These Terms">
        <P>
          We reserve the right to update these Terms at any time. Changes will be posted on this page with an
          updated effective date. Your continued use of our services after changes are posted constitutes
          acceptance of the revised Terms. We recommend reviewing this page periodically.
        </P>
      </Section>

      <Section num="14" title="Contact Us">
        <P>For any questions regarding these Terms:</P>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Li>Email: <strong style={{ color: WHITE }}>legal@sushimate.ae</strong></Li>
          <Li>Phone: <strong style={{ color: WHITE }}>+971 4 123 4567</strong></Li>
          <Li>Address: SushiMate LLC, Dubai, United Arab Emirates</Li>
          <Li>Hours: Sunday – Thursday, 09:00 – 18:00 GST</Li>
        </ul>
      </Section>

    </div>
  </div>
);

export default Terms;
