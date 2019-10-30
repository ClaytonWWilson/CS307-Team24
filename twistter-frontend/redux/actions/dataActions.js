import {LIKE_POST, UNLIKE_POST, SET_POST, SET_POSTS} from '../types';
import axios from 'axios';

export const getPosts = () => (dispatch) => {
    axios
      .get('/posts')
      .then((res) => {
        dispatch({
          type: SET_POSTS,
          payload: res.data
        });
      })
      .catch((err) => {
        dispatch({
          type: SET_POSTS,
          payload: []
        });
      });
  };

export const likePost = (postId) => (dispatch) => {
    axios
      .get(`/posts/${postId}/like`)
      .then((res) => {
        dispatch({
          type: LIKE_POST,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
  };

  export const unlikePost = (postId) => (dispatch) => {
    axios
      .get(`/posts/${postId}/unlike`)
      .then((res) => {
        dispatch({
          type: UNLIKE_POST,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
  };

  export const getPost = (postId) => (dispatch) => {
    axios
      .get(`/posts/${postId}`)
      .then((res) => {
        dispatch({
          type: SET_POST,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
    };