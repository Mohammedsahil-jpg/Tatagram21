import React, { useState, useEffect, useContext } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../../App'

const CreatePost = () => {

  const history = useHistory()
  const [data, setdata] = useState()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const { state } = useContext(UserContext)
  const [userprofile, Setuserprofile] = useState("")
  const [privacy, Setprivacy] = useState(true)
  const [getprivacy, Setgetprivacy] = useState("")
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (url) {
      fetch('/createpost', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
          Userprofile: userprofile,
          privacy: getprivacy
        })
      }).then(res => res.json())
        .then(data => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" })
          }
          else {
            M.toast({ html: 'saved successfully', classes: "#388e3c green darken-2" })
            history.push('/home')
            setdata(data)
          }
        })
    }
  }, [url])

  const postDetails = () => {
    setLoading(true)
    Setuserprofile(state.photo)
    const data = new FormData();
    data.append('file', image)
    data.append('upload_preset', 'insta-clone')
    data.append('cloud_name', 'sahil-projects')
    fetch('https://api.cloudinary.com/v1_1/sahil-projects/image/upload', {
      method: 'post',
      body: data
    })
      .then(response => response.json())
      .then(result => {
        setUrl(result.url);

      })
      .catch(error => {
        console.error('Error:', error);
      });

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
      {
        loading
          ?
          "loading..."
          :
          <>
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
            <div style={{ display: "flex" }}>
              <h5 style={{ marginRight: "10px" }}>Privacy:</h5>
              {
                privacy
                  ?
                  <button style={{ marginTop: "10px" }} className="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => ChangePrivacyPublic()}>Public </button>
                  :
                  <button style={{ marginTop: "10px" }} className="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => ChangePrivacyPrivate()}>private </button>
              }
            </div>
            <div class="file-field input-field">
              <div class="btn #1e88e5 blue darken-1">
                <span>Upload Image</span>
                <input type="file"
                  onChange={(e) => {
                    setImage(e.target.files[0])
                  }}
                />
              </div>
              <div class="file-path-wrapper">
                <input class="file-path validate" type="text" />
              </div>
            </div>
            <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => postDetails()}>Submit Post</button>
          </>
      }
    </div>
  )
}


export default CreatePost


