/**
 * Open roles for /careers. Edit, add or remove roles here; the page, its "Open roles" list and the
 * apply links (WhatsApp message, email subject) are all built from this list.
 *
 * Keep details factual: only list salary, perks or hybrid work once they are confirmed.
 */

export interface Role {
  slug: string;
  title: string;
  /** e.g. "Sales & Support" */
  team: string;
  type: string;
  location: string;
  experience: string;
  /** Photo in /public/assets/careers */
  image: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
}

export const roles: Role[] = [
  {
    slug: "telecalling-executive",
    title: "Telecalling Executive",
    team: "Sales & Client Relations",
    type: "Full-time",
    location: "On-site · Coimbatore",
    experience: "0–2 years · Freshers welcome",
    image: "/assets/careers/telecalling.jpg",
    summary:
      "Be the first voice businesses hear from Mecatronix. Reach out to prospective clients, understand what they need and book conversations with our project team.",
    responsibilities: [
      "Call and follow up with leads from enquiries, campaigns and referrals",
      "Explain our services — websites, software, apps and ERP — in simple, friendly terms",
      "Book meetings and demos for the project team and keep the lead sheet up to date",
      "Follow up on proposals and note client questions and feedback",
      "Share a short daily report of calls and outcomes",
    ],
    requirements: [
      "Clear spoken Tamil and English",
      "A confident, polite and patient phone manner",
      "Basic computer skills: email, Google Sheets or Excel",
      "Graduate, or in the final year of a degree",
    ],
    niceToHave: ["Previous calling, sales or customer support experience", "Hindi or another Indian language", "Interest in technology and how businesses work"],
  },
  {
    slug: "graphic-designer",
    title: "Graphic Designer",
    team: "Design",
    type: "Full-time",
    location: "On-site · Coimbatore",
    experience: "1–3 years",
    image: "/assets/careers/graphic-designer.jpg",
    summary:
      "Shape how our clients look online — website visuals, brand identities, social media creatives and interface mockups, working closely with our developers.",
    responsibilities: [
      "Design social media creatives, banners, brochures and presentations",
      "Create brand identities for clients: logos, colour palettes and typography",
      "Prepare website and app interface visuals in Figma with the development team",
      "Edit and retouch photos; create simple motion graphics for social media",
      "Keep design files organised, consistent and on brand",
    ],
    requirements: [
      "A portfolio that shows your best work",
      "Figma, plus Photoshop and Illustrator (or equivalents)",
      "A strong eye for layout, typography and colour",
      "Comfortable taking feedback and meeting deadlines",
    ],
    niceToHave: ["After Effects or other motion tools", "A basic understanding of how websites are built (HTML/CSS)", "UI/UX design experience"],
  },
  {
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    team: "Engineering",
    type: "Full-time",
    location: "On-site · Coimbatore",
    experience: "1–4 years",
    image: "/assets/careers/full-stack.jpg",
    summary:
      "Build the websites, business systems and apps our clients run on — from the database to the interface — on a modern, typed stack.",
    responsibilities: [
      "Build features with Next.js, React, TypeScript and Tailwind CSS",
      "Design and build REST APIs with Node.js / NestJS and PostgreSQL or MongoDB",
      "Turn designs into fast, responsive and accessible interfaces",
      "Write clean, typed, reviewed code in Git",
      "Deploy and look after projects on Vercel, Cloudflare and managed cloud hosting",
    ],
    requirements: [
      "Solid JavaScript and TypeScript, and hands-on React",
      "Experience with Node.js and SQL or NoSQL databases",
      "Comfortable with Git and pull-request reviews",
      "Clear communication and a problem-solving mindset",
    ],
    niceToHave: ["Next.js App Router", "NestJS", "React Native", "Automated testing"],
  },
];

/** What working here is like (keep to things that are true today). */
export const perks = [
  { title: "Real work from week one", text: "Ship features and designs for real businesses, not practice projects." },
  { title: "Learn by building", text: "Code reviews, design critiques and direct feedback from the people you work with." },
  { title: "Modern tools", text: "Next.js, TypeScript, Figma and a stack that's current and well supported." },
  { title: "Your work is seen", text: "A focused team where good ideas reach the client quickly." },
];

export const hiringSteps = [
  { title: "Apply", text: "Send your CV (and portfolio for design roles) on WhatsApp or email." },
  { title: "Quick call", text: "A short conversation about you, the role and what you're looking for." },
  { title: "Task or review", text: "A small practical task, or a walk-through of your portfolio or code." },
  { title: "Final chat & offer", text: "Meet the team, ask your questions, and we share the offer." },
];
