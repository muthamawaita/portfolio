export const profile = {
  name: "JEREMIAH MUTHAMA WAITA",
  headline: "Data Analytics | Business Intelligence | Software Development",
  email: "waitamuthama2021@gmail.com",
  phones: "0794158981 / 0705297607",
  linkedin: "https://www.linkedin.com/in/waita-muthama-a40769188/",
  github: "https://github.com/waitamuthama",
  location: "Nairobi, Kenya",
  availability: "Available for select consulting, teaching, and product work",
  bio: "Data and software professional with hands-on experience in business intelligence, statistical analysis, database management, and software development. Proficient in Tableau, Power BI, SPSS, Excel, SQL, Node.js, PHP and its frameworks, and Java. Experienced in transforming complex datasets into dashboards, reports, and actionable insights. Strong background in data cleaning, visualization, information systems, research, and technical training.",
  principles: ["Make the question sharper", "Make the evidence trustworthy", "Make the outcome useful"],
  skills: ["Data Analysis", "Business Intelligence", "Tableau & Power BI", "SPSS & Excel", "SQL & Databases", "Python & Java", "Research Methods", "Software Development", "Technical Training"]
};

export const lessons = [
  { number: "01", title: "Introduction to Data Analytics", detail: "Frame a business question, understand data types, and find signal before opening a chart." },
  { number: "02", title: "Excel for Better Questions", detail: "Clean, structure, and explore real-world datasets with formulas, pivots, and disciplined models." },
  { number: "03", title: "Statistics Without the Fog", detail: "Use descriptive statistics, hypotheses, correlation, ANOVA, and regression with confidence." },
  { number: "04", title: "SQL for Analysts", detail: "Move from SELECT and JOIN to CTEs, windows, views, and decision-ready business analysis." },
  { number: "05", title: "Python Data Analysis", detail: "Build a repeatable notebook workflow with Pandas, visualisation, and model evaluation." },
  { number: "06", title: "Dashboards That Persuade", detail: "Design KPI systems and interactive Power BI or Tableau experiences people can act on." },
  { number: "07", title: "Generative AI and Prompt Engineering", detail: "Use AI as an analytical assistant while validating every assumption, calculation, and conclusion." }
];

export const mediaAssets = [
  { name: "jeremiah-profile.jpg", type: "Image", size: "2.4 MB", updated: "Today", accent: "orange" },
  { name: "customer-churn-report.pdf", type: "Report", size: "1.8 MB", updated: "Yesterday", accent: "blue" },
  { name: "data-analytics-fundamentals.pdf", type: "Course notes", size: "4.1 MB", updated: "12 Aug 2026", accent: "lime" },
  { name: "kpi-dashboard-preview.png", type: "Image", size: "860 KB", updated: "08 Aug 2026", accent: "violet" }
];

export const sitePages = [
  { title: "Home", slug: "/", status: "Published", updated: "Today" },
  { title: "About Me", slug: "/about", status: "Published", updated: "Today" },
  { title: "Teaching & Training", slug: "/teaching", status: "Published", updated: "Yesterday" },
  { title: "Resources", slug: "/resources", status: "Draft", updated: "10 Aug 2026" },
  { title: "Certificates", slug: "/certificates", status: "Published", updated: "05 Aug 2026" },
  { title: "Curriculum Vitae", slug: "/cv", status: "Published", updated: "01 Aug 2026" }
];

export const skillGroups = [
  {
    category: "Data Analytics",
    featured: true,
    skills: [
      { name: "Power BI", level: "Advanced", years: 5 },
      { name: "Tableau", level: "Advanced", years: 5 },
      { name: "Excel", level: "Advanced", years: 7 },
      { name: "SPSS", level: "Advanced", years: 5 },
      { name: "SQL", level: "Advanced", years: 6 },
    ],
  },
  {
    category: "Software Development",
    featured: true,
    skills: [
      { name: "Next.js", level: "Advanced", years: 3 },
      { name: "Node.js", level: "Advanced", years: 4 },
      { name: "TypeScript", level: "Advanced", years: 3 },
      { name: "PHP", level: "Proficient", years: 4 },
      { name: "Java", level: "Proficient", years: 3 },
    ],
  },
  {
    category: "Research & Decision Support",
    featured: false,
    skills: [
      { name: "Statistical Analysis", level: "Advanced", years: 6 },
      { name: "Research Methods", level: "Advanced", years: 5 },
      { name: "Dashboard Design", level: "Advanced", years: 5 },
      { name: "Data Cleaning", level: "Advanced", years: 6 },
      { name: "Insight Communication", level: "Advanced", years: 6 },
    ],
  },
];

