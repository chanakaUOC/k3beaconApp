import React, { Component, useState } from "react"
import axios from "axios"
import { ApiList } from "../../../backend-data/apilink"
import ComboboxV1 from "../../../component/combobox/ComboboxV1"


const userType = [
    { value: '0', label: 'All' },
    { value: '1', label: 'Student' },
    { value: '2', label: 'Staff' },
    { value: '3', label: 'Visitor' }
]

const distanceMetrix = [
    { value: '2', label: '2m' },
    { value: '4', label: '4m' },
    { value: '10', label: '10m' }
]


class AddNotification extends Component {


    constructor(props) {
        super(props)
        this.state = {
            notification_text: '', location_id: '', validate_message: '',program_id:0,user_type:0,event_id:0,distance_metrix:0,
            locationData: [],
            programData: [],
            departmentData: [],
            eventData: []
        }

        this.onChange = this.onChange.bind(this);

    }

    componentWillMount() {
        this.getMasterData();
    }

    getMasterData() {
        axios.post(ApiList.notification_meta_data, {
            user_id: 1
        })
            .then((response) => {
                this.setState({
                    locationData: response.data.locationData,
                    programData: response.data.programData,
                    departmentData: response.data.departmentData,
                    eventData: response.data.eventData

                }, () => {
                    console.log(this.state)
                })
            }, (error) => {
                console.log(error);
            });
    }

    onChange(e, val) {

        if (e.target != null && e.target.name) {
            this.setState({
                [e.target.name]: e.target.value,
                validate_message: (e.target.value.length > 0 ? '' : '*'),
                user_id: 1
            })
        } else {
            //   this.calculateCommissionBrakeDown(e,val)
            this.setState({
                [val]: e, validate_message: (val.length > 0 ? '' : '*'),
                user_id: 1
            })
        }
        console.log(this.state);



    }

    addInsurer(newInsurer, e) {
        axios.post(ApiList.notification_add, newInsurer)
            .then((response) => {


                if (response.data.data != undefined) {
                    this.setState({   notification_text: '', location_id: 0, validate_message: '',program_id:0,user_type:0,event_id:0,distance_metrix:0});
                    this.props.onListChange();
                    e.target.reset();

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

        console.log(this.state.location_id);
        console.log(this.state.notification_text.length);
        if (this.state.location_id > 0 && this.state.notification_text.length > 0) {
            const newInsurer = this.state;

            this.addInsurer(newInsurer, e);

        }
        else {
            this.setState({

                validate_message: 'Please fill reqired fields!'
            })

        }


        e.preventDefault();

    }


    render() {



        const statusBodyTemplate = () => {
            return (
                <div>
                    My templaate
                </div>);
        }


        return (
            <div>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <li className="list-group-item">
                        <div className="container">
                            <div className="row">
                                <div className="master-data-page-tittle"> <span>Add New {this.props.master_page_tittle}</span></div>
                            </div>
                            <div className="master-data-page-body">
                                <div className="row" style={{ padding: "20px" }}>

                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><label > Notification</label></td>
                                                <td ></td>

                                                <input className="css_notification_input"
                                                    style={{ width: "350px", height: "65px" }}
                                                    type="text" onChange={this.onChange}
                                                    name="notification_text" ref="notification_text"
                                                    placeholder="Notification"
                                                    id="txt_notification_text"></input>



                                            </tr>
                                        </tbody>
                                    </table>

                                </div>



                                <div className="row">
                                    <table>
                                        <tbody>



                                            <tr>
                                                <td  > <label >Location</label></td>
                                                <td style={{ width: "350px" }}>     <ComboboxV1
                                                    hadlechangeUD={this.onChange}
                                                    ref="location_id"
                                                  
                                                    options={this.state.locationData}
                                                    selectedValue={this.state.location_id}
                                                    name="location_id"
                                                ></ComboboxV1>
                                                        </td>


                                                <td  > <label >Distance</label></td>
                                                <td style={{ width: "350px" }}>     <ComboboxV1
                                                    hadlechangeUD={this.onChange}
                                                    options={distanceMetrix}
                                                    selectedValue={this.state.distance_metrix}
                                                    name="distance_metrix"
                                                ></ComboboxV1>
                                                </td>

                                            </tr>
                                            <tr>

                                                <td  > <label >Users</label></td>
                                                <td style={{ width: "350px" }}>     <ComboboxV1
                                                    hadlechangeUD={this.onChange}
                                                    options={userType}
                                                    selectedValue={this.state.user_type}
                                                    name="user_type"
                                                ></ComboboxV1>
                                                </td>
                                                <td  > <label style={{ width: "100px" }}>{this.state.user_type == "1" ? "Program" : (this.state.user_type == "2" ? "Department" : "Event")}</label></td>
                                                <td style={{ width: "350px" }}>

                                                    {this.state.user_type == "1" ? <ComboboxV1
                                                        hadlechangeUD={this.onChange}
                                                        options={this.state.programData}
                                                        selectedValue={this.state.program_id}
                                                        name="program_id"
                                                    ></ComboboxV1> : (this.state.user_type == "2" ? <ComboboxV1
                                                        hadlechangeUD={this.onChange}
                                                        options={this.state.departmentData}
                                                        selectedValue={this.state.department_id}
                                                        name="department_id"
                                                    ></ComboboxV1> : <ComboboxV1
                                                        hadlechangeUD={this.onChange}
                                                        options={this.state.eventData}
                                                        selectedValue={this.state.event_id}
                                                        name="event_id"
                                                    ></ComboboxV1>)}
                                                </td>
                                                <td>    <button type="submit" value="save" className="btn btn-info">(+)Add</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>    <div className="row">
                                    <div col="col">
                                     {this.state.validate_message.length>0? <div className="css_message_label">{this.state.validate_message}</div>:null}  
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

export default AddNotification