import React, { Component, useState } from "react"
import axios from "axios"
import {Link } from "react-router-dom"
import { ApiList } from "../../../backend-data/apilink"
import Navbar from "../../../component/Navbar/NavbarMasterData"
class AddInsurer extends Component {


    constructor(props) {
        super(props)
        this.state = { location_name: '', validate_message: '' }
        this.onChange = this.onChange.bind(this);

    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            validate_message: (e.target.value.length > 0 ? '' : '*')
        })

    }

    addInsurer(newInsurer,e) {
               axios.post(ApiList.pd_location_update, newInsurer)
            .then((response) => {   
                
     
                if(response.data.data!=undefined){
                 //   this.props.onListChange();
                //    e.target.reset();
                console.log("update return value",response.data);
            this.props.history.push('/master-data/location');
            
            }else{
                this.setState({                   
                    validate_message:response.data.error
                })
            }


            }, (error) => {
                console.log('error',error);
            });



    }

    componentWillMount() {
        this.getInsurerList();
    }


    getInsurerList() {
        let i_id = this.props.match.params.id;
        axios.post(ApiList.pd_location_data_by_id, {
            user_id: 1,
            location_id: i_id
        })
            .then((response) => {
                this.setState({ location_name: response.data.data[0].location_name }, () => {
                    console.log(this.state)
                })
            }, (error) => {
                console.log(error);
            });

    }

    onSubmit(e) {

        let location_name = this.refs.location_name.value
        if (location_name.length > 0) {
            const newInsurer = {location_id :this.props.match.params.id, location: location_name, user_id: 1 }
            this.addInsurer(newInsurer,e);
          
        }
        else {
            this.setState({
              
                validate_message:  '*'
            })

        }


        e.preventDefault();

    }


    render() {


        return (
            <div>
                             <Navbar></Navbar>
                <h1>Edit location</h1>
                <form onSubmit={this.onSubmit.bind(this)}>
                <li className="list-group-item">
                    <div className="container">
                    <div className="row">
                                <div className="master-data-page-tittle"> <span>Edit location Data</span></div>
                            </div>
                            <div className="master-data-page-body">
                                <div className="row">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td> <label ></label></td>
                                                <td> <label >Insurer Name</label></td>
                                                <td>          <input type="text" value={this.state.location_name} onChange={this.onChange} name="location_name" ref="location_name" id="txt_location_name"></input>

                                                </td>
                                                <td>  
                                                <button type="submit" value="save" className="btn btn-info">Update</button>
                                                      </td>
                                                <td> <label ></label></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>    <div className="row">
                                    <div col="col">
                                        <spa>{this.state.validate_message}</spa>
                                    </div>

                                </div>
                            </div>





                  
                    </div>
                    </li>
                </form>
            </div>
        )

    }



}

export default AddInsurer