import React, { Component, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios'
import { ApiList } from '../../backend-data/apilink'
class DashBoardNotificationCount extends Component {

    //Notification Count information
    constructor(props) {
        super(props)
        this.state = {
            masterdata: []
        }
    }
    componentWillMount() {
        this.getMasterDataList();
    }

    //Load data
    getMasterDataList() {
        axios.post(ApiList.dash_board_total_notification, {
            user_id: 1
        })
            .then((response) => {
                this.setState({ masterdata: response.data.data }, () => {
                    console.log(this.state)
                })
            }, (error) => {
                console.log(error);
            });
    }



    render() {

        const statusBodyTemplateViewDesc = (rowData) => {
            return (
                <div className="css_dash_desc">
                    {rowData.Description}
                </div>);
        }

        const statusBodyTemplateViewVal = (rowData) => {
            return (
                <div className="css_dash_count">
                    {rowData.Count}
                </div>);
        }


        const list_table_source = this.state.masterdata;


        return (
            <div>
                <DataTable value={list_table_source}>
                    <Column header=" " body={statusBodyTemplateViewDesc}></Column>
                    <Column header=" " body={statusBodyTemplateViewVal}></Column>
                </DataTable>

            </div>
        )
    }
}

export default DashBoardNotificationCount