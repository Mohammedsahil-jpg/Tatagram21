import React, { useState, useEffect, useContext } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'


const Story = () => {

  const history = useHistory()
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setloading] = useState(true)

  useEffect(() => {
    if (url) {

      fetch('/story', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
          storypic: url,
        })
      }).then(res => res.json())
        .then(data => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" })
          }
          else {
            M.toast({ html: 'saved successfully', classes: "#388e3c green darken-2" })
            history.push('/home')
          }
        })

    }
  }, [url])

  const postDetails = () => {
    setloading(false)
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

      })
      .catch(error => {
        console.error('Error:', error);
      });

  }
  return (
    <>
      {
        loading
          ?
          <div className="card" style={{
            margin: "10px auto",
            maxWidth: "550px",
            padding: "20px",
            textAlign: "center"
          }}>

            <div class="file-field input-field">
              <div class="btn #1e88e5 blue darken-1">
                <span>Upload Story</span>
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
            <button class="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={() => postDetails()}>Submit Story</button>
          </div>
          :
          "Uploading your story please wait"
      }
    </>
  )
}


export default Story


