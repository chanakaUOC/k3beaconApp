import React, { Component } from "react";
import { MenuItems } from "./MenuItemsReport"
import {SystemDetails} from "../../appconfig/Paramter"
import "./Navbar.css"
import Logfun from "./Logfun";


class Navbar extends Component{

state={clicked:false}

handleClick=()=>{

    this.setState({clicked:!this.state.clicked})
}

handleClickLogin=()=>{
Logfun();
  
}



    render() {
        return(
            <nav className="NavbarItems">
                <a href="/">
                <h4 className="navbar-logo"> {SystemDetails.ApplicationName}
                <i class="fas fa-laptop-house"></i>
                </h4>
                </a>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked?'fas fa-times':'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked?'nav-menu active':'nav-menu'}>
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={index}> 
                            <a className={item.cName} href={item.url}>
                                    {item.tittle}

                            </a>
                            </li>
                        )
                    })}
                </ul>
                <Logfun></Logfun>        
            </nav>
        )
    }
}

export default Navbar

