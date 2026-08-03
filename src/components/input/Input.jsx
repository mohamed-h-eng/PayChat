import styles from "./Input.module.css";
import { useState } from "react";

export default function Input({
  LeftIcon,
  placeholder,
  type,
  RightIcon,
  RightIconShow,
  lable,
}) {
  const [showPassword, setShowPassword] = useState(false);
  function handleShowPassword() {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  }
  return (
    <div className={`${styles.container} ${styles[type]}`}>
      {LeftIcon && <LeftIcon className={styles.icon} />}
      <input
        className={styles.input}
        placeholder={placeholder}
        type={type == "password" && showPassword ? "text" : type}
      />
      {lable || <></>}
      {RightIcon &&
        (showPassword ? (
          <RightIconShow
            className={styles.icon}
            onClick={() => handleShowPassword()}
          />
        ) : (
          <RightIcon
            className={styles.icon}
            onClick={() => handleShowPassword()}
          />
        ))}
    </div>
  );
}
