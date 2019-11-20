import {
    SET_DIRECT_MESSAGES, 
    LOADING_UI, 
    SET_ERRORS, 
    CLEAR_ERRORS,
    SET_LOADING_UI_2,
    SET_LOADING_UI_3,
    SET_LOADING_UI_4,
    SET_NOT_LOADING_UI_2,
    SET_NOT_LOADING_UI_3,
    SET_NOT_LOADING_UI_4
} from '../types';
import axios from "axios";

export const getDirectMessages = () => (dispatch) => {
    dispatch({type: LOADING_UI});
    axios.get('/dms')
        .then((res) => {
            dispatch({
                type: SET_DIRECT_MESSAGES,
                payload: res.data.data
            });
            dispatch({type: CLEAR_ERRORS});
        })
}

export const createNewDirectMessage = (username) => (dispatch) => {
    dispatch({type: SET_LOADING_UI_3});
    const data = {
        user: username
    }
    // console.log(username);

    axios.post('/dms/new', data)
        .then((res) => {
            console.log(res.data);
            if (res.data.err) {
                dispatch({
                    type: SET_ERRORS,
                    payload: {
                        createDirectMessage: res.data.err
                    }
                });
            }
            dispatch({type: SET_NOT_LOADING_UI_3});
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: {
                    createDirectMessage: err.response.data.err
                }
            });
            dispatch({type: SET_NOT_LOADING_UI_3});
            console.log(err.response.data);
        })
}