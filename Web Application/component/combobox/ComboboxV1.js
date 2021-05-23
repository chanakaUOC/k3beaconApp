import React, { Component } from 'react'
import Select from 'react-select'

class CustomComboBox extends Component {
    constructor() {
        super()   
    }

    render() {
         const ides=this.props.selectedValue  
        const positionindex= this.props.options.findIndex(obj => obj.value ==ides);      
        return (
       
            <Select              
                className={'rct-rct-select-container'}
                options={this.props.options}            
                onChange={(event) => this.props.hadlechangeUD(event.value,this.props.name)}
                name={this.props.name}
                value=  { (positionindex==-1) ?'':        this.props.options[ this.props.options.findIndex(obj => obj.value ==ides)]}
            ></Select>
        )

    }





}




export default CustomComboBox