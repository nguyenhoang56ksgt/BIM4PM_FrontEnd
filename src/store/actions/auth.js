
import axios from 'axios';
import {setAlert} from './alert'
import {
REGISTER_SUCCESS,
REGISTER_FAIL,
USER_LOADED,
AUTH_ERROR,
LOGIN_SUCCESS,
LOGIN_FAIL,
LOGOUT
} from './types';

import setAuthToken from '../../utils/setAuthToken';

//Register user
export const register = (firstName, lastName, email, password)=> async dispatch=>{
    const config ={
        headers:{
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({firstName, lastName, email, password});
    
    try {
        const res = await axios.post('/api/v1/auth/register', body, config);
        
        dispatch({
            type:REGISTER_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;
      
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL 
        });
    }   
}

// Load User
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
  
    try {
      const res = await axios.get('/api/v1/auth/me');
  
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR
      });
    }
  };
  

//Login user
export const login = ( email, password )=> async dispatch=>{
    const config ={
        headers:{
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email, password});

    try {
        const res = await axios.post('/api/v1/auth/login', body, config);
        setAuthToken(res.data.token);
        dispatch({
            type:LOGIN_SUCCESS,
            payload: res.data
        });
       
        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;
        console.log(error)
        dispatch(setAlert(error.toString(), 'danger'))
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: LOGIN_FAIL 
        })
    }   
}

// Logout/Cleart profile
export const logout = () => dispatch =>{ 
    dispatch({ type: LOGOUT });
}