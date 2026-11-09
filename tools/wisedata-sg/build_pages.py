import os, html

OUT = os.environ.get('WD_OUT', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'wisedata-sg'))
EFFECTIVE = '3 November 2026'
CO = 'Wise Data Pte. Ltd.'
UEN = '202317584K'
ADDR = '883 North Bridge Road, #17-05, Southbank, Singapore 198785'
MAIL = 'be@wisedata.sg'

PAGES = [
    ('privacy', 'Privacy Policy'),
    ('terms', 'Terms of Use'),
    ('cookies', 'Cookie Policy'),
    ('legal', 'Legal Notice'),
]

CSS = """
:root{--ink:#05070D;--panel:#0A0E19;--line:rgba(132,156,255,.15);--line-strong:rgba(132,156,255,.32);--fg:#EEF1FA;--muted:#9AA2B8;--dim:#5B6378;--blue:#2C55F0;--blue-hi:#7B97FF;
--f-display:"Inter Tight","Helvetica Neue",Arial,sans-serif;--f-body:"IBM Plex Sans","Helvetica Neue",Arial,sans-serif;--f-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
*{box-sizing:border-box}
html{background:var(--ink);scroll-behavior:smooth}
body{margin:0;background:var(--ink);color:var(--fg);font-family:var(--f-body);font-size:16.5px;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:var(--blue-hi);text-underline-offset:3px}
a:hover{color:#fff}
:focus-visible{outline:2px solid var(--blue-hi);outline-offset:3px;border-radius:4px}
.wrap{max-width:820px;margin:0 auto;padding:0 max(18px,env(safe-area-inset-left,0px))}
.top{border-bottom:1px solid var(--line);background:rgba(5,7,13,.8)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-top:18px;padding-bottom:18px}
.top img{display:block;height:28px;width:auto}
.top a.back{font-family:var(--f-mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;color:var(--muted)}
.top a.back:hover{color:#fff}
main{padding:56px 0 40px}
.eyebrow{font-family:var(--f-mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--blue-hi)}
h1{font-family:var(--f-display);font-size:clamp(34px,6vw,52px);line-height:1.06;letter-spacing:-.012em;margin:10px 0 14px;font-weight:600}
h2{font-family:var(--f-display);font-size:clamp(21px,3vw,26px);letter-spacing:-.01em;margin:44px 0 10px;font-weight:600;line-height:1.2}
h3{font-family:var(--f-display);font-size:17px;margin:24px 0 6px;font-weight:600}
p,li{color:#C9CFDF}
p{margin:0 0 14px}
ul{padding-left:22px;margin:0 0 16px}
li{margin:6px 0}
.meta{color:var(--dim);font-size:14px;margin-bottom:28px}
.toc{border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:18px 22px;margin:8px 0 8px}
.toc b{font-family:var(--f-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);font-weight:500}
.toc ol{list-style:none;margin:10px 0 0;padding-left:0;columns:2;column-gap:32px}
.toc li{margin:3px 0;break-inside:avoid}
@media(max-width:620px){.toc ol{columns:1}}
.box{border:1px solid var(--line-strong);border-left:3px solid var(--blue);background:var(--panel);border-radius:10px;padding:16px 20px;margin:18px 0}
.box p:last-child{margin:0}
table{width:100%;border-collapse:collapse;margin:12px 0 20px;font-size:15px}
th,td{text-align:left;vertical-align:top;padding:10px 12px;border-bottom:1px solid var(--line)}
th{font-family:var(--f-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);font-weight:500}
td{color:#C9CFDF}
.tw{overflow-x:auto}
footer{border-top:1px solid var(--line);padding:28px 0 48px;font-size:13.5px;color:var(--dim)}
footer nav{display:flex;flex-wrap:wrap;gap:8px 22px;margin-bottom:14px}
footer nav a{color:var(--muted);text-decoration:none}
footer nav a:hover,footer nav a[aria-current]{color:#fff}
footer nav a[aria-current]{text-decoration:underline;text-underline-offset:4px}
"""


