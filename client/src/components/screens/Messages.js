import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../../App'

function Messages() {
    const history = useHistory()
    const {state} = useContext(UserContext)
    const [user,SetUser] = useState([])
    const [messageid,Setmessageid] = useState("")

    useEffect(()=>{
        fetch('/getuserMessage',{
            headers:{
                'Authorization':'Bearer '+ localStorage.getItem('jwt'),
                'Content-Type':'application/json'
            }
        }).then(res=>res.json())
        .then(result=>{
            SetUser(result.user)
        })
    },[])

    const ViewMessage = (id)=>{
        fetch('/CreateuserMessage',{
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
                Setmessageid(result.id_2)
            })
            history.push(`/viewmessage/${id}`)
    }
    
    return (
        <>
        {
            state
             ? 
             user.map(items=>{
                 return(
                    <div style={{display:"flex",margin:"20px",height:"max-content"}} onClick={()=>ViewMessage(items._id)}>
                    <div className="messageProfile" >
                        <img src={items.photo} />
                    </div>
                    <div style={{position:"relative",width:"200px"}}>
                        <h6 style={{position:"absolute",top:"-10px"}}>{items.name}</h6>
                        <p style={{fontSize:"15px",fontWeight:"400",position:"absolute",top:"10px"}}>Tap to message</p>
                    </div>
                </div>
                 )
             })
             :
             "loading"
            }
     </>
    )
}

export default Messages
