"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Cpu,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { industries, type Industry } from "../../data/industries";
import { serviceList } from "../../data/service-list";
import { industryIcons } from "../../components/ui/icons";
import { PauseOffscreen } from "../../components/animations/PauseOffscreen";
import { IndustryArt } from "./IndustryArt";
import { industryFilters, industryPresentation } from "./industry-presentation";
import styles from "./industries.module.css";

const positions = [
  [25, 16],
  [72, 14],
  [91, 39],
  [83, 72],
  [58, 87],
  [25, 83],
  [8, 59],
  [8, 32],
];

export function IndustryOrbit() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const moveX = useSpring(x, { stiffness: 100, damping: 25 });
  const moveY = useSpring(y, { stiffness: 100, damping: 25 });
  const selected = industries[active];

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (
      reduceMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.025);
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.025);
  };

  return (
    <div
      className={styles.orbitWrap}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className={styles.visualTop}>
        <span>
          <i /> CONNECTED BY DESIGN
        </span>
        <span>MX / 08</span>
      </div>
      <PauseOffscreen>
        <motion.div className={styles.orbit} style={{ x: moveX, y: moveY }}>
          <div className={styles.orbitGrid} aria-hidden="true" />
          <div className={styles.orbitCircle} aria-hidden="true" />
          <div className={styles.orbitCircleInner} aria-hidden="true" />
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className={styles.connections}
            aria-hidden="true"
          >
            {positions.map(([cx, cy], i) => (
              <path
                key={i}
                d={`M50 50 Q${cx} 50 ${cx} ${cy}`}
                className={active === i ? styles.connectionActive : ""}
              />
            ))}
          </svg>
          <div className={styles.digitalCore} aria-hidden="true">
            <Cpu size={33} strokeWidth={1.3} />
            <strong>
              MECA<span>TRONIX</span>
            </strong>
            <span>DIGITAL ENGINEERING</span>
          </div>
          {industries.map((industry, i) => {
            const Icon = industryIcons[industry.icon];
            return (
              <a
                key={industry.slug}
                href={`#${industry.slug}`}
                className={`${styles.orbitNode} ${active === i ? styles.nodeActive : ""}`}
                style={
                  {
                    "--node-x": `${positions[i][0]}%`,
                    "--node-y": `${positions[i][1]}%`,
                  } as CSSProperties
                }
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => {
                  if (window.location.hash === `#${industry.slug}`)
                    window.dispatchEvent(new HashChangeEvent("hashchange"));
                }}
                aria-label={`Explore ${industry.name}`}
              >
                <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
                <span>{industryPresentation[industry.icon].label}</span>
              </a>
            );
          })}
          <span className={styles.orbitSignal} aria-hidden="true">
            <span /> WORKFLOWS, CONNECTED.
          </span>
        </motion.div>
      </PauseOffscreen>
      <div className={styles.visualBottom}>
        <span>{industryPresentation[selected.icon].label}</span>
        <span>
          One connected system <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

