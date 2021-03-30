import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

//we will get cors error as our react app is running in diff server
//we can install cors-npm package or get proxy from create react app nd paste it in package.json in reactapp
//to add conditions for email use regex
const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, Setimage] = useState()
    const [url, setUrl] = useState()
    // useEffect(() => {
    //     if (url) {
    //         Signin()
    //     }
    // }, [url])
    //once signin button is clicked
    // const Profilepic = () => {
    //     const data = new FormData();
    //     data.append('file', image)
    //     data.append('upload_preset', 'insta-clone')
    //     data.append('cloud_name', 'sahil-projects')
    //     fetch('https://api.cloudinary.com/v1_1/sahil-projects/image/upload', {  //taken from cloudiary
    //         method: 'post',
    //         body: data
    //     })
    //         .then(response => response.json())
    //         .then(result => {
    //             //console.log(result.url)
    //             setUrl(result.url);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });

    // }
    const PostData = () => {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            M.toast({ html: "Invalid MailId", classes: "#c62828 red darken-3" })
            return //otherwise it will show error nd start executing next
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                // pic: url,
                privacy: "private"
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    M.toast({ html: data.message, classes: "#388e3c green darken-2" })
                }
            }).catch(err => {
                console.log(err)
            })
    }
    // const PostData = () => {
    //     if (image) {
    //         Profilepic()
    //     }
    //     else {
    //         Signin()
    //     }
    // }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="signin-header">Instagram</h2>
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />
                <input
                    type="text"
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
                {/* <div class="file-field input-field">
                    <div class="btn #1e88e5 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file"
                            onChange={(e) => {
                                Setimage(e.target.files[0])
                            }}
                        />
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate" type="text" />
                    </div>
                </div> */}
                <button className="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => PostData()}>SignUp</button>
                <h5>
                    <Link to="/signin">Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup