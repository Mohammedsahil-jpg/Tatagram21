// "proxy": "http://localhost:5000"


import React, { useReducer, createContext, useEffect, useContext } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import { BrowserRouter, Route, useHistory, Switch } from 'react-router-dom'
import Home from './components/screens/home'
import Signin from './components/screens/signin'
import Profile from './components/screens/profile'
import Signup from './components/screens/signup'
import CreatePost from './components/screens/CreatePost'
import Userprofile from './components/screens/Userprofile'
import { initialState, reducer } from './components/reducers/userReducer'
import Mysub from './components/screens/mysubpost'
import Story from './components/screens/story'
import Profileupdate from './components/screens/Profileupdate'
import Editpost from './components/screens/Editpost'
import Followreq from './components/screens/Followreq'
import Userposts from './components/screens/Userposts'
import Viewstory from './components/screens/Viewstory'
import Resetpassword from './components/screens/Resetpassword'
import NewPassword from './components/screens/Newpassword'
import Emailvalidate from './components/screens/Emailvalidate'
import Messages from './components/screens/Messages'
import ViewMessage from './components/screens/ViewMessage'
export const UserContext = createContext()


const Routing = () => {
  
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
 
  useEffect(() => {
    fetch('/userdata', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    }).then(res => res.json())
      .then(user => {
        localStorage.setItem("user", JSON.stringify(user))
      })
     const user = JSON.parse(localStorage.getItem('user'))
      if (user && user.name) {
        dispatch({ type: 'USER', payload: user })
        history.push('/home')
      }else{
        if(!history.location.pathname.startsWith('/resetpassword') && !history.location.pathname.startsWith('/verification')){
          history.push('/sigin')
        }
        }
     
  }, [])

  return (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/CreatePost">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <Userprofile />
      </Route>
      <Route path="/mysubpost">
        <Mysub />
      </Route>
      <Route path="/story">
        <Story />
      </Route>
      <Route path="/UpdateProfile">
        <Profileupdate />
      </Route>
      <Route path="/edit/:id">
        <Editpost />
      </Route>
      <Route path="/followreq">
        <Followreq />
      </Route>
      <Route path="/userposts/:userid">
        <Userposts />
      </Route>
      <Route path="/viewstory/:userid">
        <Viewstory />
      </Route>
      <Route exact path="/resetpassword">
        <Resetpassword />
      </Route>
      <Route path="/resetpassword/:token">
        <NewPassword />
      </Route>
      <Route path="/verification/:emailtoken">
        <Emailvalidate />
      </Route>
      <Route path="/message">
        <Messages />
      </Route>
      <Route path="/viewmessage/:id">
        <ViewMessage />
      </Route>
    </Switch>
  )
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (

    <UserContext.Provider value={{ state: state, dispatch: dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;
