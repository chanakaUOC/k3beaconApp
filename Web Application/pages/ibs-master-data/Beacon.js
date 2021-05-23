import React, { Component, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios'
import { ApiList } from '../../backend-data/apilink'
import Navbar from "../../component/Navbar/NavbarMasterData"
import { Link } from "react-router-dom"
class Beacon extends Component {

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


        axios.post(ApiList.pd_beacon_data, {
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

    removeItem(inactive_Beacon) {
        axios.post(ApiList.pd_Beacon_delete, inactive_Beacon)
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
        const InactiveBeacon = { pr_key: key, user_id: 1 }
        console.log(InactiveBeacon);
        this.removeItem(InactiveBeacon);
    }

    render() {
        const master_page_name='Beacon';


        const statusBodyTemplate = (rowData) => {
            return (
                <div>
                    <Link to={`/${master_page_name.toLowerCase()}/assign-location/${rowData.beacon_id}`}>Assign Location</Link>
                </div>);
        }

        const statusBodyTemplateView = (rowData) => {
            return (
                <div>
                    <Link to={`/${master_page_name.toLowerCase()}/details/${rowData.beacon_id}`}>View</Link>
                </div>);
        }

        const statusBodyTemplateDelete = (rowData) => {
            return (
                <div>
                    <Link onClick={() => { if (window.confirm('Delete the item?')) { this.removeToCollection(rowData.beacon_id, this) }; }}>Delete</Link>

                </div>);
        }

      

        const list_table_source = this.state.masterdata;



        return (
            <div>
                <Navbar></Navbar>
                        <div className="container">

           
                </div>


                <div className="container css_datatable">
                    <ul>
                        <div className="ig-table-container master-data-page-body">
                        <div className="card">
                            <DataTable value={list_table_source} >

                                <Column field="beacon_id" style={{ width: '2em', display: "none" }} header="Policy Ref No" filter={true}></Column>
                                <Column field="beacon_name" style={{ width: '30em',paddingLeft:'15px',paddingTop:'10px' }}  header="Beacon" filter={false}></Column>
                             
                                <Column field="beacon_uuid" style={{ width: '30em',paddingLeft:'15px',paddingTop:'10px' }}  header="UUID" filter={false}></Column>
                             
                                <Column field="tx_power" style={{ width: '20em',paddingLeft:'15px',paddingTop:'10px' ,textAlign:"center"}}  header="Tx Power" filter={false}></Column>
                                <Column field="location_name" style={{ width: '40em',paddingLeft:'15px',paddingTop:'10px' }}  header="Location" filter={false}></Column>
                                
                                <Column header=" View"style={{ width: '2em', display: "none" }} body={statusBodyTemplateView}></Column>
                                <Column header=" Assign Location " style={{ width: '20em' ,paddingLeft:'15px',paddingTop:'10px'}}  body={statusBodyTemplate}></Column>
                                <Column header=" Delete " style={{ width: '10em' ,paddingLeft:'15px',paddingTop:'10px', display: "none" }}  body={statusBodyTemplateDelete}></Column>

                            </DataTable>
                        </div>
                        </div>
                    </ul></div>




            </div>

        )
    }
}

export default Beacon