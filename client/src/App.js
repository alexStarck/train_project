import React, {useState, useRef, useEffect, useCallback} from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes'
import {useAuth} from './hooks/auth.hook'
import {AuthContext} from './context/AuthContext'
import classNames from 'classnames';
import {Loader} from './components/Loader'
import {CSSTransition} from 'react-transition-group';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import {AppTopbar} from './components/AppTopbar'
import {AppMenu} from "./components/AppMenu";
import './layout/layout.scss';
import {useHttp} from "./hooks/http.hook";


function App() {
    const {token, login, logout, userId, ready} = useAuth()
    const {request} = useHttp()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('dark')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(false);
    const [user, setUser] = useState({})
    const [sidebarActive, setSidebarActive] = useState(false);
    const sidebar = useRef();


    let menuClick = false;

    useEffect(() => {
        if (sidebarActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [sidebarActive]);



    const fetchUser = useCallback(async () => {
        try {
            const fetched = await request('/api/admin/info', 'POST', null, {
                Authorization: `Bearer ${token}`
            })
            setUser(fetched)
        } catch (e) {
        }
    }, [token, request, user])


    useEffect(() => {

        if (isAuthenticated) {
            fetchUser()
        }


    }, [token])



    const logoutHandler = () => {
        setSidebarActive(false)
        setUser({})
        logout()

    }



    const onWrapperClick = (event) => {
        if (!menuClick && layoutMode === "overlay") {
            setSidebarActive(false);
        }
        menuClick = false;
    }

    const onToggleMenu = (event) => {

        menuClick = true;

        setSidebarActive((prevState) => !prevState);

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;

    }

    const onMenuItemClick = (event) => {

        if (!event.item.items && layoutMode === "overlay") {
            setSidebarActive(false);
        }
    }


    const menu = [
        {
            label: 'Мой аккаунт',
            icon: 'pi pi-fw pi-user',
            disabled: true,

        },
        {
            label: 'Администрирование',
            icon: 'pi pi-fw pi-align-justify',
            items: [
                {
                    label: 'Сотрудники',
                    icon: 'pi pi-fw pi-users',
                    to: '/UserDashBoard'
                },
                {
                    label: 'Отчеты',
                    icon: 'pi pi-fw pi-download',
                    to: '/ReportsPage'
                }
            ]
        },
        {
            label: 'Сервисы',
            icon: 'pi pi-fw pi-align-justify',
            items: [
                {
                    label: 'Поезда',
                    icon: 'pi pi-fw pi-align-justify',
                    to: '/TrainPage'
                }, {
                    label: 'Задачи для вагонов',
                    icon: 'pi pi-fw pi-align-justify',
                    to: '/TasksPage'
                }, {
                    label: 'Типы вагонов',
                    icon: 'pi pi-fw pi-align-justify',
                    to: '/TypeRailwayCarriage'
                }

            ]
        },

        {
            label: 'Выход',
            icon: 'pi pi-fw pi-power-off',
            command: (event) => {
                logoutHandler()
            }
        }
    ]

    const disableScroll = () => {
        let scale = 'scale(1)'
        document.body.style.webkitTransform = scale
        document.body.scroll.zoom = 1.0
    }

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const isSidebarVisible = () => {
        return sidebarActive;
    };


    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-active': sidebarActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false
    });

    const sidebarClassName = classNames('layout-sidebar', {
        'layout-sidebar-dark': layoutColorMode === 'dark',
        'layout-sidebar-light': layoutColorMode === 'light'
    });

    if (!ready) {
        return <Loader/>
    }


    if (isAuthenticated) {
        return (


            <AuthContext.Provider value={{
                token, login, logout, ready, userId, isAuthenticated
            }}>
                <Router>
                    {disableScroll()}


                    <div className={wrapperClass} onClick={onWrapperClick}>
                        <AppTopbar onToggleMenu={onToggleMenu} name={user.name}/>
                        <CSSTransition classNames="layout-sidebar" timeout={{enter: 1200, exit: 1200}}
                                       in={isSidebarVisible()} unmountOnExit>
                            <div ref={sidebar} className={sidebarClassName} onClick={onSidebarClick}>
                                <AppMenu model={menu} onMenuItemClick={onMenuItemClick}/>
                            </div>
                        </CSSTransition>
                        <div className="layout-main">
                            {routes}
                        </div>
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