def page(slug, title, intro, body_html, toc):
    toc_html = ''
    if toc:
        items = ''.join('<li><a href="#%s">%s</a></li>' % (i, html.escape(t)) for i, t in toc)
        toc_html = '<div class="toc"><b>Contents</b><ol>%s</ol></div>' % items
    nav = ''.join(
        '<a href="/%s/"%s>%s</a>' % (s, ' aria-current="page"' if s == slug else '', t) for s, t in PAGES)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title} · Wise Data</title>
<meta name="description" content="{html.escape(intro)}">
<meta name="theme-color" content="#05070D">
<link rel="canonical" href="https://wisedata.sg/{slug}/">
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="apple-touch-icon" href="/favicon.png">
<meta property="og:title" content="{title} · Wise Data">
<meta property="og:description" content="{html.escape(intro)}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://wisedata.sg/{slug}/">
<link rel="preload" href="/fonts/inter-tight-1bf6b3.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/fonts/fonts.css">
<style>{CSS}</style>
</head>
<body>
<header class="top"><div class="wrap">
  <a href="/" aria-label="Wise Data home"><img src="/logo.png" alt="Wise Data" width="158" height="28"></a>
  <a class="back" href="/">← wisedata.sg</a>
</div></header>
<main><div class="wrap">
  <div class="eyebrow">Legal</div>
  <h1>{title}</h1>
  <div class="meta">{CO} · Effective {EFFECTIVE}</div>
  {toc_html}
  {body_html}
</div></main>
<footer><div class="wrap">
  <nav aria-label="Legal">{nav}</nav>
  <div>{CO} · UEN {UEN} · {ADDR} · <a href="mailto:{MAIL}">{MAIL}</a> · © 2026</div>
</div></footer>
</body>
</html>
"""


def sections(items):
    """items: list of (id, heading, html). Returns (toc, body)."""
    toc = [(i, '%d. %s' % (n + 1, h)) for n, (i, h, _) in enumerate(items)]
    body = ''.join('<section id="%s"><h2>%d. %s</h2>%s</section>' % (i, n + 1, h, b)
                   for n, (i, h, b) in enumerate(items))
    return toc, body


# ---------------------------------------------------------------- PRIVACY
privacy = [
 ('about', 'About this policy', f"""
<p>{CO} (UEN {UEN}), a company incorporated in Singapore ("<b>Wise Data</b>", "<b>we</b>", "<b>us</b>"), respects your privacy. This policy explains how we collect, use, disclose and look after personal data when you visit <b>wisedata.sg</b> or contact us, in line with Singapore's Personal Data Protection Act 2012 (the "<b>PDPA</b>").</p>
<p>"Personal data" means data about an individual who can be identified from that data, or from that data and other information we have or are likely to have access to.</p>
<p>This policy covers our website and our dealings with enquirers, prospective customers, investors and business contacts. It does not cover the data our customers store or process in Wise Office, Ghostdrive Enterprise or OnWise; see section 12.</p>
<p>By using our website or submitting your details to us, you acknowledge this policy. Where the PDPA requires your consent, we obtain it as described below.</p>"""),

 ('collect', 'Personal data we collect', """
<p>We collect only what we need. Depending on how you deal with us, this may include:</p>
<div class="tw"><table>
<tr><th>Source</th><th>Data</th></tr>
<tr><td>Contact and enquiry forms (demo requests, pilot requests, investor briefing requests, OnWise access requests, general enquiries)</td><td>Name; company; work email address; team size; use case or message; for investor briefings, your indicative ticket range and any details you choose to give us</td></tr>
<tr><td>Email and other correspondence</td><td>Name, email address, phone number if you provide it, the content of your messages and any documents you send us</td></tr>
<tr><td>Meetings and calls</td><td>Contact details, job title, company and notes of our discussions</td></tr>
<tr><td>Website visits</td><td>Technical data our hosting provider records in server logs, such as IP address, browser and device type, pages requested, and date and time. We do not use analytics or advertising trackers (see our <a href="/cookies/">Cookie Policy</a>)</td></tr>
</table></div>
<p>Please do not send us sensitive personal data (for example health, financial account or identity-document details) through our forms. If you give us personal data about another person, you confirm that you have their consent to do so.</p>"""),

 ('how', 'How we collect it', """
