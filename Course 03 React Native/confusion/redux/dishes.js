import * as ActionTypes from './ActionTypes';

export const dishes  = (state = {
    isLoading: true,    //if data loaded from server side
    errorMsg: null,     //if there's any error
    //contains dishes
    dishes: []}, action)  => {
    switch(action.type) {
        case ActionTypes.ADD_DISHES:
            return {...state, isLoading: false, errMess: null, dishes: action.payload};
        case ActionTypes.DISHES_LOADING:
            return {...state, isLoading: true, errMess: null, dishes: []}
        case ActionTypes.DISHES_FAILED:
            return {...state, isLoading: false, errMess: action.payload};
        default:
            return state;
    }
}