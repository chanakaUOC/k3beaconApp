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
            notification_text: '', location_id: '', validate_message: '',user_type:0,
            mobile_user_id:0,
            locationData: [],
            programData: [],
            departmentData: [],
            eventData:[],
            mobileUserData:[]
        }

        this.onChange = this.onChange.bind(this);

    }

    componentWillMount() {
        this.getMasterData();
    }

    getMasterData() {
      let i_id = this.props.mobile_user_id;

        axios.post(ApiList.notification_meta_data, {
            user_id: 1,mobile_user_id:i_id
        })
            .then((response) => {
                this.setState({
                    mobile_user_id:i_id,
                    locationData: response.data.locationData,
                    programData: response.data.programData,
                    departmentData: response.data.departmentData,
                    eventData: response.data.eventData,
                    mobileUserData:response.data.mobileUserData

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
                mobile_user_id: this.props.mobile_user_id,
                user_id: 1
            })
        } else {
            //   this.calculateCommissionBrakeDown(e,val)
            this.setState({
                [val]: e, validate_message: (val.length > 0 ? '' : '*'),
                mobile_user_id: this.props.mobile_user_id,
                user_id: 1
            })
        }
        console.log(this.state);



    }

    addMobileNotification(newMobileNotification, e) {
        axios.post(ApiList.notification_add, newMobileNotification)
            .then((response) => {


                if (response.data.data != undefined) {
                   this.props.onListChange();
                    e.target.reset();
                //   this.props.history.push('/notification/manage/mobileuser');

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
            const newMobileNotification = this.state;

            this.addMobileNotification(newMobileNotification, e);

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
                <form onSubmit={this.onSubmit.bind(this)}>
                    <li className="list-group-item">
                        <div className="container">
                            <div className="row">
                                <div className="master-data-page-tittle"> <span>Add New {this.props.master_page_tittle}</span></div>
                            </div>
                            <div className="master-data-page-body">
                                <div className="row"  style={{ padding: "20px" }}>

                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><label > Notification</label></td>
                                                <td ></td>

                                                <input className="css_notification_input"
                                                 style={{ width: "350px",height:"65px" }}
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
                                                    options={this.state.locationData}
                                                    selectedValue={this.state.location_id}
                                                    name="location_id"
                                                ></ComboboxV1>
                                                </td>
                                          
                                             
                                                <td  > <label >Distance</label></td>
                                                <td style={{ width: "350px" }}>     <ComboboxV1
                                                    hadlechangeUD={this.onChange}
                                                    options={distanceMetrix}
                                                    name="distance_metrix"
                                                    selectedValue={this.state.distance_metrix}
                                                ></ComboboxV1>
                                                </td>
                                                <td>    <button type="submit" value="save" className="btn btn-info">(+)Add</button></td>
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
<div>


</div>

            </div>
        )

    }



}

export default AddNotification