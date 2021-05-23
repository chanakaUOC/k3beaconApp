import React, { Component, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios'
import { ApiList } from '../../backend-data/apilink'
import AddNotification from './notification-component/AddNotification'
import Navbar from "../../component/Navbar/NavbarNotificationConfig"
import { Link } from "react-router-dom"
class Notification extends Component {

    constructor(props) {
        super(props)
        this.state = {
            masterdata: []
        }
    }
    componentWillMount() {
        // console.log('will?')
        this.getMasterDataList();
    }


    getMasterDataList() {


        axios.post(ApiList.notification_mb_user_list, {
            user_id: 1
        })
            .then((response) => {

                console.log("master response",response);
                this.setState({ masterdata: response.data.data }, () => {
                    console.log(this.state)
                })
            }, (error) => {
                console.log(error);
            });

    }

    removeItem(inactive_Insurer) {
        axios.post(ApiList.notification_delete, inactive_Insurer)
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
        const InactiveInsurer = { pr_key: key, user_id: 1 }
        console.log(InactiveInsurer);
        this.removeItem(InactiveInsurer);
    }

    render() {
        const master_page_name='Notification';


        const statusBodyTemplate = (rowData) => {
            return (
                <div>
                    <Link to={`/${master_page_name.toLowerCase()}/mobile-user/edit/${rowData.mb_user_id}`}>Notification</Link>
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
                                <Column field="first_name" style={{ width: '40em' }}  header="First Name" filter={true}></Column>
                                <Column field="last_name" style={{ width: '40em' }}  header="Last Name" filter={true}></Column>
                                <Column field="login_id" style={{ width: '80em' }}  header="Student/Staff Id" filter={true}></Column>
                                 <Column field="department_name" style={{ width: '80em' }}  header="Department" filter={true}></Column>
                                <Column field="mac_address" style={{ width: '80em' }}  header="Unique Id" filter={true}></Column>
                                <Column field="user_type" style={{ width: '20em' }}  header="User Type" filter={true}></Column>
                                <Column header=" View"style={{ width: '2em', display: "none" }} body={statusBodyTemplateView}></Column>
                                <Column header=" Notification " style={{ width: '10em' }}  body={statusBodyTemplate}></Column>
                                <Column header=" Delete " style={{ width: '10em', display: "none" }}  body={statusBodyTemplateDelete}></Column>

                            </DataTable>
                        </div>
                        </div>
                    </ul></div>




            </div>

        )
    }
}

export default Notification