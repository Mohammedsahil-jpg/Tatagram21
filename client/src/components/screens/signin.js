import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'
const Signin = () => {
    const { dispatch } = useContext(UserContext)
    const history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const Postdata2 = () => {
        fetch('/signin', {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,

            })

        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })

                }
                else {
                    localStorage.setItem('jwt', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user)) //we have to string it coz in localstorage we can store only strings
                    dispatch({ type: 'USER', payload: data.user })
                    M.toast({ html: "saved successfully", classes: "#388e3c green darken-2" })
                    history.push('/home')
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
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => Postdata2()}>LOg In </button>
                <h5>
                    <Link to="/resetpassword">Reset Password?</Link>
                </h5>
                <h5>
                    <Link to="/signup">Create new account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signin