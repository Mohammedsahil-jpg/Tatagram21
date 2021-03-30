import React, { useState, useContext } from 'react'
import { Link, useHistory,useParams } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'
const NewPassword = () => {
    const { dispatch } = useContext(UserContext)
    const {token} = useParams()
    const history = useHistory()
    const [password, setPassword] = useState("")
    const Postdata2 = () => {
        fetch('/new-password', {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                password,

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
            <div className="card auth-card input-field">
                <h2 className="signin-header">Instagram</h2>
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => Postdata2()}>New Password </button>
            </div>
        </div>
    )
}

export default NewPassword