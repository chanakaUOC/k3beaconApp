import React, { Component } from 'react';


class EventStat extends Component {

    constructor(props) {
        super(props)
    }



    render() {





        const user_count = this.props.user_count;
        const notification_count = this.props.notification_count;
        console.log(user_count);
        return (<div>

  
        
            <div className="col-md-4"> <div className="css_dash_count">{user_count}</div></div>
            <div className="col-md-4"> <div className="css_dash_count"> {notification_count}</div></div>
            <div className="col-md-4"></div>

                   
          
           




        </div>)
    }




}

export default EventStat