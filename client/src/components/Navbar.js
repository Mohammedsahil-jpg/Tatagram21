import React, { useContext, useState, useRef, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const Navbar = () => {
  const searchModal = useRef(null)
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  const [hamburger, sethamburger] = useState(true)
  const [floatNav, setfloatNav] = useState(true)
  const [searchUser,setsearchUser] = useState('')
  const [Userdetails,setUserdetails] = useState([])
  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])

  const Hamburger = () => {
    sethamburger(false)
    setfloatNav(false)
  }
  const Hamburgerclose = () => {
    sethamburger(true)
    setfloatNav(true)
  }

  const Searchuser = (query)=>{
    setsearchUser(query)
    if(searchUser!==''){
      setUserdetails([])
    fetch('/search-user',{
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(result=>{
      setUserdetails(result.user)
    })
  }
  }

  const renderlist = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (state && user.name && !history.location.pathname.startsWith('/resetpassword') && !history.location.pathname.startsWith('/signin')) {
      return [
        <li><Link style={{ fontSize: "20px" }} to="/profile" > <i className="material-icons" >account_circle</i></Link></li>,
        <li><Link style={{ fontSize: "20px" }} to="/CreatePost" ><i className="material-icons" >add_circle</i></Link></li>,
        <li><Link style={{ fontSize: "20px" }} to="/mysubpost" ><i className="material-icons" >tag_faces</i></Link></li>,
        <li><Link style={{ fontSize: "20px" }} to="/followreq" ><div style={{ display: "flex" }}><i className="material-icons" >notifications</i><h6 style={{ float: "right" }}>{state && state.request ? state.request.length : ""}</h6></div></Link></li>,
        <li><i data-target="modal1" className="material-icons modal-trigger" style={{ fontSize: "20px", color: "black", marginLeft: '3px',cursor:'pointer' }} >search</i></li>,
        <li><Link style={{ fontSize: "20px" }} to="/message" ><i className="material-icons" >chat</i></Link></li>,
        <li><button className="btn waves-effect waves-light #1e88e5 blue darken-1" style={{margin:'5px'}} onClick={() => {
          history.push('/signin')
          localStorage.clear()
          dispatch({ type: 'clear' })
        }}>Log Out </button></li>,

      ]
    } else {
      return [
        <li><Link to="/signin">Signin</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
      ]
    }

  }
  return (
    <nav>
      <div className="nav-wrapper wrapper">
        <Link to={state ? "/home" : '/signin'} className="brand">Instagram</Link>
        <ul id="nav-mobile" className={floatNav ? "right" : "floatNav"} style={{ flexWrap: "wrap" }}>
          {renderlist()}
        </ul>
        {
          hamburger
            ?
            <i className="material-icons hamburger" onClick={() => Hamburger()}>dehaze</i>
            :
            <i className="material-icons hamburger" onClick={() => Hamburgerclose()}>close</i>
        }
      </div>
      <div id="modal1" className="modal" ref={searchModal}>
        <div className="modal-content" style={{ color: 'black' }}>
          <input
            type="email"
            placeholder="searchuser"
            value={searchUser}
            onChange={(e) => {
              Searchuser(e.target.value)
            }}
          />
            <ul class="collection" >
              {
                Userdetails
                ?
                Userdetails.map(items=>{
                  return  <Link to={state && state._id !== items._id ? '/profile/'+items._id : '/profile'}><li  onClick={ ()=>{
                    M.Modal.getInstance(searchModal.current).close()
                    setsearchUser('')
                  }} class="collection-item" style={{width:"120%",margin:'5px'}}>{items.email}</li></Link>
                })
                :
                "loading"
              }
           </ul>
        </div>
        <div className="modal-footer">
          <a className="modal-close waves-effect waves-green btn-flat" onClick={()=>setsearchUser('')}>Agree</a>
        </div>
      </div>
    </nav>
  )
}
export default Navbar;