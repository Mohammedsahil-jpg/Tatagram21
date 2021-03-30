import React, { useState, useContext } from 'react'
import { Link, useHistory,useParams } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'
const Emailvalidate = () => {
    const history = useHistory()
    const {emailtoken} = useParams()
    const Postdata2 = () => {
        fetch('/validation', {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailtoken
            })

        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })

                }
                else {
                    M.toast({ html: data.message, classes: "#388e3c green darken-2" })
                    history.push('/signin')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="mycard">
            <h5>Your email has been verified successfully!! Click sign up button to continue</h5>
            
            <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => Postdata2()}>Sign Up</button>
           
        </div>
    )
}

export default Emailvalidate