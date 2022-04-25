import { PanelMenu } from 'primereact/panelmenu';
import React, { useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'


 export const Menu=()=>{
     const history = useHistory()
     const auth = useContext(AuthContext)





     const logoutHandler = () => {

         auth.logout()
         history.push('/')
     }


     useEffect(()=>{
         // console.log(roles)


     },[])






     const adminItems=[
         {
             label:'My Account',
             icon:'pi pi-fw pi-user',
             items:[
                 {
                     label:'House',
                     icon:'pi pi-fw pi-home',
                     command:()=>{
                         history.push('/MyHousePage')
                     }
                 }
             ]
         },
         {
             label:'Adminka',
             icon:'pi pi-fw pi-align-justify',
             items:[
                {
                     label:'Admin DashBoard',
                     icon:'pi pi-fw pi-users',
                     command:()=>{
                         history.push('/AdminDashBoard')
                     }
                 },{
                     label:'Company DashBoard',
                     icon:'pi pi-fw pi-home',
                     command:()=>{
                         history.push('/CompanyDashBoard')
                     }
                 }

             ]
         },
         {
             label:'Quit',
             icon:'pi pi-fw pi-power-off',
             command:(event)=>{logoutHandler()}
         }
     ]





         return (
             <>

                     <div  className="card sidebar" >
                         <PanelMenu model={adminItems} style={{ width: '299px' }}/>
                     </div>

             </>
         )


 }