//intial state of our application
import { DISHES } from "../shared/dishes";
import { COMMENTS } from "../shared/comments";
import { PROMOTIONS } from "../shared/promotions";
import { LEADERS } from "../shared/leaders";

export const initialState = {
    dishes: DISHES,
    comments: COMMENTS,
    leaders: LEADERS,
    promotions: PROMOTIONS,
}

//*in order to generate next state we need the previous state and the action to change it*//
//*the state is thought to be immutable, so we need to get a copy of the state, perfom the action on it and*//
//*return the updated state, wihout changing the previous*//

//when the reducer is called initially by the store, the Store doesn't have an initial state, so the default state
//will be the initialState
export const Reducer = (state=initialState, action) => {
    return state;
}


/*
*Redux data flow
*The state is placed in a separate file, and is ready only
*Reducer functions take in the state do any changes and return the new updated state, w/o affected the inital state
*The new state is then received by the View - our MainComponent
*If the view must change the state(User interactions occured) an action function will be send to the store
*Which then returns a new state after doing the action on it, thru the Reducer pure function
*The store file is imported into our App.js which is passed as props to a Provider Component, which is then accessible for all
*/


//*its best to create reducers for each state separately, so that each reducer will only handle a single state*//

/*so we can delete this file*/