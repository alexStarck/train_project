import { PanelMenu } from 'primereact/panelmenu';
import React, { useContext,useRef, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';


 export const NavBar=(props)=>{
     const history = useHistory()
     const auth = useContext(AuthContext)
     const menu = useRef(null);




     const logoutHandler = () => {

         auth.logout()
         // history.push('/')
     }


     // useEffect(()=>{
     //     // console.log(roles)
     //
     //
     // },[])






     const adminItems=[
         {
             label:'Мой аккаунт',
             icon:'pi pi-fw pi-user',
             disabled:true,
             // command:()=>{
             //     props.ChangeHandler()
             // }

         },
         {
             label:'Администрирование',
             icon:'pi pi-fw pi-align-justify',
             items:[
                 {
                     label:'Сотрудники',
                     icon:'pi pi-fw pi-users',
                     command:()=>{
                         console.log('click1')
                         history.push('/UserDashBoard')
                     }
                 },
                  {
                     label:'Отчеты',
                     icon:'pi pi-fw pi-download',
                     command:()=>{
                         console.log('click2')
                         history.push('/ReportsPage')
                     }
                 }

             ]
         },
         {
             label:'Сервисы',
             icon:'pi pi-fw pi-align-justify',
             items:[
               {
                     label:'Поезда',
                     icon:'pi pi-fw pi-globe',
                     command:()=>{
                         history.push('/TrainPage')
                     }
                 },{
                     label:'Задачи',
                     icon:'pi pi-fw pi-globe',
                     command:()=>{
                         history.push('/TasksPage')
                     }
                 }

             ]
         },

         {
             label:'Выход',
             icon:'pi pi-fw pi-power-off',
             command:(event)=>{logoutHandler()}
         }
     ]





         return (
             <>
                 {/*<Menu ref={menu} model={adminItems} popup viewportHeight={182} menuWidth={300}></Menu>*/}
                 {/*<Button  icon="pi pi-bars" label="Menu" style={{width:'100px'}} onClick={(event) => menu.current.toggle(event)}></Button>*/}
                 <PanelMenu model={adminItems} style={{ width: props.width }}/>
             </>
         )


 }

