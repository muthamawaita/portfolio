export type PortfolioProject = {
  slug: string;
  number: string;
  type: string;
  title: string;
  summary: string;
  problem: string;
  objective: string;
  solution: string;
  client?: string;
  role: string;
  completedDate: string;
  dataset: string;
  tools: string[];
  process: string[];
  challenges: string[];
  findings: string;
  impact: string;
  metric: string;
  metricLabel: string;
  status: "Published" | "Draft";
  reported?: boolean;
  coverImage: string;
  links: Array<{ label: string; href: string; external?: boolean }>; 
  gallery: Array<{ src: string; alt: string; caption: string; width?: number; height?: number; fileSize?: string; isCover?: boolean; }>; 
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "organizational-performance-kpi-dashboard",
    number: "01",
    type: "Business Intelligence",
    title: "Organizational Performance & KPI Dashboard",
    summary: "A synthetic case-performance command centre that turns operational friction into a clear weekly decision loop.",
    problem: "Leadership needed a single view of case volumes, completion rates, departmental performance, and backlogs without exposing confidential records.",
    objective: "Create a consistent decision support dashboard for leadership to monitor workload, recoveries, and operational bottlenecks from one source of truth.",
    solution: "I designed a KPI framework with clean data modelling, department-level drill-throughs, and a weekly operational scorecard tailored for executive visibility.",
    client: "Synthetic public-sector operations case",
    role: "Analyst and dashboard designer",
    completedDate: "May 2026",
    dataset: "Synthetic and anonymised operational cases with dates, departments, categories, status, and resolution time.",
    tools: ["Power BI", "SQL", "Excel"],
    process: ["Data cleaning", "KPI modelling", "Department analysis", "Drill-through design"],
    challenges: ["Consolidating multiple operational views into one narrative", "Keeping the dashboards useful without overloading executives", "Highlighting delays without exposing sensitive information"],
    findings: "Backlogs concentrated in two service categories and month-end completion rates hid a recurring delay pattern.",
    impact: "A manager can prioritise capacity, review the slowest categories, and track weekly recovery against a clear baseline.",
    metric: "38%",
    metricLabel: "backlog visibility gained",
    status: "Published",
    reported: true,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    links: [
      { label: "Live Demo", href: "https://example.com/dashboard-demo", external: true },
      { label: "Documentation", href: "https://example.com/dashboard-docs", external: true },
      { label: "Case Study", href: "/projects/organizational-performance-kpi-dashboard", external: false },
    ],
    gallery: [
      { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", alt: "Executive KPI dashboard overview", caption: "Executive overview of operational performance and backlog trends.", width: 1400, height: 900, fileSize: "1.4 MB", isCover: true },
      { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", alt: "Performance chart summary", caption: "KPI card view showing throughput, volume, and completion rates.", width: 1200, height: 800, fileSize: "1.1 MB" },
      { src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80", alt: "Department performance dashboard", caption: "Department-level drill-through highlighting recovery gaps.", width: 1200, height: 800, fileSize: "930 KB" },
    ],
  },
  {
    slug: "customer-churn-prediction-lab",
    number: "02",
    type: "Machine Learning",
    title: "Customer Churn Prediction Lab",
    summary: "A teaching-grade notebook moving from missing values and feature engineering to model comparison and plain-English recommendations.",
    problem: "A subscription business needed to understand which customer behaviours were associated with churn and where intervention could help.",
    objective: "Deliver a practical churn model that both predicts risk and explains the signals behind it for a retention team.",
    solution: "I built an end-to-end analysis workflow using feature engineering, model comparison, and interpretable outputs to guide service decisions.",
    client: "Subscription retention case study",
    role: "Data analyst and model developer",
    completedDate: "March 2026",
    dataset: "An anonymised customer subscription dataset containing tenure, plan, usage, support contacts, billing, and churn labels.",
    tools: ["Python", "Pandas", "Scikit-learn", "Jupyter"],
    process: ["Missing-value handling", "EDA", "Feature engineering", "Model evaluation"],
    challenges: ["Balancing predictive power with explainability", "Managing class imbalance without distorting operational priorities", "Making recommendations useful for non-data specialists"],
    findings: "Short tenure, low engagement, and repeated support interactions were the strongest practical warning signals.",
    impact: "The retention team can prioritise a small, explainable group for timely support instead of broad untargeted offers.",
    metric: "0.87",
    metricLabel: "random forest F1 score",
    status: "Published",
    reported: true,
    coverImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1400&q=80",
    links: [
      { label: "GitHub Repository", href: "https://github.com/example/churn-lab", external: true },
      { label: "Documentation", href: "https://example.com/churn-docs", external: true },
    ],
    gallery: [
      { src: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80", alt: "Notebook and model analysis screen", caption: "Model comparison and churn-risk insights in a notebook workflow.", width: 1200, height: 800, fileSize: "1.2 MB", isCover: true },
      { src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80", alt: "Data analysis dashboard", caption: "Feature importance and behavioural indicators from the churn analysis.", width: 1200, height: 800, fileSize: "1.0 MB" },
      { src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80", alt: "Chart output from model report", caption: "Comparative model results and retention recommendation logic.", width: 1200, height: 800, fileSize: "980 KB" },
    ],
  },
  {
    slug: "tableau-growth-observatory",
    number: "03",
    type: "Executive Analytics",
    title: "Tableau Growth Observatory",
    summary: "An interactive executive view of revenue, customer behaviour, category momentum, and geographic opportunity.",
    problem: "An executive team needed to move from monthly reporting to a view that made growth opportunities visible by region and category.",
    objective: "Build an executive-facing dashboard that highlights where growth is strongest and where retention action is needed.",
    solution: "I created a layered analytics experience combining revenue trends, commercial segments, and regional comparisons in a single storytelling dashboard.",
    client: "Growth strategy leadership team",
    role: "BI developer and dashboard strategist",
    completedDate: "January 2026",
    dataset: "Synthetic commerce data covering orders, customers, products, regions, revenue, margin, and monthly trends.",
    tools: ["Tableau", "SQL", "Forecasting", "Excel"],
    process: ["Metric definition", "Geographic analysis", "Forecasting", "Interactive filters"],
    challenges: ["Making trend data understandable at executive level", "Highlighting quality of growth instead of only total value", "Turning static monthly reporting into a decision tool"],
    findings: "Two regions showed strong customer growth but lagging repeat purchase rates, creating a focused retention opportunity.",
    impact: "Commercial leaders can compare growth quality, investigate underperforming categories, and act before the next quarter.",
    metric: "+24%",
    metricLabel: "growth opportunity surfaced",
    status: "Published",
    coverImage: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=80",
    links: [
      { label: "Live Demo", href: "https://example.com/growth-observatory", external: true },
      { label: "Case Study", href: "/projects/tableau-growth-observatory", external: false },
    ],
    gallery: [
      { src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80", alt: "Executive growth dashboard", caption: "Executive portfolio view of revenue and category performance.", width: 1200, height: 800, fileSize: "1.3 MB", isCover: true },
      { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", alt: "Executive KPI dashboard", caption: "Regional breakdown to help teams compare momentum and risk.", width: 1200, height: 800, fileSize: "1.1 MB" },
      { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80", alt: "Team presentation layout", caption: "Commercial storytelling layout built for leadership reviews.", width: 1200, height: 800, fileSize: "960 KB" },
    ],
  },
  {
    slug: "student-analytics-platform",
    number: "04",
    type: "Full-stack Product",
    title: "Student Analytics Platform",
    summary: "A product concept for records, attendance, performance risk, lecturer reporting, and early academic support.",
    problem: "Lecturers and administrators needed one workflow instead of disconnected spreadsheets for identifying students who may need support.",
    objective: "Design a unified academic-support product that gives stakeholders early signals without adding friction for staff.",
    solution: "I modelled the platform around role-based workflows, intervention triggers, and clean reporting across attendance, assessments, and support histories.",
    client: "Academic operations concept",
    role: "Product thinker and full-stack developer",
    completedDate: "December 2025",
    dataset: "A privacy-safe education model containing student records, attendance, assessments, modules, and intervention notes.",
    tools: ["Next.js", "Node.js", "MySQL", "REST API"],
    process: ["Role design", "Data validation", "Risk rules", "Reporting UX"],
    challenges: ["Designing for multiple roles without creating confusion", "Balancing data richness against privacy requirements", "Turning academic risk signals into actionable steps"],
    findings: "Attendance and assessment changes together gave earlier and more useful signals than either measure alone.",
    impact: "Lecturers can find students earlier, document support, and report outcomes without rebuilding spreadsheets each week.",
    metric: "4",
    metricLabel: "roles in one workflow",
    status: "Draft",
    coverImage: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1400&q=80",
    links: [{ label: "Documentation", href: "https://example.com/student-platform-docs", external: true }],
    gallery: [
      { src: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80", alt: "Academic reporting dashboard", caption: "Academic overview combining attendance and assessment signals.", width: 1200, height: 800, fileSize: "1.1 MB", isCover: true },
      { src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80", alt: "Student support workflow", caption: "Role-based intervention dashboard for lecturers and administrators.", width: 1200, height: 800, fileSize: "980 KB" },
    ],
  },
  {
    slug: "student-performance-study",
    number: "05",
    type: "Statistical Research",
    title: "Student Performance Study",
    summary: "A research analysis connecting reliability, correlation, ANOVA, regression, and practical interpretation for academic support.",
    problem: "The study explored which learning, attendance, and support factors were associated with academic performance.",
    objective: "Quantify which variables most meaningfully predict student outcomes and explain them clearly for decision-makers.",
    solution: "I applied research methods including reliability checks, hypothesis testing, and regression analysis to interpret the patterns in a defensible way.",
    client: "Academic outcomes research",
    role: "Research analyst",
    completedDate: "September 2025",
    dataset: "A synthetic survey and assessment dataset designed to demonstrate research methods without exposing student information.",
    tools: ["SPSS", "Research Methods", "Excel", "Statistics"],
    process: ["Reliability analysis", "Hypothesis testing", "ANOVA", "Regression interpretation"],
    challenges: ["Avoiding over-interpretation of weak signals", "Communicating complex results in plain language", "Separating correlation from causation"],
    findings: "Study habits and attendance showed meaningful relationships with results after controlling for programme differences.",
    impact: "Academic teams can use the evidence to shape targeted support and explain recommendations transparently.",
    metric: "7",
    metricLabel: "hypotheses tested",
    status: "Published",
    coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80",
    links: [{ label: "Download", href: "https://example.com/student-performance-study.pdf", external: true }],
    gallery: [
      { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80", alt: "Research and academic charts", caption: "Analytical results summarising performance drivers and intervention priorities.", width: 1200, height: 800, fileSize: "1.2 MB", isCover: true },
      { src: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80", alt: "Research notebook", caption: "Methodology and statistical interpretation summarised for academic stakeholders.", width: 1200, height: 800, fileSize: "900 KB" },
    ],
  },
  {
    slug: "ai-assisted-analysis-workflow",
    number: "06",
    type: "AI + Prompt Engineering",
    title: "AI-assisted Analysis Workflow",
    summary: "A validation-first workflow for dataset documentation, SQL drafting, quality checks, and report commentary.",
    problem: "Analysts needed to move faster while retaining control over assumptions, generated code, and the accuracy of conclusions.",
    objective: "Improve delivery speed without compromising analytical rigour or human review.",
    solution: "I designed a workflow where AI helps generate repeatable first drafts, while structured validation and human sign-off remain central to the final result.",
    client: "Analytical operations improvement",
    role: "Strategist and analyst",
    completedDate: "June 2025",
    dataset: "A repeatable analysis workflow using structured business datasets and an evidence checklist for every AI-assisted output.",
    tools: ["Python", "LLMs", "SQL", "Prompt design"],
    process: ["Prompt patterns", "Draft generation", "Result validation", "Human review"],
    challenges: ["Keeping generated outputs grounded in evidence", "Maintaining trust while using AI assistance", "Ensuring workflow steps remain reproducible"],
    findings: "The best prompts specified context, constraints, expected output, and a validation step instead of asking for a generic answer.",
    impact: "Teams can reduce first-draft time while keeping decisions grounded in checked calculations and documented assumptions.",
    metric: "3x",
    metricLabel: "faster first draft",
    status: "Published",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
    links: [{ label: "Documentation", href: "https://example.com/ai-analysis-workflow", external: true }],
    gallery: [
      { src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80", alt: "AI-assisted analysis workflow", caption: "Workflow design for faster but validated reporting and idea generation.", width: 1200, height: 800, fileSize: "1.0 MB", isCover: true },
      { src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80", alt: "Prompt design and analysis", caption: "Structured prompts and human validation help maintain analytical quality.", width: 1200, height: 800, fileSize: "980 KB" },
    ],
  }
];

export const publishedProjects = portfolioProjects.filter((project) => project.status === "Published");
