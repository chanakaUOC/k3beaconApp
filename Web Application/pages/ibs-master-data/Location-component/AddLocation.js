import React, { Component, useState } from "react"
import axios from "axios"
import { ApiList } from "../../../backend-data/apilink"

class AddLocation extends Component {


    constructor(props) {
        super(props)
        this.state = { insurer_name: '', validate_message: '' }
        this.onChange = this.onChange.bind(this);

    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            validate_message: (e.target.value.length > 0 ? '' : '*')
        })

    }

    addInsurer(newInsurer, e) {
        axios.post(ApiList.pd_location_create, newInsurer)
            .then((response) => {


                if (response.data.data != undefined) {
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

        let insurer_name = this.refs.insurer_name.value
        if (insurer_name.length > 0) {
            const newInsurer = { location_name: insurer_name, user_id: 1 }
            this.addInsurer(newInsurer, e);

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
                                <div className="row">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td> <label ></label></td>
                                                <td> <label > {this.props.master_page_tittle}</label></td>
                                                <td>     <input
                                                    type="text" onChange={this.onChange}
                                                    name="insurer_name" ref="insurer_name"
                                                    placeholder= {this.props.master_page_tittle}
                                                    autoSave={false}
                                                    id="txt_insurer_name"></input>
                                                </td>
                                                <td>    <button type="submit" value="save" className="btn btn-info">(+)Add</button></td>
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

export default AddLocation