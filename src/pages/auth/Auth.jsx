import styles from './Auth.module.css'
import logo from '../../assets/logo.png'
import Input from '../../components/input/Input.jsx'
import Button  from '../../components/button/Button.jsx'
import {Icons} from '../../assets/Icons'

import {useState} from 'react'
import {useForm}  from 'react-hook-form'

export default function Auth() {
  const [isRegister, setIsRegister] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "all",
  });

  const password = watch("password");
  
  return (
    <div className={styles.main}>
      <div className={styles.body}>
        <div className={styles.header}>
          <img width="88px" height="80px" src={logo} />
          <h1>Welcome {isRegister?"":"Back"}</h1>
          <p style={{color:"var(--text)"}} >Manage your finances securely</p>
        </div>
        <div className={styles.loginForm}>
          {isRegister?(<Input LeftIcon={Icons.email} placeholder="Email" type="email" RightIcon=""/>):<></>}
          <Input LeftIcon={Icons.user} placeholder="Username" RightIcon=""/>
          <Input LeftIcon={Icons.lock} placeholder="Password" type="password" RightIcon={Icons.hide} RightIconShow={Icons.show}/>
          <div className={styles.options}>
            <div className={styles.option_1}>
              <Input type="checkbox" lable="Remember me"/>
            </div>
            <Button type="text">Forgot?</Button>
          </div>
          <Button type="fill">Sign In <Icons.arrowRight style={{fontSize:"20px"}}/> </Button>
        </div>
        <div className={styles.separator}>
          <p>Or continue with</p>
        </div>
        <div className={styles.signOptions}>
          <Button type="outline"><Icons.google style={{fontSize:"35px"}}/></Button>
          <Button type="outline"><Icons.apple style={{fontSize:"35px"}}/></Button>
        </div>
      </div>
      <div className={styles.footer}>
        {isRegister?
        (<p>Already have account? <Button type="text" onClick={()=>setIsRegister(false)}>Login</Button></p>):
        (<p>Don't have an account? <Button type="text" onClick={()=>setIsRegister(true)}>Create Account</Button></p>)
      }
      </div>
    </div>
  );
}