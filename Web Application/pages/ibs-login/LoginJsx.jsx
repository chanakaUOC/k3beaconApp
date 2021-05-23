import React, { Component } from "react";
import "./Login.css";
import { Redirect } from "react-router-dom";
import { ApiList } from "../../backend-data/apilink";
import { SystemDetails } from "../../appconfig/Paramter"
import 'bootstrap/dist/css/bootstrap.min.css';
import CompanyLogo from '../../images/logo.png'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      islogged: false,
      loginParams: {
        user_id: "",
        user_password: ""
      }
    };
  }
  refreshPage() {
    window.location.href = '/';

    // this.props.history.push('/policy/new-policy');
  }




  handleFormChange = event => {
    let loginParamsNew = { ...this.state.loginParams };
    let val = event.target.value;
    loginParamsNew[event.target.name] = val;
    this.setState({
      loginParams: loginParamsNew
    });
  };

  login = event => {
    let user_id = this.state.loginParams.user_id;
    let user_password_ = this.state.loginParams.user_password;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json',
      },

      body: JSON.stringify({ user: { user_id: user_id, user_password: user_password_ } })
    };
    //ApiList http://localhost:3001/jigsawapi/user-management/validate-user-credentials
    fetch(ApiList.user_validate, requestOptions)
      .then(response => response.json())
      .then(data => {
        //  console.log('Token', data)
        //  console.log('Token', data.data[0].Token_Id)
        let Tk = data.data[0].Token_Id
        if (Tk != '') {
          localStorage.setItem("token", Tk)
          this.refreshPage();

        }
        this.render();

      }

      );

    event.preventDefault();
  };
  render() {


    if (localStorage.getItem("token")) {
      console.log('rendering.....')
      return <Redirect to="/" />;
    }
    return (
      <div className="css_login_bg">
      <div className="container container-mlog">
        <form onSubmit={this.login} className="form-signin">
          <h1 className="h3 mb-3 font-weight-normal"></h1>
          <div style={{ textAlign: "center", fontSize: "18px" }} className="login-title">{SystemDetails.ApplicationName} </div>
          <div className="css_login_container">
            <div className="row">

              <img src={CompanyLogo} style={{ width: "250px", height: "250px" }} alt="Logo" />
              <div className="list-data">
                <input
                  type="text"
                  className="login-input"
                  name="user_id"
                  onChange={this.handleFormChange}
                  placeholder="Enter Username"
                />
              </div>
            </div>
            <div className="row">
              <div className="list-data">
                <input
                  className="login-input"
                  type="password"
                  name="user_password"
                  onChange={this.handleFormChange}
                  placeholder="Enter Password"
                />
              </div>
            </div>
            <div className="row">
              <div className="list-data">
                <input type="submit" value="Login" className="btn btn-info login-input" />

              </div>
            </div>
          </div>
        </form>
      </div>
      </div>
    );
  }
}
export default Login;