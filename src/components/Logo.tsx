import styles from './Logo.module.css';

/** The Body Do mark: a vertical dumbbell on an athletic red plate. */
export function Logo() {
  return (
    <svg className={styles.logo} viewBox="0 0 30 30" aria-hidden="true" focusable="false">
      <rect className={styles.plate} width="30" height="30" rx="9" />
      <rect className={styles.mark} x="11.85" y="5" width="6.3" height="1.6" rx="0.5" />
      <rect className={styles.mark} x="14.59" y="7.4" width="0.82" height="9.8" />
      <rect className={styles.mark} x="8.9" y="18" width="12.2" height="1.6" rx="0.4" />
      <rect className={styles.mark} x="7.68" y="20.5" width="14.65" height="1.6" rx="0.4" />
      <rect className={styles.mark} x="6.05" y="23" width="17.9" height="1.6" rx="0.4" />
    </svg>
  );
}
