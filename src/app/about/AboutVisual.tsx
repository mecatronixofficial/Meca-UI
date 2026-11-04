"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Braces, Check, Code2, Layers3, MousePointer2 } from "lucide-react";
import styles from "./about.module.css";

/** Decorative illustration; the surrounding server-rendered copy carries the meaning. */
export function AboutVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const floating = !reducedMotion && inView;

  return (
    <div ref={ref} className={styles.visual} aria-hidden="true">
      <div className={styles.visualGrid} />
      <div className={styles.visualTop}><span><span className={styles.whiteDot} /> THE MECATRONIX WAY</span><ArrowUpRight size={19} /></div>
      <div className={styles.orbit} /><div className={styles.orbitInner} />
      <svg className={styles.connections} viewBox="0 0 500 480" fill="none"><path d="M120 140L250 240L390 140M250 240L130 355M250 240L390 345" stroke="white" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="5 7" /></svg>
      <motion.div className={`${styles.visualCard} ${styles.designCard}`} initial={false} animate={{ y: floating ? [0, -7, 0] : 0 }} transition={{ duration: 5, repeat: floating ? Infinity : 0, ease: "easeInOut" }}>
        <span className={styles.miniIcon}><MousePointer2 size={19} /></span><div><span className={styles.visualLabel}>01 / DESIGN</span><strong>Thoughtfully crafted.</strong></div><div className={styles.designSwatches}><i /><i /><i /><i /></div>
      </motion.div>
      <div className={styles.visualCore}><Braces size={55} strokeWidth={1.5} /><span>mecatronix<span className={styles.coreDot}>.</span></span></div>
      <motion.div className={`${styles.visualCard} ${styles.buildCard}`} initial={false} animate={{ y: floating ? [0, 6, 0] : 0 }} transition={{ duration: 6, repeat: floating ? Infinity : 0, ease: "easeInOut", delay: 0.4 }}>
        <span className={styles.miniIcon}><Code2 size={19} /></span><div><span className={styles.visualLabel}>02 / ENGINEER</span><strong>Built with purpose.</strong></div><div className={styles.codeLines}><i /><i /><i /></div>
      </motion.div>
      <motion.div className={`${styles.visualCard} ${styles.launchCard}`} initial={false} animate={{ y: floating ? [0, -5, 0] : 0 }} transition={{ duration: 5.5, repeat: floating ? Infinity : 0, ease: "easeInOut", delay: 0.8 }}>
        <span className={styles.miniIcon}><Layers3 size={19} /></span><div><span className={styles.visualLabel}>03 / DELIVER</span><strong>Ready for what’s next.</strong></div><span className={styles.launchCheck}><Check size={14} />Built to grow</span>
      </motion.div>
      <div className={styles.visualBottom}><span>HUMAN IDEAS. ENGINEERED WELL.</span><span>↗</span></div>
    </div>
  );
}