<p>We collect personal data directly from you when you complete a form, email or call us, or meet us. We may also receive business contact details from your colleagues or employer, from introductions, or from publicly available professional sources, and we will use them only for the purposes in section 4.</p>"""),

 ('purposes', 'Why we use personal data', """
<p>We use personal data to:</p>
<ul>
<li>respond to your enquiry and give you the information, demo, pilot, proposal or investor briefing you asked for;</li>
<li>evaluate whether and how we can work with you, prepare proposals and enter into and perform contracts;</li>
<li>for investor enquiries, assess eligibility (for example, whether you are an institutional or accredited investor) and comply with applicable securities, anti-money-laundering and sanctions requirements;</li>
<li>communicate with you about our products and services where you have asked us to or have consented;</li>
<li>operate, secure and improve our website, and detect and prevent misuse or fraud;</li>
<li>comply with law, respond to lawful requests from authorities and establish, exercise or defend legal claims; and</li>
<li>keep business records.</li>
</ul>
<p>We do not sell personal data.</p>"""),

 ('basis', 'Consent and other grounds', """
<p>We collect, use and disclose personal data with your consent. When you submit a form, you consent to us using the data you give for the purposes described in section 4. Where the PDPA allows, we may also rely on <b>deemed consent</b> (for example, where you voluntarily give us your business contact details for a purpose a reasonable person would expect, such as asking us for a proposal) or on <b>exceptions</b> such as legitimate interests (for example, keeping our website secure and preventing fraud), business improvement, or a legal requirement. Where we rely on legitimate interests, we assess the impact on you first.</p>
<p>You may withdraw your consent at any time (see section 10). Withdrawal may mean we can no longer respond to your enquiry or provide certain services.</p>"""),

 ('sharing', 'Who we share it with', """
<p>We share personal data only as needed for the purposes above, with:</p>
<ul>
<li><b>Service providers</b> who process data for us, including: Web3Forms (delivers website form submissions to us); Spaceship (Spacemail email service); GitHub, Inc. (website hosting through GitHub Pages); and Exabytes (domain registration and DNS). These providers may only use data to provide their services to us or under their own terms;</li>
<li><b>Professional advisers</b> such as lawyers, accountants and auditors, under duties of confidentiality;</li>
<li><b>Our group, partners and suppliers</b> where needed to deliver something you requested, for example Ghostdrive, whose technology underlies some of our offerings, and only with your agreement or where an engagement requires it;</li>
<li><b>Authorities, regulators and courts</b> where required or permitted by law; and</li>
<li><b>A buyer or investor</b> in connection with a merger, acquisition or financing, subject to confidentiality.</li>
</ul>"""),

 ('transfers', 'Transfers outside Singapore', """
