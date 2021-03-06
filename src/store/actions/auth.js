import axios from '../../axiosService';

import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './types';

import setAuthToken from '../../utils/setAuthToken';

// Register user
export const register = (
  firstName,
  lastName,
  email,
  password,
) => async dispatch => {
  const body = JSON.stringify({ firstName, lastName, email, password });

  try {
    const res = await axios.post(`/api/v1/auth/register`, body);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(`/api/v1/auth/me`);

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Login user
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email, password });

  try {
    dispatch({ type: LOGIN_START });

    const res = await axios.post(`/api/v1/auth/login`, body, config);

    setAuthToken(res.data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (error) {
    dispatch(setAlert(error.toString(), 'danger'));

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout/Cleart profile
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};