export const experienceTimeline = [
  {
    role: "Information Technology Assistant and Software Developer",
    company: "Independent Policing Oversight Authority",
    type: "Full-time",
    dates: "2026 — Present",
    summary: "Designs operational data solutions and business intelligence tools that support evidence-driven institutional decision-making.",
    bullets: [
      "Builds Tableau and Power BI dashboards for performance monitoring and operational reporting.",
      "Analyses institutional data to uncover patterns, bottlenecks, and decision opportunities.",
      "Develops software solutions to support structured information management and productivity workflows.",
    ],
  },
  {
    role: "Academic Assistant",
    company: "Hong Kong Writers",
    type: "Contract",
    dates: "2022 — 2025",
    summary: "Delivered research and analytics support across more than 1,000 projects covering quantitative and qualitative research tasks.",
    bullets: [
      "Handled data analysis, SPSS work, and dashboard-style summarisation for research clients.",
      "Cleaned and interpreted complex datasets to produce evidence-backed recommendations.",
      "Supported postgraduate teams with methodology, analysis, and communication of results.",
    ],
  },
  {
    role: "Information Technology Tutor",
    company: "Elgon View College",
    type: "Full-time",
    dates: "2021",
    summary: "Taught practical technology, analytical reasoning, and digital systems to students across computing and business disciplines.",
    bullets: [
      "Delivered Excel and SPSS training to improve analytical confidence and practical data work.",
      "Taught programming, database systems, web development, and ICT fundamentals.",
      "Supported student development through workshops, mentoring, and digital resources.",
    ],
  },
  {
    role: "Junior Software Engineer",
    company: "Techbrand",
    type: "Full-time",
    dates: "2020 — 2021",
    summary: "Built software products and internal tools using modern programming practices and structured data flows.",
    bullets: [
      "Developed applications with Java, PHP, Node.js, and React.",
      "Created relational data models and API integrations to support product functionality.",
      "Translated business requirements into maintainable, user-friendly digital systems.",
    ],
  },
];

export const educationHistory = [
  {
    qualification: "Bachelor of Science in Computer Science",
    institution: "University of Eldoret",
    dates: "2015 — 2019",
    detail: "Focused on software systems, information management, and practical computing foundations.",
  },
  {
    qualification: "Certificate in Computer Packages",
    institution: "Emmanuel Computer College",
    dates: "2015",
    detail: "Built strong digital literacy and practical office, spreadsheet, and productivity skills.",
  },
  {
    qualification: "Kenya Certificate of Secondary Education",
    institution: "Kambi Mawe Secondary School",
    dates: "2014",
    detail: "Completed general secondary education with a foundation in mathematics, ICT, and analytical study.",
  },
];

export const certifications = [
  {
    title: "Power BI Data Analyst",
    issuer: "Microsoft",
    issued: "2025",
    credential: "PL-300",
    emphasis: "Business intelligence and modelling",
  },
  {
    title: "Tableau Desktop Specialist",
    issuer: "Tableau",
    issued: "2024",
    credential: "TDS-24",
    emphasis: "Interactive dashboard design",
  },
  {
    title: "Python for Data Analysis",
    issuer: "IBM Skills Network",
    issued: "2024",
    credential: "PY-DA-04",
    emphasis: "Analytics workflows and reporting",
  },
  {
    title: "Applied Statistical Research",
    issuer: "Research Methods Institute",
    issued: "2023",
    credential: "ASR-19",
    emphasis: "Research design and evidence interpretation",
  },
];

export const portfolioHighlights = [
  { label: "Projects", value: "06 published", note: "Case studies spanning analytics, development, and research." },
  { label: "Expertise", value: "Data + product", note: "A blend of analytics, software systems, and communication." },
  { label: "Focus", value: "Proof-driven", note: "Every work item is framed around method, evidence, and impact." },
  { label: "Approach", value: "Premium clarity", note: "Structured storytelling built for trust and opportunity." },
];

export const projectFilters = [
  "All",
  "Software Development",
  "Data Analytics",
  "Power BI",
  "Tableau",
  "Web Applications",
  "Mobile Applications",
  "UI/UX",
  "Research",
  "Graphic Design",
];