<p>Some of our service providers store or process data outside Singapore, including in the United States. Before transferring personal data overseas we take appropriate steps to ensure the recipient is bound by legally enforceable obligations (for example contractual terms or the provider's binding data protection terms) to give the data a standard of protection comparable to the PDPA, as the PDPA's transfer limitation obligation requires.</p>"""),

 ('retention', 'How long we keep personal data', """
<p>We keep personal data only for as long as we need it for the purposes in section 4 or as the law requires. As a general rule: enquiries that do not lead to an engagement are deleted or anonymised within about 24 months of our last meaningful contact; contract, billing and compliance records are kept for the periods required by Singapore law (generally at least five years); and server logs are kept for a short period by our hosting provider. When we no longer need personal data, we delete it, anonymise it or securely destroy it.</p>"""),

 ('security', 'How we protect it, and data breaches', """
<p>We use reasonable administrative, technical and physical safeguards to protect personal data, including access controls, encrypted connections (HTTPS) on our website, and confidentiality obligations on our staff and providers. No system is completely secure, and we cannot guarantee the security of information sent over the internet.</p>
<p>If a data breach occurs that is likely to cause significant harm to individuals or affects 500 or more individuals, we will notify the Personal Data Protection Commission ("<b>PDPC</b>") no later than three calendar days after we assess that the breach is notifiable, and we will notify affected individuals where the PDPA requires.</p>"""),

 ('rights', 'Your rights: access, correction and withdrawal', """
<p>Under the PDPA you may:</p>
<ul>
<li><b>ask for access</b> to the personal data we hold about you and information on how we have used or disclosed it in the past year;</li>
<li><b>ask us to correct</b> personal data you believe is inaccurate or incomplete; and</li>
<li><b>withdraw your consent</b> to our collection, use or disclosure of your personal data.</li>
</ul>
<p>To make a request, email our Data Protection Officer using the details in section 16. We may need to verify your identity first. We aim to respond to access requests within 30 days and will tell you if we need longer. We may charge a reasonable fee for access requests, and will tell you the amount beforehand. We may refuse a request where the PDPA allows, and will explain why. We will act on correction requests as soon as practicable, and on withdrawal of consent after a reasonable time, and we will tell you the consequences.</p>"""),

 ('marketing', 'Marketing and the Do Not Call Registry', """
<p>We send marketing messages only to people who have asked for them or have given consent, and we include a simple way to unsubscribe. We do not send marketing messages by telephone call, text or fax to Singapore telephone numbers listed on the Do Not Call (DNC) Registry unless the PDPA allows it, for example where you have given clear and unambiguous consent. Messages about an existing contract or your own enquiry are not marketing messages. You can opt out at any time by writing to us.</p>"""),

 ('customers', 'Customer data in our services', """
<p>When a customer uses Wise Office, Ghostdrive Enterprise or OnWise, the customer decides what data goes into the service and why. In that case Wise Data generally acts as a <b>data intermediary</b> processing data on the customer's behalf under a written agreement, and the customer is responsible for having the right to use that data. This policy does not govern that processing. If you are an individual whose data is held by one of our customers, please contact that customer first.</p>"""),

 ('children', 'Children', """
<p>Our website and services are for businesses and are not directed at children. We do not knowingly collect personal data from anyone under 18. If you believe a child has given us personal data, please contact us and we will delete it.</p>"""),

 ('links', 'Links to other websites', """
<p>Our website may link to other websites. We do not control them and are not responsible for their privacy practices. Please read their policies.</p>"""),

 ('changes', 'Changes to this policy', f"""
<p>We may update this policy from time to time, for example when our practices or the law change. The latest version is always at <b>wisedata.sg/privacy/</b>, with its effective date at the top. If we make a material change, we will take reasonable steps to bring it to your attention.</p>"""),

 ('contact', 'Contact us and complaints', f"""
<div class="box"><p><b>Data Protection Officer</b><br>{CO}<br>{ADDR}<br>Email: <a href="mailto:{MAIL}">{MAIL}</a></p></div>
<p>If you have a question, request or complaint about how we handle personal data, please contact our Data Protection Officer first so we can address it. If you are not satisfied with our response, you may contact the Personal Data Protection Commission of Singapore at <a href="https://www.pdpc.gov.sg" rel="noopener">pdpc.gov.sg</a>.</p>"""),
]

