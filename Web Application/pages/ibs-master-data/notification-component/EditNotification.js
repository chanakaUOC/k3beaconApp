import React, { Component, useState } from "react"
import axios from "axios"
import { ApiList } from "../../../backend-data/apilink"
import ComboboxV1 from "../../../component/combobox/ComboboxV1"
import Navbar from "../../../component/Navbar/NavbarMasterData"


class EditNotification extends Component {
    
    constructor(props) {
        super(props)
        this.state = { notification_text: '', location_id: '', validate_message: '',location_id_index:0,locationData: [] }
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
        axios.post(ApiList.notification_data_by_id, {
            user_id: 1,
            pr_key: i_id
        })
            .then((response) => {

                console.log(response.data.locationData);
                this.setState({
                    location_id: response.data.data[0].location_id,
                    notification_text: response.data.data[0].notification_text,
                    locationData:response.data.locationData,
                }, () => {
                    console.log("load data ", this.state)
                })
            }, (error) => {
                console.log(error);
            });

    }




    addItem(newItem, e) {
        axios.post(ApiList.notification_update, newItem)
            .then((response) => {


                if (response.data.data != undefined) {
                    e.target.reset();
                    console.log("update return value", response.data);
                    this.props.history.push('/notification/manage');

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

        if (this.state.location_id > 0 && this.state.notification_text.length > 0) {
            const newItem = this.state;
            console.log(newItem);
            this.addItem(newItem, e);

        }
        else {
            this.setState({

                validate_message: '*'
            })

        }


        e.preventDefault();

    }


    render() {
        let c_location_id ="Mr"
        if(this.state.location_id_index==0)
        {
            c_location_id="Mr"
        }else{

            c_location_id="Mrs"
        }
console.log("render",this.state.location_id_index)
        return (
            <div>
                <Navbar></Navbar>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <li className="list-group-item">
                        <div className="container">
                            <div className="row">
                                <div className="master-data-page-tittle"> <span>Add New {this.props.master_page_tittle}</span></div>
                            </div>
                            <div className="master-data-page-body">
                                <div className="row">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td> <label ></label></td>
                                                <td> <label > Tittle</label></td>
                                                <td>
                                             
                                                    <ComboboxV1
                                                        hadlechangeUD={this.onChange}
                                                      //  defaultIndex={(this.state.location_id=="Mr"?0:1)}   
                                                    //  defaultValue={titleData[indes]} 
                                                    selectedValue={this.state.location_id}//{this.state.location_id_index}
                                                     // defaultValue={{value:(true?"Miss":""),label:(this.state.location_id=="Mr"?"Mr":"Mrs")}}
                                                     options={this.state.locationData}

                                                        name="location_id"
                                                     
                                                    ></ComboboxV1>
                                                </td>
                                                <td> <label >Name</label></td>
                                                <td>     <input
                                                    type="text" onChange={this.onChange}
                                                    name="notification_text" ref="notification_text"
                                                    placeholder="Name"
                                                    value={this.state.notification_text}
                                                    id="txt_notification_text"></input>
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