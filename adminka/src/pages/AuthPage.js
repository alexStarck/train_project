import React, {useContext, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';


export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const {loading, request,} = useHttp()
  const [form, setForm] = useState({
    login: '', password: ''
  })



  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }


  const loginHandler = async () => {
      try {
          const data = await request('/api/superAdmin/login', 'POST', {...form})
          console.log(data)
          if(data){
              auth.login(data.token, data.userId)
          }
      } catch (e) {}

  }

  const keyLoginHandler = async (event) => {
    if(event.key==='Enter' && form.login ){
      try {
        const data = await request('/api/superAdmin/login', 'POST', {...form})
        if(data){
          auth.login(data.token, data.userId)
        }
      } catch (e) {}
    }
  }

  return (



      <div
          className=""
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            'padding':'2rem',
            'borderRadius':'15px',
            'marginTop':'5rem',
              border: '1px solid black',

          }}
      >
          <div className="p-fluid"
               style={{
                   'width':'800px',
                   // 'display': 'flex',

               }} >

              <h5 className="p-field p-text-center " style={{height:'30px',textAlign:'center'}}> Log in </h5>
              <span className="p-float-label" style={{height:'60px'}}>
                     <InputText
                         className="p-field "
                         type="text"
                         name="login"
                         value={form.login}
                         onChange={changeHandler}
                         id="username2"
                         aria-describedby="username2-help"
                         onKeyDown={keyLoginHandler}
                     />
                    <label htmlFor="in">Login</label>
              </span>
              {/*<span className="p-float-label">*/}
              {/*       */}
              {/*      <label htmlFor="in">Password</label>*/}
              {/*</span>*/}


            <span className="p-float-label" style={{height:'60px'}}>
                    <Password
                        feedback={false}
                        className="p-field "
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={changeHandler}
                        onKeyDown={keyLoginHandler}
                    />
                    <label htmlFor="in">Password</label>
              </span>




              <Button
                  label="Log in "
                  className="p-field"
                  disabled={loading}
                  onClick={loginHandler}
              />


          </div>
      </div>

  )
}
