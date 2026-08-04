import styles from './Auth.module.css'
import logo from '../../assets/logo.png'
import Input from '../../components/input/Input.jsx'
import Button  from '../../components/button/Button.jsx'
import {Icons} from '../../assets/Icons'

import {useState} from 'react'
import {useForm}  from 'react-hook-form'

import {service} from '../../services/auth.service.js'

export default function Auth() {
  const [isRegister, setIsRegister] = useState(true)

  const{
    register,
    handleSubmit,
    formState:{errors},
  } = useForm({mode: "onChange"});

  const onSubmit = async (data) =>  {
    const {email, name, password} = data
    let res;
    if(isRegister){
      res = await service.register({email, name,password})
    }else{
      res = await service.login({email, password})
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.body}>
        <div className={styles.header}>
          <img width="88px" height="80px" src={logo} />
          <h1>Welcome {isRegister?"":"Back"}</h1>
          <p style={{color:"var(--text)"}} >Manage your finances securely</p>
        </div>
        <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
          {isRegister?(<Input 
                LeftIcon={Icons.email} 
                placeholder="Enter your email" 
                RightIcon=""
                registration={register("email", {
                  required: "Required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Inavalid Email",
                  },
                })}
                error={errors.email}
                />):<></>}
          <Input
            LeftIcon={Icons.user} type="text" placeholder="Username"
            registration={register("name", {
              required: "Required",
              minLength:{
                value:4,
                message:"Username must be at least 4 letters"
              },
              pattern:{
                value:/^[a-z0-9]+$/,
                message:"Username only contains small letters & number"
              }
            })}
            error={errors.name}
          />
          <Input 
            LeftIcon={Icons.lock} 
            placeholder="Password" 
            type="password" 
            RightIcon={Icons.hide} 
            RightIconShow={Icons.show}
            
            registration={register("password", {
              required: "Required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                message:
                  "Min 6 chars with 1 uppercase, 1 lowercase, 1 number & 1 special char",
              },
            })}
            error={errors.password}
            />
          <div className={styles.options}>
            <div className={styles.option_1}>
              <Input type="checkbox" lable="Remember me"/>
            </div>
            <Button type="text">Forgot?</Button>
          </div>
          <Button type="fill" htmlType="submit">Sign In <Icons.arrowRight style={{fontSize:"20px"}}/> </Button>
        </form>
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