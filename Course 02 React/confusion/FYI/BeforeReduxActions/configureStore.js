import {createStore} from 'redux';
import {Reducer, initialState} from './reducer';

export const ConfigureStore = () => {
    //creates the store with our state; takes in the Reducer function and the state that the function will operate on
    const store = createStore(Reducer, initialState);       
    return store;
}