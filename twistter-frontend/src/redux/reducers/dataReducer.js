import {SET_DIRECT_MESSAGES, SET_USERNAME_VALID, SET_USERNAME_INVALID} from '../types';

const initialState = {
    directMessages: null,
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_DIRECT_MESSAGES:
            return {
                ...state,
                directMessages: action.payload
            };
        default:
            return state;
    }
}