import * as ActionTypes from './ActionTypes';

//samething happens in all the reducer functions
export const Promotions = (state = {errorMsg: null, isLoading: true, promotions: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_PROMOS:
            return {...state, errorMsg: null, isLoading: false, promotions: action.payload};

        case ActionTypes.PROMOS_FAILED:
            return {...state, errorMsg: action.payload, isLoading: false, promotions: []};

        case ActionTypes.PROMOS_LOADING:
            return {...state, isLoading: true, errorMsg: null, promotions: []};

        default:
            return state;
    }
}