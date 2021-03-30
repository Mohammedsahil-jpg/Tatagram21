import React, { useState, useContext } from 'react'

import M from 'materialize-css'
import { useHistory } from 'react-router-dom'

const Resetpassword = () => {
    const [email, setEmail] = useState("")
    const history = useHistory()
    const Postdata2 = () => {
        fetch('/reset-password', {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
            })

        }).then(res => res.json())
            .then(data => {
                console.log(data)
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
            <div className="card auth-card input-field">
                <h2 className="signin-header">Instagram</h2>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                />
                <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => Postdata2()}>Email request </button>
            </div>
        </div>
    )
}

export default Resetpassword