import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'

function Profileupdate() {

  const history = useHistory()
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const { state, dispatch } = useContext(UserContext)

  useEffect(() => {
    if (url) {
      fetch('/UpdateProfile', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
          pic: url,
        })
      }).then(res => res.json())
        .then(data => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" })
          }
          else {
            console.log(data)
            M.toast({ html: 'saved successfully', classes: "#388e3c green darken-2" })
            localStorage.setItem("user", JSON.stringify(data))
            history.push('/profile')
          }
          console.log(data)

        })

    }
  }, [url])

  const postDetails = () => {

    const data = new FormData();
    data.append('file', image)
    data.append('upload_preset', 'insta-clone')
    data.append('cloud_name', 'sahil-projects')
    fetch('https://api.cloudinary.com/v1_1/sahil-projects/image/upload', {  //taken from cloudiary
      method: 'post',
      body: data
    })
      .then(response => response.json())
      .then(result => {
        setUrl(result.url);
        dispatch({ type: "UpdateProfile", payload: result.url })
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }

  return (
    <div className="card" style={{
      margin: "10px auto",
      maxWidth: "550px",
      padding: "20px",
      textAlign: "center"
    }}>

      <div class="file-field input-field">
        <div class="btn #1e88e5 blue darken-1">
          <span>Update profile</span>
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
      <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => postDetails()}>Update Profile</button>
    </div>
  )
}

export default Profileupdate
