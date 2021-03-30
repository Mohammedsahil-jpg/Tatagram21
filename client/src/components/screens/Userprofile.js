import React, { useContext, useEffect, useState } from 'react'

import { useHistory, useParams } from "react-router-dom";
import { UserContext } from '../../App';

const UserProfile = () => {
    const history = useHistory()
    const { state, dispatch } = useContext(UserContext)
    const [UserProfile, Setuserprofile] = useState(null)
    const [requser, Setrequser] = useState([])
    const { userid } = useParams();
    const [showfollow, Setfollowshow] = useState()
    console.log(UserProfile)
    useEffect(() => {

        fetch(`/user/${userid}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                Setuserprofile(result)

            })
    }, [requser])
    const Followuser = () => {
        fetch('/reqfollow', {
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
                Setrequser(data.requestuser)
                Setfollowshow(data.requestuser.request.includes(state._id) ? false : true)
            })

    }
    const Unfollowrequser = () => {
        fetch('/unreqfollow', {
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
                Setrequser(data.requestuser)
                Setfollowshow(true)
            })
    }
    const UnFollowuser = () => {
        fetch('/unfollow', {
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
                dispatch({ type: "Updatefollower", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                history.push('/mysubpost')
            })
    }

    const Pushtouserpost = () => {
        history.push(`/userposts/${userid}`)
    }
    return (
        <>
            {
                UserProfile && requser
                    ?
                    <div style={{
                        maxWidth: '550px',
                        margin: '0px auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            margin: "20px",
                            borderBottom: '2px solid grey',
                        }}>
                            {
                                UserProfile.user.privacy == "public" || UserProfile.user.followers.includes(state._id)
                                    ?
                                    <img style={{ width: "140px", height: "140px", borderRadius: "50%", marginRight: '10px' }}
                                        src={UserProfile.user.photo}
                                        alt="" />
                                    :
                                    <img style={{ width: "140px", height: "140px", borderRadius: "50%", marginRight: '10px' }}
                                        src="https://res.cloudinary.com/sahil-projects/image/upload/v1610541797/nouser_boaixh.jpg"
                                        alt="" />

                            }
                            <div className="Profile">
                                <div>
                                    <h4>{UserProfile.user.name}</h4>
                                    <h6>{UserProfile.user.email}</h6>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    width: '110%',
                                    flexWrap: "wrap",
                                    marginBottom: "10px"
                                }}>
                                    <h6>{UserProfile.posts.length} posts</h6>
                                    <h6>{UserProfile.user.followers.length} Followers</h6>
                                    <h6>{UserProfile.user.following.length} Following</h6>
                                    {
                                        state.following && state.following.includes(UserProfile.user._id)
                                            ?
                                            <div>
                                                <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => UnFollowuser()}>UNFOLLOW </button>
                                            </div>
                                            :
                                            <div className="Followbtn">
                                                {
                                                    showfollow || !UserProfile.user.request.includes(state._id)
                                                        ?
                                                        <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => Followuser()}>FOLLOW </button>
                                                        :
                                                        <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => Unfollowrequser()}>requested </button>
                                                }
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="Gallery">
                            {
                                UserProfile.user.privacy == "public" || state && state.following.includes(UserProfile.user._id)
                                    ?
                                    UserProfile.posts.map(items => {

                                        return (

                                            <img onClick={() => Pushtouserpost()} style={{ width: '150px', height: '200px' }} className="items" keys={items._id} src={items.photo} />
                                        )

                                    })
                                    :
                                    "This account is private Follow to see their posts"
                            }
                        </div>
                    </div>
                    : "loading...."
            }
        </>
    )
}

export default UserProfile