# ------------------------------------------------------------------ TERMS
terms = [
 ('accept', 'Acceptance', f"""
<p>These Terms of Use ("<b>Terms</b>") govern your use of the website at wisedata.sg and its sub-pages (the "<b>Site</b>"), operated by {CO} (UEN {UEN}) ("<b>Wise Data</b>", "<b>we</b>", "<b>us</b>"). By using the Site you agree to these Terms and to our <a href="/privacy/">Privacy Policy</a>, <a href="/cookies/">Cookie Policy</a> and <a href="/legal/">Legal Notice</a>. If you do not agree, please do not use the Site.</p>"""),

 ('purpose', 'What the Site is for', """
<p>The Site provides general information about Wise Data and its products and services, including Wise Office, Ghostdrive Enterprise, OnWise and Wise Data Centre, and lets you contact us. It is intended for business users and is not directed at consumers or children.</p>
<p>Information on the Site is a general description only. It is not an offer capable of acceptance, and it does not by itself create a contract. Services are supplied under a separate written agreement, proposal or order form signed or accepted by both parties (a "<b>Services Agreement</b>"). If a Services Agreement conflicts with these Terms, the Services Agreement prevails for the services it covers.</p>"""),

 ('info', 'Accuracy and indicative information', """
<p>We take reasonable care to keep the Site accurate and current, but we do not warrant that it is complete or error-free. In particular, prices, calculators, cost and savings estimates, timelines, performance figures and market data are <b>indicative</b> only, and any price or commitment is confirmed only in a proposal or Services Agreement. Example conversations, screens and visuals are illustrative. Product features and specifications may change.</p>"""),

 ('ip', 'Intellectual property', f"""
<p>The Site and its content, including text, graphics, logos, animations, software and layout, are owned by or licensed to {CO} and are protected by copyright, trade mark and other laws. "Wise Data", "Wise Office", "Wise Data Centre" and "OnWise" are marks of Wise Data. Other names, including Ghostdrive and NVIDIA, belong to their respective owners and are used for identification only.</p>
<p>You may view the Site and print or download extracts for your own internal business use. You must not copy, reproduce, republish, modify, frame or commercially exploit the Site or its content, or remove any notices from it, without our prior written permission.</p>"""),

 ('use', 'Acceptable use', """
<p>You must not:</p>
<ul>
<li>use the Site unlawfully or in a way that infringes anyone's rights;</li>
<li>attempt to gain unauthorised access to the Site, our systems or other users' data, or probe, scan or test their security without our written permission;</li>
<li>introduce malware, or interfere with or overload the Site (including through automated scraping or bots that burden it);</li>
<li>submit false, misleading or unlawful content, or submit personal data about others without their consent; or</li>
<li>use the Site to send unsolicited commercial messages.</li>
</ul>
<p>We may suspend or restrict access if we reasonably believe these Terms are being breached.</p>"""),

 ('forms', 'Information you send us', """
<p>When you send us information through the Site, you confirm that it is accurate and that you are entitled to send it. Please do not send confidential or sensitive information, or information subject to a duty of confidence to someone else, through the contact forms; we will arrange a secure channel when needed. Unless we agree otherwise in writing, information you send us is not confidential merely because you sent it. We handle personal data in line with our <a href="/privacy/">Privacy Policy</a>.</p>"""),

 ('links', 'Third-party links and services', """
<p>The Site may link to or rely on third-party websites and services. We do not control them, do not endorse them and are not responsible for their content or practices.</p>"""),

 ('disclaimer', 'Disclaimers', """
<p>To the fullest extent permitted by law, the Site and its content are provided "<b>as is</b>" and "<b>as available</b>", and we exclude all warranties, conditions and representations, whether express or implied, including as to accuracy, fitness for a particular purpose, availability and freedom from errors or harmful components. Nothing on the Site is legal, financial, tax, investment or compliance advice. See the <a href="/legal/">Legal Notice</a> for important notices, including about Wise Data Centre.</p>"""),

 ('liability', 'Limitation of liability', """
<p>To the fullest extent permitted by law, Wise Data and its directors, officers, employees and affiliates are not liable for any indirect, incidental, special or consequential loss, or any loss of profit, revenue, business, goodwill or data, arising out of or in connection with your use of or reliance on the Site, whether in contract, tort (including negligence) or otherwise. Where liability cannot be excluded, our total liability for all claims relating to the Site is limited to S$1,000.</p>
<p>Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or for any liability that cannot be excluded or limited under Singapore law. Liability under a Services Agreement is governed by that agreement.</p>"""),

 ('law', 'Governing law and disputes', """
<p>These Terms and any dispute arising out of or in connection with them or the Site are governed by the laws of Singapore. The courts of Singapore have non-exclusive jurisdiction, and you and we submit to that jurisdiction. A person who is not a party to these Terms has no right under the Contracts (Rights of Third Parties) Act 2001 to enforce any of them.</p>"""),

 ('changes', 'Changes', """
<p>We may change the Site and these Terms at any time. The updated Terms apply from the effective date shown on this page; continuing to use the Site after that date means you accept them.</p>"""),

 ('contact', 'Contact', f"""
<div class="box"><p>{CO}<br>UEN {UEN}<br>{ADDR}<br>Email: <a href="mailto:{MAIL}">{MAIL}</a></p></div>"""),
]

