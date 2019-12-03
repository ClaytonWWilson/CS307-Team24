import {SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LIKE_POST, UNLIKE_POST, SET_LIKES} from '../types';

const initialState = {
    authenticated: false,
    credentials: {},
    likes: [],
    notifications: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state, 
                authenticated: true,

            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                ...state,
                authenticated: true,
                ...action.payload,
            };
        case LIKE_POST:
            return {
                ...state,
                ...action.payload
            }
        case UNLIKE_POST:
            return {
                ...state,
                ...action.payload
            }
        case SET_LIKES:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}