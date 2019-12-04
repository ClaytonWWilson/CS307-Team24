import {
  SET_USER, 
  SET_ERRORS, 
  CLEAR_ERRORS, 
  LOADING_UI, 
  // SET_AUTHENTICATED, 
  SET_UNAUTHENTICATED
} from '../types';
import axios from 'axios';

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);
  axios.defaults.headers.common['Authorization'] = FBIdToken;
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

export const loginUser = (loginData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .post("/login", loginData)
      .then((res) => {
        // Save the login token
        setAuthorizationHeader(res.data.token);
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
};

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .post("/signup", newUserData)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        // Save the signup token
        setAuthorizationHeader(res.data.token);
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
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
}

export const deleteUser = () => (dispatch) => {
  axios
    .delete("/delete")
    .then((res) => {
      console.log(res);
      console.log("User account successfully deleted.");
    }
    )
    .catch((err) => {
      dispatch ({
        type: SET_ERRORS,
        payload: err.response.data,
      })
    });

  localStorage.removeItem('FBIdToken');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
}
