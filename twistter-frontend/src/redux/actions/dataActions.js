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
    dispatch({type: SET_LOADING_UI_2});
    axios.get('/dms')
        .then((res) => {
            dispatch({
                type: SET_DIRECT_MESSAGES,
                payload: res.data.data
            });
            dispatch({type: SET_NOT_LOADING_UI_2});
            dispatch({type: CLEAR_ERRORS});
        })
}

export const getNewDirectMessages = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        axios.get('/dms')
            .then((res) => {
                dispatch({
                    type: SET_DIRECT_MESSAGES,
                    payload: res.data.data
                });
                dispatch({type: SET_NOT_LOADING_UI_2});
                dispatch({type: CLEAR_ERRORS});
                resolve();
            })
    })
}

export const reloadDirectMessageChannels = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        axios.get('/dms')
            .then((res) => {
                dispatch({
                    type: SET_DIRECT_MESSAGES,
                    payload: res.data.data
                });
                dispatch({type: SET_NOT_LOADING_UI_3});
                dispatch({type: CLEAR_ERRORS});
                resolve();
            })
    })
    
}

export const createNewDirectMessage = (username) => (dispatch) => {
    return new Promise((resolve, reject) => {
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
                    dispatch({type: SET_NOT_LOADING_UI_3});
                } else {
                    // dispatch(getNewDirectMessages());
                    // dispatch({type: SET_NOT_LOADING_UI_3});
                }
                resolve();
            })
            .catch((err) => {
                dispatch({
                    type: SET_ERRORS,
                    payload: {
                        createDirectMessage: err.response.data.error
                    }
                });
                dispatch({type: SET_NOT_LOADING_UI_3});
                console.log(err.response.data);
                reject();
            })
    });
}

export const sendDirectMessage = (user, message) => (dispatch) => {
    dispatch({type: SET_LOADING_UI_4});
    const data = {
        message,
        user
    };

    axios.post('/dms/send', data)
        .then((res) => {
            // console.log(res);
            return axios.get('/dms')
        })
        .then((res) => {
            dispatch({
                type: SET_DIRECT_MESSAGES,
                payload: res.data.data
            });
            dispatch({type: SET_NOT_LOADING_UI_4});
            dispatch({type: CLEAR_ERRORS});
        })
        .catch((err) => {
            console.log(err);
            dispatch({
                type: SET_ERRORS,
                payload: {
                    sendDirectMessage: err.response.data
                }
            })
        })
}