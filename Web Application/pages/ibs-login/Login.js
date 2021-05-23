import React, { Component } from "react"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import UploadScreen from './UploadScreen';
import "./Login.css"

class Login extends Component {

  handleClick1(event) {
    var self = this;
    const requestOptions = {
      method: 'GET',
      // headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin': 'http://localhost:3000/login' },
      // body: JSON.stringify({ title: 'React POST Request Example' })
    };
    fetch('http://localhost:3001/jigsawapi/canvas/canvas-list', requestOptions)
      .then(function(response){
        console.log(response.json())
       // if (response.data) {
          console.log("Login successfull");
          var uploadScreen = [];
          uploadScreen.push(<UploadScreen appContext={self.props.appContext} />)
         // self.props.appContext.setState({ loginPage: [], uploadScreen: uploadScreen })
    //    }
      }
        )
      .then(data => this.setState({ postId: data }));
  }

  handleClick(event) {
    let config = {
      headers: {

        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'

      }
    }
    var apiBaseUrl = "http://jigsawbanana.com/jigsawapi/canvas/";
    var self = this;
    var recipient_data = {
      "unique_id": this.state.username//,
      // "password":this.state.password
    }
    axios.post(apiBaseUrl + 'jig-panel-data', recipient_data, config)
      .then(function (response) {
        console.log(response);
        //   if(response.data.code == 200){
        if (response.data) {
          console.log("Login successfull");
          var uploadScreen = [];
          uploadScreen.push(<UploadScreen appContext={self.props.appContext} />)
          self.props.appContext.setState({ loginPage: [], uploadScreen: uploadScreen })
        }
        else if (response.data.code == 204) {
          console.log("Username password do not match");
          alert("username password do not match")
        }
        else {
          console.log("Username does not exists");
          alert("Username does not exist");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }







  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }
  render() {
    return (
      <div>
         <Helmet>
          <title>Login</title>
        </Helmet>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="Login"
            />

            <div className="logincss">
              <TextField
                hintText="Enter your Username"
                floatingLabelText="Username"
                onChange={(event, newValue) => this.setState({ username: newValue })}
              />
              <br />
              <TextField
                type="password"
                hintText="Enter your Password"
                floatingLabelText="Password"
                onChange={(event, newValue) => this.setState({ password: newValue })}
              />
              <br />
              <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick1(event)} />
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
const style = {
  margin: 15,
};
export default Login;