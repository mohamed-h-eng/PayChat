import {apiCall} from '../utils/api.js'
import {API_ENDPOINTS} from '../utils/constants.js'

const login= async(payload)=>{
    // console.log(data)
    try{
        const res = await apiCall(API_ENDPOINTS.auth.login ,'POST', payload)
        return res
    }catch(error){
        console.log(error)
        return error
    }
}

const register= async(payload)=>{
    // console.log(data)
    try{
        const res = await apiCall(API_ENDPOINTS.auth.register ,'POST', payload)
        return res
    }catch(error){
        console.log(error)
        return error
    }
}

export const service = {
    login,
    register
}