import React, { useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import M from 'materialize-css'

function Editpost() {
  const history = useHistory()
  const { id } = useParams()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [getprivacy, Setgetprivacy] = useState("private")
  const [privacy, Setprivacy] = useState("private")
  const EditDetails = () => {
    fetch(`/Editpost/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        title,
        body,
        privacy: getprivacy
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        history.push('/')
      })
  }
  const ChangePrivacyPrivate = () => {
    Setprivacy(true)
    Setgetprivacy("private")
    M.toast({ html: "Your post is now private", classes: "#388e3c green darken-2" })
  }

  const ChangePrivacyPublic = () => {
    Setprivacy(false)
    Setgetprivacy("public")
    M.toast({ html: "Your post is now public", classes: "#388e3c green darken-2" })
  }

  return (
    <div className="card" style={{
      margin: "10px auto",
      maxWidth: "550px",
      padding: "20px",
      textAlign: "center"
    }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
        }}
      ></input>
      <input type="text"
        placeholder="body"
        value={body}
        onChange={(e) => {
          setBody(e.target.value)
        }}
      ></input>
      <div style={{ margin: "10px", display: "flex" }}>
        <h5 style={{ marginRight: "10px" }}>Privacy:</h5>
        {
          privacy
            ?
            <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => ChangePrivacyPublic()}>Public </button>
            :
            <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => ChangePrivacyPrivate()}>private </button>
        }
      </div>
      <button style={{ marginLeft: "10px" }} class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => EditDetails()}>Edit Post</button>
    </div>
  )
}

export default Editpost
