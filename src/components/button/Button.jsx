import styles from './Button.module.css'
export default function Button({children,type="",onClick}) {
  return (
    <button className={`${styles.button} ${styles[type]}`} onClick={onClick}>
        {children}
    </button>
  );
}