export function IndustryExplorer() {
  const [filter, setFilter] = useState<string>("all");
  const reduceMotion = useReducedMotion();
  const visible = industries.filter(
    (industry) =>
      filter === "all" || industryPresentation[industry.icon].group === filter,
  );

  useEffect(() => {
    let frame = 0;
    const revealAnchor = () => {
      const slug = window.location.hash.slice(1);
      if (!industries.some((industry) => industry.slug === slug)) return;
      setFilter("all");
      // Wait for filtered cards to become visible before resolving an industry anchor.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() =>
          document
            .getElementById(slug)
            ?.scrollIntoView({ behavior: "instant", block: "start" }),
        );
      });
    };
    window.addEventListener("hashchange", revealAnchor);
    revealAnchor();
    return () => {
      window.removeEventListener("hashchange", revealAnchor);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className={styles.explorerToolbar}>
        <div
          className={styles.filters}
          role="group"
          aria-label="Filter industries"
        >
          {industryFilters.map((item) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={filter === item.key}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={styles.resultCount} role="status" aria-live="polite">
          <SlidersHorizontal size={14} aria-hidden="true" />{" "}
          {String(visible.length).padStart(2, "0")} INDUSTRIES
        </p>
      </div>
      <div className={styles.bento} data-filter={filter}>
        {industries.map((industry, i) => {
          const Icon = industryIcons[industry.icon];
          const shown =
            filter === "all" ||
            industryPresentation[industry.icon].group === filter;
          return (
            <motion.article
              key={industry.slug}
              id={industry.slug}
              hidden={!shown}
              layout={!reduceMotion}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
              className={`${styles.industryCard} ${styles[industry.icon]} spotlight`}
            >
              <Link
                href={`/industries/${industry.slug}`}
                className={styles.industryCardLink}
              >
                <div className={styles.cardTop}>
                  <span>{String(i + 1).padStart(2, "0")} /</span>
                  <Icon size={24} strokeWidth={1.4} aria-hidden="true" />
                </div>
                <div className={styles.cardArt}>
                  <IndustryArt kind={industry.icon} />
                </div>
                <div className={styles.cardCopy}>
                  <h3>{industry.name}</h3>
                  <p>{industry.useCase}</p>
                </div>
                <div className={styles.cardFoot}>
                  <ul aria-label="Example solutions">
                    {industryPresentation[industry.icon].steps
                      .slice(0, 3)
                      .map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                  </ul>
                  <span className={styles.cardArrow}>
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    </>
  );
}

function SpotlightVisual({ industry }: { industry: Industry }) {
  const [step, setStep] = useState(0);
  const Icon = industryIcons[industry.icon];
  const presentation = industryPresentation[industry.icon];
  return (
    <div className={styles.spotlightVisual}>
      <div className={styles.dashboardBar}>
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>{presentation.label.toUpperCase()} / WORKSPACE</span>
        <Layers size={15} aria-hidden="true" />
      </div>
      <div className={styles.dashboardHeading}>
        <div>
          <span className={styles.microLabel}>
            BUILT AROUND YOUR OPERATIONS
          </span>
          <h4>{presentation.label}, connected.</h4>
        </div>
        <Icon size={29} strokeWidth={1.3} aria-hidden="true" />
      </div>
      <div className={styles.dashboardArt}>
        <IndustryArt kind={industry.icon} />
        <span>ILLUSTRATIVE WORKFLOW</span>
      </div>
      <div
        className={styles.flowButtons}
        role="group"
        aria-label={`${industry.name} workflow preview`}
      >
        {presentation.steps.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={i === step}
            onClick={() => setStep(i)}
            onMouseEnter={() => setStep(i)}
            onFocus={() => setStep(i)}
          >
            <span>
              {i < step ? (
                <Check size={12} aria-hidden="true" />
              ) : (
                String(i + 1).padStart(2, "0")
              )}
            </span>
            {label}
            {i < 3 && (
              <ArrowRight
                size={12}
                className={styles.flowArrow}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>
      <div className={styles.workflowReadout} aria-live="polite">
        <span>
          <i /> WORKFLOW {String(step + 1).padStart(2, "0")}
        </span>
        <p>{industry.workflows[step]}</p>
        <span>People. Process. One platform.</span>
      </div>
    </div>
  );
}

export function IndustrySpotlight() {
  const [active, setActive] = useState(industries[0].slug);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  const navigateTabs = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % industries.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + industries.length) % industries.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = industries.length - 1;
    else return;
    event.preventDefault();
    setActive(industries[next].slug);
    refs.current[next]?.focus();
  };

  return (
    <>
      <div
        className={styles.spotlightTabs}
        role="tablist"
        aria-label="Choose an industry spotlight"
      >
        {industries.map((industry, i) => (
          <button
            key={industry.slug}
            id={`tab-${industry.slug}`}
            role="tab"
            type="button"
            aria-selected={active === industry.slug}
            aria-controls={`panel-${industry.slug}`}
            tabIndex={active === industry.slug ? 0 : -1}
            ref={(element) => {
              refs.current[i] = element;
            }}
            onClick={() => setActive(industry.slug)}
            onKeyDown={(event) => navigateTabs(event, i)}
          >
            {industryPresentation[industry.icon].label}
          </button>
        ))}
      </div>
      {industries.map((industry) => (
        <div
          key={industry.slug}
          id={`panel-${industry.slug}`}
          role="tabpanel"
          aria-labelledby={`tab-${industry.slug}`}
          tabIndex={0}
          hidden={active !== industry.slug}
          className={styles.spotlightPanel}
        >
          <motion.div
            className={styles.spotlightCopy}
            initial={false}
            animate={
              active === industry.slug
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 12 }
            }
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
          >
            <p className={styles.microLabel}>INDUSTRY IN FOCUS</p>
            <h3>{industry.name}</h3>
            <p className={styles.spotlightIntro}>{industry.intro}</p>
            <div className={styles.detailColumns}>
              <div>
                <h4>Workflows we support</h4>
                <ul>
                  {industry.workflows.map((workflow) => (
                    <li key={workflow}>
                      <Check size={14} aria-hidden="true" />
                      {workflow}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>What we can build</h4>
                <ul>
                  {industry.solutions.map((solution) => (
                    <li key={solution}>
                      <span aria-hidden="true" />
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <ul
              className={styles.serviceTags}
              aria-label={`Services for ${industry.name}`}
            >
              {industry.services.map((slug) => (
                <li key={slug}>
                  <Link href={`/services/${slug}`}>
                    {
                      serviceList.find((service) => service.slug === slug)
                        ?.navLabel
                    }
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/industries/${industry.slug}`}
              className={styles.textLink}
            >
              Explore solutions <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </motion.div>
          <AnimatePresence mode="wait" initial={false}>
            {active === industry.slug && (
              <motion.div
                key={industry.slug}
                className={styles.spotlightVisualWrap}
                initial={{
                  opacity: reduceMotion ? 1 : 0,
                  y: reduceMotion ? 0 : 12,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.3 }}
              >
                <SpotlightVisual industry={industry} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
}

const workflowStages = [
  {
    name: "Discover",
    title: "Start with how work happens.",
    text: "We map the people, handoffs and constraints behind your daily operations before defining what to build.",
    output: "Workflow maps & clear requirements",
    icon: Layers,
  },
  {
    name: "Design",
    title: "Make the complex feel simple.",
    text: "We turn requirements into clear user journeys and clickable interfaces your team can review early.",
    output: "User flows & interactive prototypes",
    icon: Code2,
  },
  {
    name: "Develop",
    title: "Build on solid foundations.",
    text: "We create maintainable applications in working increments, with regular demos and room for feedback.",
    output: "Tested, working software",
    icon: Cpu,
  },
  {
    name: "Integrate",
    title: "Connect the moving parts.",
    text: "We connect inventory, orders, payments and existing tools so information can move between your systems.",
    output: "Connected tools & reliable handoffs",
    icon: Layers,
  },
  {
    name: "Optimize",
    title: "Keep making work better.",
    text: "After launch, we use real feedback to refine usability, improve reliability and plan the next useful release.",
    output: "Monitoring, improvements & support",
    icon: SlidersHorizontal,
  },
];

export function WorkflowSystem() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const stage = workflowStages[active];
  const Icon = stage.icon;
  return (
    <div className={styles.workflowSystem}>
      <div className={styles.workflowStages}>
        <motion.span
          className={styles.workflowConnector}
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduceMotion ? 0 : 1 }}
        />
        {workflowStages.map((item, i) => (
          <button
            key={item.name}
            type="button"
            className={styles.workflowStage}
            aria-pressed={active === i}
            aria-controls="workflow-description"
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <span className={styles.stageIndex}>
              {String(i + 1).padStart(2, "0")}
              <span aria-hidden="true" />
            </span>
            <strong>{item.name}</strong>
            <ArrowDown size={14} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div
        id="workflow-description"
        className={styles.workflowDescription}
        aria-live="polite"
      >
        <span className={styles.workflowIcon}>
          <Icon size={28} strokeWidth={1.4} aria-hidden="true" />
        </span>
        <div>
          <h3>{stage.title}</h3>
          <p>{stage.text}</p>
        </div>
        <span className={styles.workflowOutput}>
          <Check size={15} aria-hidden="true" />
          {stage.output}
        </span>
      </div>
    </div>
  );
}
