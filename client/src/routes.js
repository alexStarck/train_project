import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {TrainPage} from './pages/TrainPage'
import {TasksPage} from './pages/TasksPage'
import {TypeRailwayCarriage} from "./pages/TypeRailwayCarriage";
import {UserDashBoard} from "./pages/UserDashBoard";
import {ReportsPage} from "./pages/ReportsPage"

export const useRoutes = (isAuthenticated) => {

   if (isAuthenticated ) {
    return (
        <Switch>
                    <Route path="/TrainPage"  component={TrainPage}/>
                    <Route path="/TasksPage"  component={TasksPage}/>
                    <Route path="/ReportsPage"  component={ReportsPage}/>
                    <Route path="/TypeRailwayCarriage" component={TypeRailwayCarriage} />
                    <Route path="/UserDashBoard" component={UserDashBoard}/>
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
