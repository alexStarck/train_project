import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {PdfPage} from './pages/PdfPage'
import {ImagePage} from './pages/ImagePage'
import {TrainPage} from './pages/TrainPage'
import {TasksPage} from './pages/TasksPage'
import {UserHomePage} from "./pages/UserHomePage";
import {UserDashBoard} from "./pages/UserDashBoard";
import {ReportsPage} from "./pages/ReportsPage"

export const useRoutes = (isAuthenticated) => {

   if (isAuthenticated ) {
    return (
        <Switch>
                    <Route path="/TrainPage"  component={TrainPage}/>
                    <Route path="/TasksPage"  component={TasksPage}/>
                    <Route path="/ReportsPage"  component={ReportsPage}/>
                    <Route path="/UserDashBoard" component={UserDashBoard}/>
                    <Route path="/MyHousePage" component={UserHomePage} />
                    <Redirect to="/UserDashBoard" />
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
