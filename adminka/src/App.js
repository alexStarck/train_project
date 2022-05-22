import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes'
import {useAuth} from './hooks/auth.hook'
import {AuthContext} from './context/AuthContext'
import {Menu} from './components/Menu'
import {Loader} from './components/Loader'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


function App() {
    const {token, login, logout, userId, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

    if (!ready) {
        return <Loader/>
    }

    if (isAuthenticated) {
        return (


            <AuthContext.Provider value={{
                token, login, logout, ready, userId, isAuthenticated
            }}>
                <Router>
                    <div className="login_page">


                        <div id="mainArticle">

                            {routes}
                        </div>
                        <Menu id="mainNav"/>


                    </div>


                </Router>
            </AuthContext.Provider>


        )
    } else {
        return (


            <AuthContext.Provider value={{
                token, login, logout, ready, userId, isAuthenticated
            }}>
                <Router>

                    <div style={{
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
