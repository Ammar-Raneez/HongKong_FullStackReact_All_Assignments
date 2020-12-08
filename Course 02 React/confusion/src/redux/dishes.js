import * as ActionTypes from './ActionTypes';

export const Dishes = (state = {isLoading: true, errorMsg: null, dishes: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DISHES:
            //return an object for each situation with isLoading, errorMsg and the dishes itself
            return {...state, isLoading: false, errorMsg: null, dishes: action.payload};

        case ActionTypes.DISHES_LOADING:
            return {...state, isLoading: true, errorMsg: null, dishes: []};

        case ActionTypes.DISHES_FAILED:
            return {...state, isLoading: false, errorMsg: action.payload, dishes: []};

        default:
            return state;
    }
}