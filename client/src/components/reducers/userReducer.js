

export const initialState = null

export const reducer = (state,action)=>{
    if(action.type === 'USER'){
        return action.payload
    }
    if(action.type === 'clear'){
        return null
    }
    if(action.type == 'Updatefollower'){
        return {
            ...state,
            followers:action.payload.followers,
            following:action.payload.following
        }
    }
    if(action.type == "Update"){
        return{
            ...state,
            request:action.payload.request
        }
    }
   if(action.type == "UpdateProfile"){
       return{
           ...state,
           photo:action.payload
       }
   }
    return state
}