import React, { Component, useState } from "react"
import axios from "axios"
import { ApiList } from "../../../backend-data/apilink"
import ComboboxV1 from "../../../component/combobox/ComboboxV1"
import Navbar from "../../../component/Navbar/NavbarMasterData"


class EditNotification extends Component {
    
    constructor(props) {
        super(props)
        this.state = { notification_text: '', location_id: 0, validate_message: '',location_id_index:0,locationData: [] ,beacon_name:'',beacon_id:0}
        this.onChange = this.onChange.bind(this);

    }
    onChange(e, val) {
        let i_id = this.props.match.params.id;
        if (e.target != null && e.target.name) {
            this.setState({
                [e.target.name]: e.target.value,
                validate_message: (e.target.value.length > 0 ? '' : '*'),
                user_id: 1,
                pr_key: i_id
            })
        } else {
            //   this.calculateCommissionBrakeDown(e,val)
            this.setState({
                [val]: e, validate_message: (val.length > 0 ? '' : '*'),
                user_id: 1,
                pr_key: i_id
            })
        }
        console.log('onchange',this.state);



    }


    componentWillMount() {
        this.getDataById();
    }
    getDataById() {
        let i_id = this.props.match.params.id;
        axios.post(ApiList.pd_beacon_data_byid, {
            user_id: 1,
            pr_key: i_id
        })
            .then((response) => {

                console.log(response.data);
                this.setState({
                    location_id: response.data.data[0].location_id,  
                    beacon_name: response.data.data[0].beacon_name,                 
                    locationData:response.data.locationData,
                    beacon_id: i_id
                }, () => {
                    console.log("load data ", this.state)
                })
            }, (error) => {
                console.log(error);
            });

    }




    addItem(newItem, e) {
        axios.post(ApiList.pd_beacon_location_update, newItem)
            .then((response) => {


                if (response.data.data != undefined) {
                    e.target.reset();
                    console.log("update return value", response.data);
                    this.props.history.push('/master-data/beacon');

                } else {
                    this.setState({
                        validate_message: response.data.error
                    })
                }


            }, (error) => {
                console.log('error', error);
            });



    }


    onSubmit(e) {

        if (this.state.location_id > 0 ) {

            const newItemPostdata = {location_id:this.state.location_id,beacon_id:this.state.beacon_id}
          //  const newItem = this.state;
         //   console.log(newItem);
            this.addItem(newItemPostdata, e);

        }
        else {
            this.setState({

                validate_message: '*'
            })

        }


        e.preventDefault();

    }


    render() {
    
        return (
            <div>
                <Navbar></Navbar>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <li className="list-group-item">
                        <div className="container">
                            <div className="row">
                                <br/>
                                <div className="master-data-page-tittle"> <span> Assign Location {this.props.master_page_tittle}</span></div>
                                <br/>
                            </div>
                            <div className="master-data-page-body">
                                <div className="row">
                                 
                                    <table>
                                        <tbody>
                                        <tr>
                                                <td> <label ></label></td>
                                                <td> <label > Beacon Name</label></td>
                                                <td style={{width:"350px"}}>                                             
                                                {this.state.beacon_name}
                                                </td>
                                              
                                                <td>  </td>
                                                <td> <label ></label></td>
                                            </tr>
                                            <tr>
                                                <td> <label ></label></td>
                                                <td> <label > Location for beacon</label></td>
                                                <td style={{width:"350px"}}>                                             
                                                    <ComboboxV1
                                                        hadlechangeUD={this.onChange}                                                 
                                                    selectedValue={this.state.location_id}                                                
                                                     options={this.state.locationData}
                                                        name="location_id"                                                     
                                                    ></ComboboxV1>
                                                </td>
                                              
                                                <td>    <button type="submit" value="save" className="btn btn-info">Update</button></td>
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

export default EditNotification