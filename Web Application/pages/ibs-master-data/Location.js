import React, { Component, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios'
import { ApiList } from '../../backend-data/apilink'
import AddLocation from './Location-component/AddLocation'
import Navbar from "../../component/Navbar/NavbarMasterData"
import { Link } from "react-router-dom"
class Location extends Component {

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


        axios.post(ApiList.pd_Location_data, {
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
        axios.post(ApiList.pd_Location_delete, inactive_Insurer)
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
        const master_page_name='Location';


        const statusBodyTemplate = (rowData) => {
            return (
                <div>
                    <Link to={`/${master_page_name.toLowerCase()}/edit/${rowData.location_id}`}>Edit</Link>
                </div>);
        }

        const statusBodyTemplateView = (rowData) => {
            return (
                <div>
                    <Link to={`/${master_page_name.toLowerCase()}/details/${rowData.location_id}`}>View</Link>
                </div>);
        }

        const statusBodyTemplateDelete = (rowData) => {
            return (
                <div>
                    <Link onClick={() => { if (window.confirm('Delete the item?')) { this.removeToCollection(rowData.location_id, this) }; }}>Delete</Link>

                </div>);
        }

      

        const list_table_source = this.state.masterdata;



        return (
            <div>
                <Navbar></Navbar>
                        <div className="container">

                    <AddLocation  master_page_tittle={master_page_name}  onListChange={this.getMasterDataList.bind(this)}></AddLocation>
                </div>


                <div className="container css_datatable">
                    <ul>
                        <div className="ig-table-container master-data-page-body">
                        <div className="card">
                            <DataTable value={list_table_source} >

                                <Column field="location_id" style={{ width: '2em', display: "none" }} header="Policy Ref No" filter={true}></Column>
                                <Column field="location_name" style={{ width: '40em',paddingLeft:'15px',paddingTop:'10px' }}  header="Location" filter={true}></Column>

                                <Column header=" View"style={{ width: '2em', display: "none" }} body={statusBodyTemplateView}></Column>
                                <Column header=" Edit " style={{ width: '10em' ,paddingLeft:'15px',paddingTop:'10px' }}  body={statusBodyTemplate}></Column>
                                <Column header=" Delete " style={{ width: '10em' ,paddingLeft:'15px',paddingTop:'10px' }}  body={statusBodyTemplateDelete}></Column>

                            </DataTable>
                        </div>
                        </div>
                    </ul></div>




            </div>

        )
    }
}

export default Location