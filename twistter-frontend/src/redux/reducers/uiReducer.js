import { 
    SET_ERRORS, 
    CLEAR_ERRORS, 
    LOADING_UI, 
    SET_LOADING_UI_2, 
    SET_LOADING_UI_3, 
    SET_LOADING_UI_4,
    SET_NOT_LOADING_UI_2,
    SET_NOT_LOADING_UI_3,
    SET_NOT_LOADING_UI_4
 } from '../types';

const initialState = {
    loading: false,
    loading2: false,
    loading3: false,
    loading4: false,
    errors: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_ERRORS:
            return {
                ...state,
                loading: false,
                errors: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                loading: false,
                errors: null
            };
        case LOADING_UI:
            return {
                ...state,
                loading: true
            };
        case SET_LOADING_UI_2:
            return {
                ...state,
                loading2: true
            };
        case SET_LOADING_UI_3:
            return {
                ...state,
                loading3: true
            };
        case SET_LOADING_UI_4:
            return {
                ...state,
                loading4: true
            };
        case SET_NOT_LOADING_UI_2:
            return {
                ...state,
                loading2: false
            };
        case SET_NOT_LOADING_UI_3:
            return {
                ...state,
                loading3: false
            };
        case SET_NOT_LOADING_UI_4:
            return {
                ...state,
                loading4: false
            };
        default:
            return state;
    }
}