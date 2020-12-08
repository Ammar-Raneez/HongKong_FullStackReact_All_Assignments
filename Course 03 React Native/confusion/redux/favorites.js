import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => {
    switch(action.type) {
        case ActionTypes.ADD_FAVORITE:
            //if favorite dish is already in the state, dont do anything
            if(state.some(element => element === action.payload)) return state;
            //if not we concatenate the dish to the favorites array and send it back
            return state.concat(action.payload);
        //logic here is to return all the favorites that arent equal to the current dishId, signifying deletion
        case ActionTypes.DELETE_FAVORITE:
            return state.filter(favorite => favorite !== action.payload);
        default:
            return state;
    }
}