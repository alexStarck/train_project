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
          const data = await request('/api/auth/login', 'POST', {...form})
          if(data){
              auth.login(data.token, data.userId,data.company)
          }
      } catch (e) {}

  }

  const keyLoginHandler = async (event) => {
    if(event.key==='Enter' && form.login ){
      try {
        const data = await request('/api/auth/login', 'POST', {...form})
        if(data){
          auth.login(data.token, data.userId,data.company)
        }
      } catch (e) {}
    }
  }

  return (

      <div className="login-body">
          <div className="login-panel p-field" >
              <div className="login-panel-header" >
                            <h3 className="p-field p-text-center " >Авторизация </h3>
              </div>
              <div className="login-panel-content" >
                  <div className='p-grid'>
                      <div className='p-col-12'  >
                          <span className="p-float-label" >

                            <InputText
                                className="p-field "
                                type="text"
                                name="login"
                                value={form.login}
                                onChange={changeHandler}
                                id="username"
                                autoComplete="new-email"
                                aria-describedby="username2-help"
                                onKeyDown={keyLoginHandler}
                            />
                                <label htmlFor="in" >логин</label>
                            </span>
                      </div>
                      <div className='p-col-12'>
                          <span className="p-float-label" >
                                        <Password
                                            feedback={false}
                                            className="p-field "
                                            type="password"
                                            name="password"
                                            autoComplete="disabled"
                                            value={form.password}
                                            onChange={changeHandler}
                                            onKeyDown={keyLoginHandler}
                                        />
                                        <label htmlFor="in">пароль</label>
                                    </span>
                      </div>
                      <div className='p-col-12' style={{textAlign: "left"}}>
                          <Button
                              label="войти "
                              className="p-field"
                              disabled={loading}
                              onClick={loginHandler}
                          />
                      </div>



                  </div>


              </div>

          </div>
      </div>

  )
}
