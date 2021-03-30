import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { Link, useHistory } from 'react-router-dom'

const Home = () => {
    const history = useHistory()
    const { state, dispatch } = useContext(UserContext)
    const [data, setData] = useState([])
    const [sure, Setsure] = useState(false)
    const [userstory, Setuserstory] = useState('https://res.cloudinary.com/sahil-projects/image/upload/v1610541797/nouser_boaixh.jpg')
    const [comment, setComment] = useState("")
    const [like, setlike] = useState(false)
    const [inputvalue, setinputvalue] = useState("")
    useEffect(() => {
        fetch('/allpost', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                setData(result.posts)
            })
        fetch('/userdata', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("user", JSON.stringify(data))
                dispatch({ type: "Update", payload: { request: data.request } })
            })
        fetch('/getStory', {
            method: 'get',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(mystory => {
                Setuserstory(mystory.story)

            })

    }, [])
    const Likepost = (id) => {
        setlike(true)
        fetch('/like', {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //result.likes = Array.from(new Set(result.likes.map(item=>item)))
                const newData = data.map(items => {
                    if (items._id == result._id) {
                        return result
                    } else {
                        return items
                    }
                })
                setData(newData)
                setlike(false)
            }).catch(err => {
                console.log(err)
            })
    }
    const Unlikepost = (id) => {
        setlike(false)
        fetch('/unlike', {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(items => {
                    if (items._id == result._id) {
                        return result
                    } else {
                        return items
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const Comment = (id) => {
       
        if(comment !== ""){
        fetch('/comments', {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                text: comment,
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(items => {
                    if (items._id == result._id) {

                        return result
                    } else {
                        return items
                    }
                })
                setData(newData)
               setComment("")
               setinputvalue("")
            }).catch(err => {
                console.log(err)
            })
    }
}
    const Deletepost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.filter(items => {
                    return items._id !== result._id
                })
                setData(newData)
            })

            .catch(err => {
                console.log(err)
            })

    }

    const Decomment = (id, commentid) => {
        fetch('/decomments', {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id,
                commentId: commentid
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(items => {
                    if (items._id == result._id) {
                        return result
                    } else {
                        return items
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const Suredelete = () => {

        sure ? Setsure(false) : Setsure(true)

    }
    const Dontdelete = () => {

        sure ? Setsure(false) : Setsure(true)

    }

    const UploadStory = () => {
        history.push('/story')
    }

    const Changeview = (userid) => {
        history.push(`/viewstory/${userid}`)
    }
    return (

        <div className="home">
            <div className="storybackground">
                {
                    userstory
                        ?
                        <img onClick={() => Changeview(state._id)} className="story"
                            src={userstory} />
                        :
                        <img onClick={() => Changeview(state._id)} className="story"
                            src={"https://res.cloudinary.com/sahil-projects/image/upload/v1610541797/nouser_boaixh.jpg"}
                        />
                }
                <i className="material-icons" style={{ position: 'absolute', color: 'green', bottom: '50px', right: '0px', cursor: "pointer" }}
                    onClick={() => { UploadStory() }}
                >camera_alt</i>

            </div>
            <hr style={{ margin: '50px' }}></hr>
            {
                data.map(items => {

                    return (
                        <>
                            {
                                items.privacy == "public"
                                    ?
                                    <div className="card home-card">
                                        <div style={{ display: 'flex' }}>

                                            <img style={{ width: '50px', height: '50px', borderRadius: '50%' }} src={items.Userprofile} />
                                            <h5 style={{ height: "50px", margin: '10px' }}><Link to={items.postedBy._id !== state._id ? `/profile/${items.postedBy._id}` : "/profile"}>{items.postedBy.name}</Link>
                                                {
                                                    items.postedBy._id == state._id
                                                        ?
                                                        <Link to={`/edit/${items._id}`}><i className="material-icons" style={{ marginLeft: "7px", float: "right", cursor: "pointer" }}>create</i></Link>
                                                        :
                                                        ""
                                                }

                                                {items.postedBy._id === state._id
                                                    && <i style={{ position: 'absolute', right: '0', top: '10px', cursor: 'pointer', display: 'flex', margin: '10px' }} className="material-icons"
                                                        onClick={() => { Suredelete() }} >delete
                          {
                                                            sure
                                                                ?
                                                                <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => Deletepost(items._id)}>Confirm</button>
                                                                :
                                                                ""
                                                        }
                                                        {
                                                            sure
                                                                ?
                                                                <button style={{ marginLeft: '5px' }} class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => Dontdelete()}>Cancel</button>
                                                                :
                                                                ""
                                                        }

                                                    </i>

                                                }

                                            </h5>
                                        </div>
                                        <div className='card-image'>
                                            <img
                                                src={items.photo}
                                            />
                                        </div>
                                        <div className='card-content' >
                                            <i className="material-icons" style={{ color: 'red' }}>favorite</i>
                                            {items.likes.includes(state._id) || like
                                                ?
                                                <i className="material-icons" style={{ cursor: "pointer" }} onClick={() => { Unlikepost(items._id) }}>thumb_down</i>
                                                :
                                                <i className="material-icons" style={{ cursor: "pointer" }} onClick={() => { Likepost(items._id) }}>thumb_up</i>
                                            }
                                            <h5>{items.likes.length} likes</h5>
                                            <h5>{items.title}</h5>
                                            <p>{items.body}</p>
                                            <div className="comments">
                                                {
                                                    items.comments.map(record => {
                                                        if (record.text != "" && record.postedBy._id == state._id) {
                                                            return (
                                                                <h6><i style={{ float: 'left', cursor: 'pointer' }} className="material-icons" onClick={() => { Decomment(items._id, record._id) }}>delete</i><span>{record.postedBy.name} </span>-- {record.text}</h6>
                                                            )
                                                        } else if (record.text != "") {
                                                            return (
                                                                <h6><span>{record.postedBy.name} </span>-- {record.text}</h6>
                                                            )
                                                        }

                                                    })
                                                }
                                            </div>

                                            <div style={{ display: 'flex' }}>

                                                <input
                                                    type="text"
                                                    placeholder="add a comment"
                                                    value={inputvalue}
                                                    onChange={(e) => { setComment(e.target.value) }}
                                                    onClick={() => { setinputvalue() }}
                                                />
                                                <i style={{ cursor: 'pointer' }} class="material-icons" onClick={() => { Comment(items._id) }}>send</i>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    ""
                            }
                        </>
                    )
                })

            }
        </div>

    )
}

export default Home