# ---------------------------------------------------------------- COOKIES
cookies = [
 ('summary', 'In short', """
<div class="box"><p><b>Our website does not set cookies and does not use analytics, advertising or tracking tools.</b> Fonts and other files are served from our own site, so no third-party tracker or font service is contacted when you visit.</p></div>
<p>This policy explains that in more detail. It sits alongside our <a href="/privacy/">Privacy Policy</a>.</p>"""),

 ('what', 'What cookies are', """
<p>Cookies are small text files that a website stores on your device. Similar technologies include local storage and tracking pixels. They are commonly used to remember settings, measure traffic and show advertising.</p>"""),

 ('use', 'What our website uses', """
<div class="tw"><table>
<tr><th>Technology</th><th>Purpose</th><th>Provider</th></tr>
<tr><td>Cookies</td><td>None set by wisedata.sg</td><td>-</td></tr>
<tr><td>Local or session storage</td><td>None used</td><td>-</td></tr>
<tr><td>Analytics, advertising or social tracking</td><td>None used</td><td>-</td></tr>
<tr><td>Server logs</td><td>Our hosting provider records technical request data (such as IP address, pages requested and time) to deliver the site and keep it secure</td><td>GitHub, Inc. (GitHub Pages)</td></tr>
</table></div>
<p>When you submit a contact form, your details are sent to our form delivery provider and then to us. That is described in our <a href="/privacy/">Privacy Policy</a>; it does not involve cookies.</p>"""),

 ('control', 'Your choices', """
<p>Because we do not set cookies, there is nothing to switch off on our site. You can still control cookies and similar technologies in your browser settings.</p>"""),

 ('future', 'If this changes', """
<p>If we later add analytics or other technologies that use cookies or similar identifiers, we will update this policy first and, where required, ask for your consent before they are used.</p>"""),

 ('contact', 'Questions', f"""
<p>Please contact our Data Protection Officer at <a href="mailto:{MAIL}">{MAIL}</a>.</p>"""),
]

