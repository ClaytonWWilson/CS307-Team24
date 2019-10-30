import { LIKE_POST, UNLIKE_POST} from '../types';

const initialState = {
    likes: [],
    credentials: {}
}

export default function(state = initialState, action) {
    switch (action.type) {
        case LIKE_POST:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        postId: action.payload.postId
                    }
                ]
            }
        case UNLIKE_POST:
            return {
                ...state,
                likes: state.likes.filter(
                    (like) => like.postId === action.payload.postId
                )
            };
            default:
                return state;
    }
}