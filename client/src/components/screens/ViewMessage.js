import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../../App'

function ViewMessage() {
    const {state} = useContext(UserContext)
    const {id} = useParams()
    const [message,setMessage] = useState("")
    const [messageid_1,Setmessageid_1] = useState("")
    const [messageid_2,Setmessageid_2] = useState("")
    const [receivedMessage,setReceivedmessage] = useState()
    const [sentMessages,Setsentmessages] = useState()
    const scrollMessage = useRef(null)
    useEffect(()=>{
        fetch('/getuserid',{
            method:'post',
            headers:{
                'Authorization':'Bearer '+ localStorage.getItem('jwt'),
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                friend_id:id
            })
        }).then(res=>res.json())
        .then(result=>{
            Setmessageid_1(result.id_1)
            Setmessageid_2(result.id_2)
            setReceivedmessage(result.user1)
        })
    },[])
    useEffect(()=>{
        Scrolltobottom()
    },[receivedMessage])
    const SendMessage = ()=>{
        if(message !== ""){
        fetch('/storeMessage',{
            method:'post',
            headers:{
                'Authorization':'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                messageid_1,
                messageid_2,
                friend_id:id,
                message
            })
        }).then(res=>res.json())
        .then(result=>{
            setMessage("")
            setReceivedmessage(result)
        })
    }
    }
    const Scrolltobottom = ()=>{
        if(scrollMessage.current){
            scrollMessage.current.scrollIntoView({behavior:"smooth"})
        }
    }
    const Deletemsg = (deleteMessage)=>{
        fetch('/deletemsg',{
            method:'post',
            headers:{
                'Authorization':'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                messageid_1,
                messageid_2,
                deleteMessage
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
           setReceivedmessage(result)
        })
    }
   
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="ViewMessage">
                <div className="MessageContainer">
                    {
                        receivedMessage && state
                        ?
                        receivedMessage.messages.map(items=>{
                            return(
                            <div ref={scrollMessage} className={items.postedBy._id && items.postedBy._id === state._id ? 'sentMessage' : 'receivedmessage'}>
                            <h5 style={{ fontSize: '15px', fontWeight: 'bold',paddingLeft:'5px' }}>{items.message}</h5>
                            {
                                items.postedBy._id && items.postedBy._id === state._id 
                                ?
                                <i style={{marginLeft:'auto',cursor:"pointer"}} className="material-icons" onClick={()=>Deletemsg(items.message)}>delete</i>
                                :
                                ""
                            }
                        </div>
                            )
                        })
                   :
                   "loading...."
                    }
                </div>
                <div className="form">
                    <hr />
                    <input placeholder="Type a message" value={message}  onChange={(e) => {setMessage(e.target.value)} } ></input>
                    <i style={{ cursor: 'pointer', marginLeft: "10px" }} className="material-icons" onClick={()=>SendMessage()}>send</i>
                </div>
            </div>
        </div>
    )
}

export default ViewMessage