# ------------------------------------------------------------------ LEGAL
legal = [
 ('company', 'Who we are', f"""
<div class="box"><p><b>{CO}</b><br>Company registration (UEN): {UEN}<br>Registered address: {ADDR}<br>Email: <a href="mailto:{MAIL}">{MAIL}</a></p></div>
<p>The Site at wisedata.sg is operated by {CO}, a company incorporated in Singapore.</p>"""),

 ('general', 'General information only', """
<p>The content of this Site is provided for general information about Wise Data and its products and services. It is not legal, financial, tax, investment, accounting or compliance advice, and you should not rely on it as such. Compliance mappings and regulatory references are advisory only; you should obtain your own professional advice for your circumstances.</p>"""),

 ('datacentre', 'Wise Data Centre: not an offer of securities', """
<div class="box"><p><b>Information only.</b> Nothing on this Site, including the Wise Data Centre pages and investor briefing, is an offer of securities or any other investment product, an invitation or solicitation to make an offer or to invest, or investment advice. No prospectus or offer document has been registered with the Monetary Authority of Singapore in connection with it.</p></div>
<ul>
<li>Any investment would be made only on the basis of definitive documentation and subject to eligibility checks, due diligence and applicable law.</li>
<li>Information about investment opportunities is directed only to institutional investors and accredited investors, as defined in the Securities and Futures Act 2001 of Singapore, and we may ask you to confirm your status before sharing further details.</li>
<li>Wise Data Centre projects are in development. Illustrations, renders and animations are concept visuals and do not depict existing facilities.</li>
<li>Costs, returns, timelines and capacities shown are indicative estimates based on stated assumptions. They are not forecasts, guarantees or promises, and actual results may differ materially. Past or market performance is not a guide to the future.</li>
<li>Market figures come from the sources cited, as at the dates given. We have not independently verified third-party information.</li>
<li>Investing in infrastructure and data centre projects involves risk, including loss of capital. Seek independent professional advice before making any investment decision.</li>
</ul>"""),

 ('forward', 'Forward-looking statements', """
<p>Some statements on the Site look to the future, such as plans, expectations, targets and market opportunities. They reflect our current views and are subject to risks and uncertainties, including regulatory, power availability, construction, supply chain, market and financing risks, which could cause actual outcomes to differ materially. We undertake no obligation to update them except as required by law.</p>"""),

 ('product', 'Products, pricing and examples', """
<p>Descriptions of Wise Office, Ghostdrive Enterprise, OnWise and related services are summaries. Prices, calculators, savings and timeline figures are indicative, shown in US dollars unless stated otherwise, and are confirmed only in a proposal or written agreement. Example conversations, interface screens and company names shown on the Site are illustrative, and any company names in them are fictional. Specifications, features and availability may change, and we may update products and the Site without notice.</p>
<p>Ghostdrive is an encrypted storage and memory system. Feature status and technical details of Ghostdrive are as published by Ghostdrive. Wise Data provides enterprise deployment, hardware, Wise Office and support.</p>"""),

 ('marks', 'Trade marks and third-party names', """
<p>Third-party names and marks, such as Ghostdrive and NVIDIA, belong to their respective owners. Their use on this Site is for identification and does not imply endorsement or affiliation unless we say so.</p>"""),

 ('jurisdiction', 'Jurisdiction', """
<p>The Site is directed at persons in Singapore and is not intended for any person in a jurisdiction where its publication or availability would be unlawful. If you access it from elsewhere, you are responsible for complying with local law.</p>"""),

 ('related', 'Related policies', """
<ul>
<li><a href="/terms/">Terms of Use</a></li>
<li><a href="/privacy/">Privacy Policy</a></li>
<li><a href="/cookies/">Cookie Policy</a></li>
</ul>"""),
]

SPECS = {
    'privacy': ('Privacy Policy', 'How Wise Data collects, uses, discloses and protects personal data under Singapore\'s Personal Data Protection Act.', privacy),
    'terms': ('Terms of Use', 'The terms that apply when you use the Wise Data website.', terms),
    'cookies': ('Cookie Policy', 'Wise Data\'s website sets no cookies and uses no analytics or advertising trackers.', cookies),
    'legal': ('Legal Notice', 'Company details, disclaimers and important notices for the Wise Data website, including Wise Data Centre.', legal),
}

def main():
    for slug, (title, intro, items) in SPECS.items():
        toc, body = sections(items)
        d = os.path.join(OUT, slug)
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf8').write(page(slug, title, intro, body, toc))
        print('wrote', slug)

    # sitemap + robots
    urls = ['', 'privacy/', 'terms/', 'cookies/', 'legal/']
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
        '  <url><loc>https://wisedata.sg/%s</loc></url>\n' % u for u in urls) + '</urlset>\n'
    open(os.path.join(OUT, 'sitemap.xml'), 'w').write(sm)
    open(os.path.join(OUT, 'robots.txt'), 'w').write('User-agent: *\nAllow: /\n\nSitemap: https://wisedata.sg/sitemap.xml\n')


if __name__ == '__main__':
    main()
