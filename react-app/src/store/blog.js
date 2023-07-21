// ACTION TYPES
const SET_BLOG_POSTS = 'blog/SET_BLOG_POSTS';
const ADD_BLOG_POST = 'blog/ADD_BLOG_POST';
const UPDATE_BLOG_POST = 'blog/UPDATE_BLOG_POST';
const REMOVE_BLOG_POST = 'blog/REMOVE_BLOG_POST';

// ACTION CREATORS
const setBlogPosts = (posts) => ({
  type: SET_BLOG_POSTS,
  posts,
});

const addBlogPost = (post) => ({
  type: ADD_BLOG_POST,
  post,
});

const updateBlogPost = (post) => ({
    type: UPDATE_BLOG_POST,
    post,
  });
  

const removeBlogPost = (id) => ({
  type: REMOVE_BLOG_POST,
  id,
});

// THUNKS
export const getBlogPosts = () => async (dispatch) => {
  const response = await fetch('/api/blog/');
  if (response.ok) {
    const posts = await response.json();
    dispatch(setBlogPosts(posts));
  }
};

export const createBlogPost = (postData) => async (dispatch) => {
  const response = await fetch('/api/blog', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        },
    body: JSON.stringify({
        title: postData.title,
        content: postData.content,
    }),
    });
    if (response.ok) {
        const post = await response.json();
        dispatch(addBlogPost(post));
        return post;
    } else {
        const data = await response.json();
        if (data.errors) {
            console.error(data.errors);
        }
    }
};


export const editBlogPost = (postData) => async (dispatch) => {
    const response = await fetch(`/api/blog/${postData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: postData.title,
        content: postData.content,
      }),
    });
  
    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(updateBlogPost(updatedPost));
      return updatedPost;
    } else {
      const data = await response.json();
      if (data.errors) {
        console.error(data.errors);
      }
    }
  };
  

export const deleteBlogPost = (id) => async (dispatch) => {
  const response = await fetch(`/api/blog/${id}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    dispatch(removeBlogPost(id));
  }
};

// INITIAL STATE
const initialState = {};

// REDUCER
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_BLOG_POSTS: {
      const newState = { ...state };
      action.posts.forEach((post) => {
        newState[post.id] = post;
      });
      return newState;
    }
    case ADD_BLOG_POST: {
      return { ...state, [action.post.id]: action.post };
    }
    case UPDATE_BLOG_POST: {
        const newState = { ...state };
        newState[action.post.id] = action.post;
        return newState;
      }
      
    case REMOVE_BLOG_POST: {
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    }
    default:
      return state;
  }
}
