import styles from './Input.module.css'

export default function Input({LeftIcon, placeholder, type, RightIcon, lable}) {
    return (
    <div className={`${styles.container} ${styles[type]}`}>
        {LeftIcon && <LeftIcon className={styles.icon} />}
        <input 
        className={styles.input}
        placeholder={placeholder}
        type={type}
        />
        {lable || <></>}
        {RightIcon && <RightIcon  className={styles.icon}/>}
    </div>
  );
}