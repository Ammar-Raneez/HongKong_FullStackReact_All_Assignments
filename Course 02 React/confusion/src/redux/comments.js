//the action type of comments is obv imported here, so all the other reducer functions dont have to receive it
import * as ActionTypes from './ActionTypes';

export const Comments = (state = {errorMsg: null, comments: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_COMMENTS:
            return {...state, errorMsg: null, comments: action.payload};

        case ActionTypes.COMMENTS_FAILED:
            return {...state, errorMsg: action.payload, comments: []};

        case ActionTypes.ADD_COMMENT:
            var comment = action.payload;
            return {...state, comments: state.comments.concat(comment)};
            //the comment is sent to the server first before we get the response and add it into the store
        //this makes certain that the change is reflected on the server-side before even being added into
        //the redux store
    
        default:
            return state;
    }
}

//comment id is the length of the comments.js file, since index starts from 0
// comment.id = state.comments.length;   
// comment.date = new Date().toISOString(); 
//these two arent necessary, id is added by the server and we pass the date in action creator