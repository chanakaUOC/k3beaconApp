import React, { Component } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"

import MainPage from "./pages/ibs-main";
import Loginscreen from './pages/ibs-login/LoginJsx'
import MasterPageControl from "./pages/ibs-main/MasterPageControl";
import Location from "./pages/ibs-master-data/Location"
import Event from "./pages/ibs-master-data/Event"
import LocationEdit from "./pages/ibs-master-data/Location-component/EditLocation"
import NotificationHome from "./pages/ibs-master-data/Notification"
import NotificationEdit from "./pages/ibs-master-data/notification-component/EditNotification"
import NotificationMbuHome from "./pages/ibs-master-data/Notification-Mobile-User"
import NotificationMobileUserList from "./pages/ibs-master-data/mobile-user-component/Mobile-User-Notification-List"
import EventUserList from "./pages/ibs-master-data/event-component/EventUserList"
import Beacon from "./pages/ibs-master-data/Beacon"
import BeaconLocation from "./pages/ibs-master-data/beacon-component/BeaconLocationAdd"
import MainReport from "./pages/ibs-reports/MainReport"
import NotificationDelivery from "./pages/ibs-reports/NotificationDelivery"
import UserRequestList from "./pages/ibs-reports/DataReqestList"

class App extends Component {
  render() {
    return (
      <Router> 
        <Route exact path="/" component={MainPage} />
        <Route exact path="/login" component={Loginscreen} />     
        <Route exact path="/master-data" component={MasterPageControl} />  
        <Route exact path="/master-data/location" component={Location} />  
        <Route exact path="/location/edit/:id" component={LocationEdit} />  
        <Route exact path="/master-data/event" component={Event} />  
        <Route exact path="/notification/manage" component={NotificationHome} />  
        <Route exact path="/notification/edit/:id" component={NotificationEdit} />  
        <Route exact path="/notification/manage/mobileuser" component={NotificationMbuHome} />  
        <Route exact path="/notification/mobile-user/edit/:id" component={NotificationMobileUserList} />
        <Route exact path="/event/details/:id" component={EventUserList} />
        <Route exact path="/master-data/beacon" component={Beacon} />
        <Route exact path="/beacon/assign-location/:id" component={BeaconLocation} />
        <Route exact path="/report" component={MainReport} />
        <Route exact path="/report/notification-delivery" component={NotificationDelivery} />
        <Route exact path="/report/user-request" component={UserRequestList} /> 
      </Router>
    )
  }
}
export default App;
