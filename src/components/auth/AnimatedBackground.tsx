import styles from "./AnimatedBackground.module.css";

/** Decorative, non-interactive background for the CMS sign-in page. */
export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className={styles.background}
    >
      <div
        className={`${styles.glow} ${styles.glowPink}`}
      />
      <div
        className={`${styles.glow} ${styles.glowPurple}`}
      />

      <div
        className={`${styles.wave} ${styles.wave1}`}
      />
      <div
        className={`${styles.wave} ${styles.wave2}`}
      />
      <div
        className={`${styles.wave} ${styles.wave3}`}
      />
    </div>
  );
}
