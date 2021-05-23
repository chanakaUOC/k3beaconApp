import React, { Component, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios'
import { ApiList } from '../../backend-data/apilink'
import AddEvent from './event-component/AddEvent'
import Navbar from "../../component/Navbar/NavbarMasterData"
import { Link } from "react-router-dom"
class Event extends Component {

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


        axios.post(ApiList.pd_event_data, {
            user_id: 1
        })
            .then((response) => {

                console.log(response.data.data);
                this.setState({ masterdata: response.data.data }, () => {
                    console.log(this.state)
                })
            }, (error) => {
                console.log(error);
            });

    }

    removeItem(inactive_Insurer) {
        axios.post(ApiList.pd_event_delete, inactive_Insurer)
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
        const master_page_name='event';


        const statusBodyTemplate = (rowData) => {
            return (
                <div>
                    <Link to={`/${master_page_name.toLowerCase()}/edit/${rowData.event_id}`}>Edit</Link>
                </div>);
        }

        const statusBodyTemplateView = (rowData) => {
            return (
                <div>
                    <Link to={`/${master_page_name.toLowerCase()}/details/${rowData.event_id}`}>Details</Link>
                </div>);
        }

        const statusBodyTemplateDelete = (rowData) => {
            return (
                <div>
                    <Link onClick={() => { if (window.confirm('Delete the item?')) { this.removeToCollection(rowData.event_id, this) }; }}>Delete</Link>

                </div>);
        }

      

        const list_table_source = this.state.masterdata;



        return (
            <div>
                <Navbar></Navbar>
                        <div className="container">

                    <AddEvent  master_page_tittle={master_page_name}  onListChange={this.getMasterDataList.bind(this)}></AddEvent>
                </div>


                <div className="container css_datatable">
                    <ul>
                        <div className="ig-table-container master-data-page-body">
                        <div className="card">
                            <DataTable value={list_table_source} >

                                <Column field="event_id" style={{ width: '2em', display: "none" }} header="Policy Ref No" filter={true}></Column>
                                <Column field="event_name" style={{ width: '40em',paddingLeft:'15px',paddingTop:'10px' }}  header="event" filter={true}></Column>

                        
                                <Column header=" Edit " style={{ width: '10em' ,paddingLeft:'15px',paddingTop:'10px' ,display:'none'}}  body={statusBodyTemplate}></Column>
                                <Column header=" Delete " style={{ width: '10em' ,paddingLeft:'15px',paddingTop:'10px' }}  body={statusBodyTemplateDelete}></Column>
                                <Column header=" Details"  style={{ width: '10em' ,paddingLeft:'15px',paddingTop:'10px' }} body={statusBodyTemplateView}></Column>

                            </DataTable>
                        </div>
                        </div>
                    </ul></div>




            </div>

        )
    }
}

export default Event