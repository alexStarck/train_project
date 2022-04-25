import React,{useState} from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes'
import {useAuth} from './hooks/auth.hook'
import {AuthContext} from './context/AuthContext'
import {NavBar} from './components/NavBar'
import {Loader} from './components/Loader'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';






function App() {
    const {token, login, logout, userId, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated )
    const [open,setOpen]=useState(false)
    const [style,setStyle]=useState({
        width:'110px',left:'0'
    })
    const ChangeHandler=()=>{
        if(style.width==='300px'){
            setStyle({
                width:'100px'
            })
        }else{
            setStyle({
                width:'300px'
            })
        }
    }
    if (!ready) {
        return <Loader />
    }

    if(isAuthenticated ){
        return (


            <AuthContext.Provider value={{
                token, login, logout,ready, userId, isAuthenticated
            }}>
                <Router>
                    {/*<div id="mainNav">*/}
                    {/*    { isAuthenticated && <Menu /> }*/}
                    {/*</div>*/}
                    <div className="login_page p-grid">


                        <div className='p-col'>
                            <NavBar width='100%'   />
                            {routes}
                        </div>
                        {/*<Menu className='mainNav p-col-fixed' style={{width:'100px'}} />*/}
                        {/*<div className='Page p-col' >*/}

                        {/*    {routes}*/}
                        {/*</div>*/}





                    </div>



                </Router>
            </AuthContext.Provider>


        )
    }else{
        return (


            <AuthContext.Provider value={{
                token, login, logout,ready, userId, isAuthenticated
            }}>
                <Router>
                    {/*<div id="mainNav">*/}
                    {/*    { isAuthenticated && <Menu /> }*/}
                    {/*</div>*/}

                    <div style={{
                        // display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>
                        {routes}
                    </div>




                </Router>
            </AuthContext.Provider>


        )
    }

}

export default App
