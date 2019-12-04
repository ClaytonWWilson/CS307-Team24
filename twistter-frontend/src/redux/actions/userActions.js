import {
  SET_USER, 
  SET_ERRORS, 
  CLEAR_ERRORS, 
  LOADING_UI, 
  // SET_AUTHENTICATED, 
  SET_UNAUTHENTICATED,
  LOADING_USER
} from '../types';
import axios from 'axios';

// Saves Authorization in browser local storage and adds it as a header to axios
const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);
  axios.defaults.headers.common['Authorization'] = FBIdToken;
}

// Gets Database info for the logged in user and sets it in Redux
export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
    axios.get('/user')
        .then((res) => {
            dispatch({
                type: SET_USER,
                payload: res.data,
            });
            dispatch({type: CLEAR_ERRORS});
        })
        .catch((err) => console.error(err));
}

// Sends login data to firebase and sets the user data in Redux
export const loginUser = (loginData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .post("/login", loginData)
      .then((res) => {
        // Save the login token
        setAuthorizationHeader(res.data.token);
        dispatch(getUserData());
        // dispatch({ type: CLEAR_ERRORS })
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

// Sends signup data to firebase and sets the user data in Redux
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
        // dispatch({ type: CLEAR_ERRORS })
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

// Deletes the Authorization header and clears all user data from Redux
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

// Sends an image data form to firebase to be uploaded to the user profile
export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.post('/user/image', formData)
    .then(() => {
      dispatch(getUserData());
      // dispatch({ type: CLEAR_ERRORS });
    })
    .catch(err => {
      console.log(err);
    })
}
