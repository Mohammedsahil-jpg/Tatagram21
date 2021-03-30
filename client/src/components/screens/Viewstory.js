import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'
import { UserContext } from '../../App'

function Viewstory() {
    const history = useHistory()
    const { userid } = useParams()
    const [story, setstory] = useState("")
    const [storylength, setstorylength] = useState()
    const [current, setcurrent] = useState(0)
    const { state } = useContext(UserContext)
    const [sure, Setsure] = useState(false)
    const [deleteStory, setdeletestory] = useState("")
    useEffect(() => {
        fetch(`/getviewstory/${userid}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(restory => {
                setstory(restory)
                setstorylength(restory.length)
                setdeletestory("")
            })

    }, [deleteStory])
    const NextSlide = () => {
        setcurrent(current === storylength - 1 ? 0 : current + 1)
    }
    const PreviousSlide = () => {
        setcurrent(current === 0 ? storylength - 1 : current - 1)
    }

    const Suredelete = () => {

        sure ? Setsure(false) : Setsure(true)

    }
    const Dontdelete = () => {

        sure ? Setsure(false) : Setsure(true)

    }
    const Deletepost = (postId) => {
        console.log(postId)
        fetch('/deleteStory', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                storyid: postId
            })
        }).then(res => res.json())
            .then(deletedstory => {
                setdeletestory("deleted")
            })
    }
    const Closestory = ()=>{
        history.push('/mysubpost')
    }
    return (
        <section className="slider">
            <FaArrowAltCircleLeft className="left-arrow" onClick={() => PreviousSlide()} />
            <FaArrowAltCircleRight className="right-arrow" onClick={() => NextSlide()} />
            {
                story
                    ?
                    story.map((items, index) => {
                        return (
                            <div className={current === index ? "slide active" : "slide"} keys={index}>

                                {items.postedBy._id === state._id && index === current
                                    ?
                                    <div>
                                        <i style={{ position: 'absolute', right: '0', top: '10px', cursor: 'pointer', display: 'flex', margin: '10px' }} className="material-icons"
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

                                        {index === current ? <img className="image" src={items.story} alt="story" /> : ""}
                                    </div>
                                    :
                                    <div>
                                        {
                                            items.postedBy._id !== state._id
                                            ?
                                        <>
                                         <i style={{ position: 'absolute', right: '0', top: '10px', cursor: 'pointer', display: 'flex', margin: '10px' }} className="material-icons"
                                            onClick={() => {Closestory()}} >close</i> 

                                        {index === current ? <img className="image" src={items.story} alt="story" /> : ""}
                                        </>
                                        :
                                        <>
                                        {index === current ? <img className="image" src={items.story} alt="story" /> : ""}
                                        </>
                                      }
                                    </div>
                                }

                            </div>
                        )
                    })
                    :
                    "loading"
            }
        </section>
    )
}

export default Viewstory
