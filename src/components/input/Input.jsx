import styles from "./Input.module.css";
import { useState } from "react";
import {Icons} from '../../assets/Icons'

export default function Input({
  LeftIcon,
  placeholder,
  type,
  RightIcon,
  RightIconShow,
  lable,
  registration,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.main}>
      <div className={`${styles.container} ${styles[type]} ${error && styles.errorState}`}>
        {LeftIcon && <LeftIcon className={`${styles.icon} ${error && styles.errorState}`} />}

        <input
          className={`${styles.input} ${error && styles.errorState}`}
          placeholder={placeholder}
          type={type === "password" && showPassword ? "text" : type}
          {...registration}
        />
        <p>{lable}</p>

        {type === "password" &&
          RightIcon &&
          (showPassword ? (
            <RightIconShow
              className={styles.icon}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <RightIcon
              className={styles.icon}
              onClick={() => setShowPassword(true)}
            />
          ))}
      </div>
      {error && (
        <div className={styles.error}>
          <Icons.wrong/>
          <p>
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
}