import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'

const Profile = () => {
    const history = useHistory()
    const [mypost, setMypost] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const user = JSON.parse(localStorage.getItem("user"))
    const [privacy, Setprivacy] = useState(user.privacy == "private" ? true : false)
    useEffect(() => {

        fetch('/mypost', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                setMypost(result.mypost)
            })
    }, [])
    const UpdateProfile = () => {
        history.push('/UpdateProfile')
    }
    const DeleteProfile = () => {
        fetch('/deleteProfile', {
            method: 'get',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(data => {
                localStorage.setItem("user", JSON.stringify(data))
                dispatch({ type: "UpdateProfile", payload: data.photo })

            })

    }

    const Pushtouserpost = (userid) => {
        history.push(`/userposts/${userid}`)
    }
    const ChangePrivacyPublic = () => {
        fetch('/changeprivacypublic', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                if (result.message) {
                    M.toast({ html: result.message, classes: "#388e3c green darken-2" })
                    Setprivacy(false)
                }
                else {
                    M.toast({ html: "Something went wrong Try again Later", classes: "#388e3c green darken-2" })
                }
            })
    }
    const ChangePrivacyPrivate = () => {
        fetch('/changeprivacyprivate', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                if (result.message) {
                    M.toast({ html: result.message, classes: "#388e3c green darken-2" })
                    Setprivacy(true)
                }
                else {
                    M.toast({ html: "Something went wrong Try again Later", classes: "#388e3c green darken-2" })
                }
            })
    }
    return (
        <div style={{
            maxWidth: '550px',
            margin: '0px auto'
        }}>
            <div style={{
                display: 'flex',

                margin: "20px auto",
                borderBottom: '2px solid grey',
            }}>
                <div style={{ position: "relative" }}>
                    <img style={{ width: "140px", height: "140px", borderRadius: "50%", border: "5px solid green" }}
                        src={state ? state.photo : "https://res.cloudinary.com/sahil-projects/image/upload/v1610541797/nouser_boaixh.jpg"}
                        alt="" />
                    {
                        state && state.photo == "https://res.cloudinary.com/sahil-projects/image/upload/v1610541797/nouser_boaixh.jpg"
                            ?
                            <i className="material-icons" style={{ position: 'absolute', color: 'green', bottom: '40px', right: '20px', cursor: "pointer" }}
                                onClick={() => { UpdateProfile() }}
                            >camera_alt</i>
                            :
                            <i className="material-icons" style={{ position: 'absolute', color: 'black', bottom: '40px', right: '20px', cursor: "pointer" }}

                                onClick={() => { DeleteProfile() }}
                            >delete</i>
                    }
                </div>
                <div className="Profile">
                    <div className="Profileinside"  >
                        <h4>{state ? state.name : "loading"}</h4>
                        {
                            privacy
                                ?
                                <button style={{ position: "relative", top: "20px", left: "10px" }} class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => ChangePrivacyPublic()}>Public </button>
                                :
                                <button style={{ position: "relative", top: "20px", left: "10px" }} class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => ChangePrivacyPrivate()}>private </button>
                        }
                    </div>
                    <h5>{state ? state.email : "loading"}</h5>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        width: '110%'
                    }}>
                        <h6>{mypost.length} posts</h6>
                        <h6>{state && state.followers ? state.followers.length : "0"} followers</h6>
                        <h6>{state && state.following ? state.following.length : "0"} following</h6>
                    </div>
                </div>
            </div>
            <div className="Gallery">
                {
                    mypost.map(items => {
                        return (
                            <img onClick={() => Pushtouserpost(items.postedBy._id)} style={{ width: '150px', height: '200px' }} className="items" keys={items._id} src={items.photo} />
                        )
                    })

                }
            </div>
        </div>
    )
}

export default Profile