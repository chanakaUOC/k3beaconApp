import React from "react"
import Navbar from "../../component/Navbar/Navbar"
import './App.css';
import CompanyLogoAddress from '../../images/logo.png'
import DashBoard from '../../component/dashboard/DashboardNotificationCount'

const MainPage = () => {

  return (<div className="App">
    <Navbar />

    <h1></h1>
    <div className="css_masterpage">
      <div className="css_main_slogo" style={{width:'300px',fontSize:'24px',position:"absolute",top:'15%',left:'20px'}}>
      
        Using Bluetooth Low Energy Beacon Technology in Higher Education Institutions to Boost Location-based Information Sharing
        
      </div>
      <center>
        <img src={CompanyLogoAddress} alt="Logo" />
      </center>
    
    
      <div className="css_main_slogo" style={{width:'300px',fontSize:'24px',position:"absolute",top:'15%',left:'70%'}}>
      <DashBoard></DashBoard>
      </div>
    </div>
  </div>
  );

}
export default MainPage;
