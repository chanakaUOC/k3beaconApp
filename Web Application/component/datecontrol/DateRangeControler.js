import React, { Component, useState } from "react"
import DateTimePicker from 'react-datetime-picker';
import './datetimerange.css'

class DateRangeControler extends Component {
    constructor() {
        super()
        this.state = { rangetodate: new Date(), rangefromdate: new Date() }
        this.onChange = this.onChange.bind(this)

    }



    onChange(e, s) {
        this.setState({ s: new Date(e) })

        console.log(this.state)
        return e
    }


    render() {


        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>From</td>
                            <td >
                                <DateTimePicker amPmAriaLabel={null}
                                    name="rangefromdate"

                                    value={this.state.rangefromdate} onChange={(event, e) => this.props.hadlechangeUD(this.onChange(event, 'rangefromdate'), 'rangefromdate')}>
                                </DateTimePicker>
                            </td>
                            <td>
                                <span>To</span>
                            </td>
                            <td>   <DateTimePicker amPmAriaLabel={null} name="rangetodate" value={this.state.rangetodate}
                                onChange={(event, e) => this.props.hadlechangeUD(this.onChange(event, 'rangetodate'), 'rangetodate')}>
                            </DateTimePicker></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}



export default DateRangeControler