import {SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI} from '../types';
import axios from 'axios';

export const loginUser = (loginData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .post("/login", loginData)
      .then((res) => {
        // Save the login token
        const FBIdToken = `Bearer ${res.data.token}`;
        localStorage.setItem('FBIdToken', FBIdToken);
        axios.defaults.headers.common['Authorization'] = FBIdToken;
        dispatch(getUserData());
        dispatch({ type: CLEAR_ERRORS })
        // Redirects to home page
        history.push('/home');
      })
      .catch((err) => {
        dispatch ({
            type: SET_ERRORS,
            payload: err.response.data,
        })
      });
}

export const getUserData = () => (dispatch) => {
    axios.get('/user')
        .then((res) => {
            dispatch({
                type: SET_USER,
                payload: res.data,
            })
        })
        .catch((err) => console.error(err));
}