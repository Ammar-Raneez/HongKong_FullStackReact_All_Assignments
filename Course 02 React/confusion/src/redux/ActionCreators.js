import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../shared/baseUrl';
import fetch from 'cross-fetch';

export const postFeedback = feedback  => dispatch => {
    const newfeedback = {
        firstname: feedback.firstname,
        lastname: feedback.lastname,
        telnum: feedback.telnum,
        email: feedback.email,
        agree: feedback.agree,
        contactType: feedback.contactType,
        message: feedback.message
    }

    return fetch(baseUrl + "feedback", {
        method: 'POST',
        body: JSON.stringify(newfeedback),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
        .then(response => {
            if(response.ok) {
                return response;       
            } else {                    
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;      
            }
        },
            error => {
            var errorMsg = new Error(error.message);
            throw errorMsg;
        })
        .then(response => response.json())
        .then(response => alert(`Thank you for your feedback ${JSON.stringify(response)}`))
        .catch(error => alert(`Feedback couldnt be posted\n ${error.message}`))
}


export const addComment = comment => {
    return {
        type: ActionTypes.ADD_COMMENT,
        payload: comment
    }
}

//function that handles posting the comment onto the json file on the server
export const postComment = (dishId, rating, author, comment) => dispatch => {   //a thunk
    const newComment = {
        dishId: dishId,
        rating: rating,
        author: author,
        comment: comment
    }
    newComment.date = new Date().toISOString();

    return fetch(baseUrl + "comments", {
        method: 'POST',                           //a post operation requires u to send data thru the body
        body: JSON.stringify(newComment),        //turn our js object into a json
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'              //to prevent that stupid cors error
    })
        .then(response => {
            if(response.ok) {
                return response;       
            } else {                    
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;      
            }
        },
            error => {
            var errorMsg = new Error(error.message);
            throw errorMsg;
        })
        //the response will contain the updated comment that has been posted, upon posting it on the server side
        //the comment will have an id which we dispatch
        .then(response => response.json())
        .then(response => dispatch(addComment(response)))
        .catch(error => alert(`Comment couldnt be posted\n ${error.message}`))
}


export const dishesLoading = () => ({type: ActionTypes.DISHES_LOADING})
export const dishesFailed = errMsg => ({type: ActionTypes.DISHES_FAILED, payload: errMsg})
export const addDishes = dishes => ({type: ActionTypes.ADD_DISHES, payload: dishes})
//this is a thunk as it is returning a function
//fetch dishes
export const fetchDishes = () => (dispatch) => {
    dispatch(dishesLoading(true));

    //fetch dishes
    return fetch(baseUrl + "dishes")    //full dishes url localhost:3000/dishes
        .then(response => {
            if(response.ok) {
                return response;       
            } else {                    
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;      
            }
        },
            error => {
            var errorMsg = new Error(error.message);
            throw errorMsg;
        })
        .then(response => response.json())
        .then(dishes => dispatch(addDishes(dishes)))
        .catch(error => dispatch(dishesFailed(error.message)))
}


export const commentsFailed = errMsg => ({type: ActionTypes.COMMENTS_FAILED, payload: errMsg})
export const addComments = comments => ({type: ActionTypes.ADD_COMMENTS, payload: comments})
//fetch comments
export const fetchComments = () => (dispatch) => {
    return fetch(baseUrl + "comments")    
        .then(response => {
            if(response.ok) {
                return response;       
            } else {                    
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;      
            }
        },
            error => {
            var errorMsg = new Error(error.message);
            throw errorMsg;
        })
        .then(response => response.json())
        .then(comments => dispatch(addComments(comments)))
        .catch(error => dispatch(commentsFailed(error.message)))
}


export const promosLoading = () => ({type: ActionTypes.PROMOS_LOADING})
export const promosFailed = errMsg => ({type: ActionTypes.PROMOS_FAILED, payload: errMsg})
export const addPromos = promotions => ({type: ActionTypes.ADD_PROMOS, payload: promotions})
//fetch promos
export const fetchPromos = () => (dispatch) => {
    dispatch(promosLoading(true));

    //javascript es6 fetch api, promises and error handling
    return fetch(baseUrl + "promotions")    
        .then(response => {
            if(response.ok) {
                return response;        //if all is 👍
            } else {                    //if there's some issue with the response we throw an error 
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;      
            }
        },  //this happens if we dont get any sort of response, for instance if we turn off the server, theres no response
            error => {
            var errorMsg = new Error(error.message);
            throw errorMsg;
        })
        .then(response => response.json())
        .then(promotions => dispatch(addPromos(promotions)))
        .catch(error => dispatch(promosFailed(error.message)))
}


export const leadersLoading = () => ({type: ActionTypes.LEADERS_LOADING})
export const leadersFailed = errMsg => ({type: ActionTypes.LEADERS_FAILED, payload: errMsg})
export const addLeaders = leaders => ({type: ActionTypes.ADD_LEADERS, payload: leaders})
//fetch leaders
export const fetchLeaders = () => (dispatch) => {
    dispatch(leadersLoading(true));

    return fetch(baseUrl + "leaders")    
        .then(response => {
            if(response.ok) {
                return response;       
            } else {                    
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;      
            }
        },
            error => {
            var errorMsg = new Error(error.message);
            throw errorMsg;
        })
        .then(response => response.json())
        .then(leaders => dispatch(addLeaders(leaders)))
        .catch(error => dispatch(leadersFailed(error.message)))
}
