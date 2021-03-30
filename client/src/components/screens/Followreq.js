import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../../App'

function Followreq() {
    const [data, Setdata] = useState()
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    useEffect(() => {
        fetch('/followreq', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                Setdata(result)
            })
    }, [data])
    const Followuser = (userid) => {
        fetch('/follow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followid: userid
            })
        }).then(res => res.json())
            .then(data => {
                fetch('/reject', {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                    },
                    body: JSON.stringify({
                        followid: userid
                    })
                })
                dispatch({ type: "Updatefollower", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                history.push(`/profile/${userid}`)
            })

    }
    const Unfollowrequser = (userid) => {
        fetch('/reject', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followid: userid
            })
        }).then(userdata => {
            dispatch({ type: "Updatefollower", payload: { following: userdata.following, followers: userdata.followers } })
            localStorage.setItem("user", JSON.stringify(userdata))
            //    history.push('/')
            const newdata = data.map(items => {
                if (items._id != userdata._id) {
                    return items
                }
            })
            Setdata(newdata)
        })
    }

    return (
        <div>
            {
                data
                    ?
                    data.map(items => {
                        return (
                            <div className="Followreq">
                                <div style={{ display: "flex", margin: "20px" }}>
                                    <img style={{ width: '50px', height: '50px', borderRadius: '50%' }} src={items.photo} />
                                    <h5 style={{ height: "50px", margin: '10px 20px' }}>{items.name}<br />requested to follow you</h5>
                                </div>
                                <div>
                                    <button class="btn waves-effect waves-light #1e88e5 blue darken-1" style={{ marginRight: "10px" }}
                                        onClick={() => Followuser(items._id)}
                                    >Accept</button>
                                    <button class="btn waves-effect waves-light #1e88e5 blue darken-1"
                                        onClick={() => Unfollowrequser(items._id)}
                                    >Reject</button>
                                </div>
                            </div>

                        )
                    })
                    :
                    "loading"
            }
        </div>
    )
}

export default Followreq
