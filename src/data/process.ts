export interface ProcessStep {
  n: string;
  title: string;
  text: string;
  /** Detail for the /process page */
  detail: string;
  deliverables: string[];
  /** What we need from the client at this stage */
  fromYou: string;
}

export const processSteps: ProcessStep[] = [
  {
    n: "01",
    title: "Discovery",
    text: "Understand business objectives, users, challenges and functional requirements.",
    detail:
      "We start with conversations, not code. We learn how your business works today, who will use the software, what is slowing you down and what a successful outcome looks like in practical terms.",
    deliverables: ["Requirements summary", "User and stakeholder map", "Success measures"],
    fromYou: "Time with the people who do the work, plus any existing documents, spreadsheets or systems.",
  },
  {
    n: "02",
    title: "Planning & Strategy",
    text: "Define architecture, workflows, priorities and project scope.",
    detail:
      "We turn discovery into a plan: the scope of the first release, how the system will be structured, which technologies fit, and the milestones you can expect. You know what is being built and why before development begins.",
    deliverables: ["Scope and milestone plan", "Architecture outline", "Estimate and timeline"],
    fromYou: "Decisions on priorities and sign-off on the scope for the first release.",
  },
  {
    n: "03",
    title: "UI/UX Design",
    text: "Create intuitive interfaces and clear user experiences.",
    detail:
      "We design the screens your users will work with, starting from the most important journeys. Prototypes let you click through flows and give feedback while changes are still quick and inexpensive.",
    deliverables: ["User flows", "Interface designs", "Clickable prototype"],
    fromYou: "Feedback on prototypes, brand assets and content.",
  },
  {
    n: "04",
    title: "Development",
    text: "Build maintainable frontend, backend and database systems.",
    detail:
      "We build in short cycles and show working software regularly. Code is typed, reviewed and structured to be maintained — by us or by your own team later.",
    deliverables: ["Working increments", "Regular demos", "Source code in version control"],
    fromYou: "Availability for demos and timely answers to questions that come up.",
  },
  {
    n: "05",
    title: "Quality Assurance",
    text: "Test functionality, responsiveness, usability and reliability.",
    detail:
      "Each release is tested across devices and browsers, against real scenarios and edge cases. Before launch, you review the software on a staging environment that mirrors production.",
    deliverables: ["Test checklist", "Staging environment", "Issue log and fixes"],
    fromYou: "User acceptance testing with real data and scenarios.",
  },
  {
    n: "06",
    title: "Launch & Support",
    text: "Deploy, monitor and provide agreed post-launch assistance.",
    detail:
      "We handle deployment, domains and configuration, then monitor the system after go-live. An agreed support period covers fixes and adjustments, and we can plan further improvements together.",
    deliverables: ["Production deployment", "Handover documentation", "Agreed support period"],
    fromYou: "Final go-live approval and a point of contact for support.",
  },
];
