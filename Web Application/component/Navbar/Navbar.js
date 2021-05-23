import React, { Component } from "react";
import { MenuItems } from "./MenuItems"
import "./Navbar.css"
import Logfun from "./Logfun";
import { SystemDetails } from "../../appconfig/Paramter"


class Navbar extends Component {

    state = { clicked: false }

    handleClick = () => {

        this.setState({ clicked: !this.state.clicked })
    }

    handleClickLogin = () => {
        Logfun();

    }

    componentDidMount() {
        document.title = SystemDetails.ApplicationName

    }

    render() {

        const IsUserLogIn = (localStorage.getItem("token") ? true : false);



        return (
            <nav className="NavbarItems">
                <h4 className="navbar-logo"> {SystemDetails.ApplicationName}
                    <i class="fas fa-laptop-house"></i>
                </h4>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map((item, index) => {

                        if (IsUserLogIn)
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

