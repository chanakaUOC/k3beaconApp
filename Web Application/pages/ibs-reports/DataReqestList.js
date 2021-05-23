import React, { Component, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios'
import { ApiList } from '../../backend-data/apilink'
import Navbar from "../../component/Navbar/NavbarReport"
import { Link } from "react-router-dom"

class EventUser extends Component {

    constructor(props) {
        super(props)
        this.state = {
            masterdata: [],event_stat_data:[]
        }
    }
    componentWillMount() {
        // console.log('will?')
        this.getMasterDataList();
    }


    getMasterDataList() {
let p_event_id=this.props.match.params.id;

        axios.post(ApiList.eval_rep_request, {
            user_id: 1,event_id:p_event_id
        })
            .then((response) => {

                console.log("master response",response);
                this.setState({ masterdata: response.data.data,event_stat_data:response.data.eventstat }, () => {
                    console.log(this.state)
                })
            }, (error) => {
                console.log(error);
            });

    }

    removeItem(inactive_EventUser) {
        axios.post(ApiList.notification_delete, inactive_EventUser)
            .then((response) => {
                if (response.data.data != undefined) {
                    console.log("update return value", response.data);
                    this.getMasterDataList();
                } else {
                    this.setState({
                        validate_message: response.data.error
                    })
                }
            }, (error) => {
                console.log('error', error);
            });
    }

    removeToCollection(key) {
        const InactiveEventUser = { pr_key: key, user_id: 1 }
        console.log(InactiveEventUser);
        this.removeItem(InactiveEventUser);
    }

    render() {
        const master_page_name='EventUser';


        const statusBodyTemplate = (rowData) => {
            return (
                <div>
                    <Link to={`/${master_page_name.toLowerCase()}/mobile-user/edit/${rowData.mb_user_id}`}>EventUser</Link>
                </div>);
        }

        const statusBodyTemplateView = (rowData) => {
            return (
                <div>
                    <Link to={`/${master_page_name.toLowerCase()}/details/${rowData.mb_user_id}`}>View</Link>
                </div>);
        }

        const statusBodyTemplateDelete = (rowData) => {
            return (
                <div>
                    <Link onClick={() => { if (window.confirm('Delete the item?')) { this.removeToCollection(rowData.mb_user_id, this) }; }}>Delete</Link>

                </div>);
        }

      

        const list_table_source = this.state.masterdata;



        return (
            <div>
                <Navbar></Navbar>
                        <div className="container">  
           
                </div>


                <div className="container">
                    <ul>
                        <div className="ig-table-container">
                        <div className="card">
                            <DataTable value={list_table_source}>

                                <Column field="mb_user_id" style={{ width: '2em', display: "none" }} header="mb_user_id" filter={true}></Column>
                                <Column field="first_name" style={{ width: '40em',paddingLeft:'10px' }}  header="First Name" filter={true}></Column>
                                <Column field="beacon_id" style={{ width: '40em' }}  header="Beacon" filter={true}></Column>
                                <Column field="location_name" style={{ width: '80em' ,textAlign:'center'}}  header=" Location" filter={true}></Column>
                                <Column field="notification_text" style={{ width: '80em' ,textAlign:'center'}}  header=" Notification" filter={true}></Column>
                                <Column field="Distance" style={{ width: '80em' ,textAlign:'center'}}  header=" Distance" filter={true}></Column>
                                <Column field="record_date_time" style={{ width: '80em' ,textAlign:'center'}}  header="Request Datetime" filter={true}></Column>
                                                
                                <Column header=" View"style={{ width: '2em', display: "none" }} body={statusBodyTemplateView}></Column>
                                <Column header=" Delete " style={{ width: '10em', display: "none" }}  body={statusBodyTemplateDelete}></Column>

                            </DataTable>
                        </div>
                        </div>
                    </ul></div>




            </div>

        )
    }
}

export default EventUser