import React, { Component } from "react"
import "./LoginButton.css"


class LoginButton extends Component {
    constructor() {
        super()
        this.hadleClick = this.hadleClick.bind(this)
    }

    hadleClick() {


    }



    render() {
        const STYLES = [
            'btn--primary',
            'btn--outline'
        ]

        const SIZES =
            [
                'btn--medium',
                'btn--large'
            ]

        const checkButtonStyle = STYLES[0]

        const checkButtonSize = SIZES[0]

        return (
            <div>
                <button onClick={this.hadleClick}>
                    Log In
            </button>
            </div>

        )

    }

}

export default LoginButton;