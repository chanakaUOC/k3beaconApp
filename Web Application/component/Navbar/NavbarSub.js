import React, { Component } from "react";
import "./Navbar.css"


class Navbar extends Component{


    render() {
        return(
            <nav className="NavbarItems" style={{color:"white",textAlign:"left",paddingLeft:'10px'}}>
                {this.props.pagetitle}
                <h1 className="navbar-logo"/>
                <i className="fab fa-bin"></i>                   
            </nav>
        )
    }
}

export default Navbar

