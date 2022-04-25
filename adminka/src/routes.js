import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {UserHomePage} from "./pages/UserHomePage";

import {AdminDashBoard} from "./pages/AdminDashBoard";
import {CompanyDashBoard} from "./pages/CompanyDashBoard";

export const useRoutes = (isAuthenticated) => {


   if (isAuthenticated ) {
    return (
        <Switch>
                    <Route path="/CompanyDashBoard"  >
                        <CompanyDashBoard />
                    </Route>
                    <Route path="/AdminDashBoard"  >
                            <AdminDashBoard />
                    </Route>

                    <Route path="/MyHousePage" component={UserHomePage} />
                    <Redirect to="/MyHousePage" />
        </Switch>
    )
  }else{
       return (
           <Switch>
               <Route path="/" exact  component={AuthPage}/>
               <Redirect to="/" />
           </Switch>
       )
   }




}
