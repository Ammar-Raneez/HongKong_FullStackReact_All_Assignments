//this file creates the actions
import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../shared/baseUrl';

//the action function that'll be used to add comments - actions return plain js objects and must contain a type, defining the type of the action
export const addComment = (dishId, rating, author, comment) => {
    return {
        type: ActionTypes.ADD_COMMENT,
        payload: {
            dishId: dishId,
            rating: rating,
            author: author,
            comment: comment
        }
    }
}
//*the action we use to add comments in our DishDetailComponent, imported into Main, connected with thru mapDispatchToProps and sent as props*//
//payload holds data that must be sent to the reducer function

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
export const dishesLoading = () => ({type: ActionTypes.DISHES_LOADING})
export const dishesFailed = errMsg => ({type: ActionTypes.DISHES_FAILED, payload: errMsg})
export const addDishes = dishes => ({type: ActionTypes.ADD_DISHES, payload: dishes})

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
export const commentsFailed = errMsg => ({type: ActionTypes.COMMENTS_FAILED, payload: errMsg})
export const addComments = comments => ({type: ActionTypes.ADD_COMMENTS, payload: comments})

//fetch promos
export const fetchPromos = () => (dispatch) => {
    dispatch(promosLoading());

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
export const promosLoading = () => ({type: ActionTypes.PROMOS_LOADING})
export const promosFailed = errMsg => ({type: ActionTypes.PROMOS_FAILED, payload: errMsg})
export const addPromos = promotions => ({type: ActionTypes.ADD_PROMOS, payload: promotions})

//fetch leaders
export const fetchLeaders = () => (dispatch) => {
    dispatch(leadersLoading());

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
export const leadersLoading = () => ({type: ActionTypes.LEADERS_LOADING})
export const leadersFailed = errMsg => ({type: ActionTypes.LEADERS_FAILED, payload: errMsg})
export const addLeaders = leaders => ({type: ActionTypes.ADD_LEADERS, payload: leaders})