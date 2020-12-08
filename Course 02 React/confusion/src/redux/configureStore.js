import {createStore, combineReducers, applyMiddleware} from 'redux';
import {createForms} from 'react-redux-form';   
//enables us to add form state into our redux store, it handles all the reducer functions, so we need not create any actions
import {InitialFeedback} from './forms';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {Dishes} from './dishes';
import {Comments} from './comments';
import {Promotions} from './promotions';
import {Leaders} from './leaders';

//we've divided our reducer functions to handle each state separately, the combineReducers function
//from redux make it possible to put them all together
export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dishes: Dishes,
            comments: Comments,
            promotions: Promotions,
            leaders: Leaders,
            ...createForms ({
                feedback: InitialFeedback       //upon a submit, to reset the form rather than keeping values
            })
        }),
        applyMiddleware(thunk, logger)    
        //applyMiddleware returns a store enhancer, so thunk and logger are supplied as enhancers for our store, n available for our app
    );       
    return store;
}