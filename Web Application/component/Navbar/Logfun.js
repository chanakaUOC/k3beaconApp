import React from "react"
import { useHistory } from 'react-router-dom';


const STYLES = [
  'btn--primary',
  'btn--outline'
]

const SIZES =
  [
    'btn--medium',
    'btn--large'
  ]
function Logfun() {
  let history = useHistory();

  const redirect = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token")
      history.push('/')
    } else {
      history.push('/login')

    }


  }

  return (
    <div className="nav-bar-login-button">
      <button
        className="btn btn-info login-navbar-button"
        style={{ fontSize: "medium", backgroundColor: "#F1C40F", color: "black", width: "100px" }}
        onClick={redirect}>{localStorage.getItem("token") ? 'Logout' : 'Log In'}</button>
    </div>
  )
}

export default Logfun;