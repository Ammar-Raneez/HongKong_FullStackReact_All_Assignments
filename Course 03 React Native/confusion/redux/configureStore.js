import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { dishes } from './dishes';
import { comments } from './comments';
import { promotions } from './promotions';
import { leaders } from './leaders';
import { favorites } from './favorites';

import { persistStore, persistCombineReducers } from 'redux-persist';
//*gives access to the local storage of our device, where we'll store the data to be persisted
//*stores data in key: value pairs like an object/map/disctionary
//*for ios, smaller data is stored in a serialized dictionary, larger in separate fukes
//*android stores data ether in RocksDB or SQLite based on availability
//*you can perform regular get set operations
import AsyncStorage from '@react-native-community/async-storage';

//whenever we reload our app, all our favorites are removed, cuz it aint stored anywhere, as for the comments,
//they're stored in a json. In order for our favorites to remain 'favorited' upon a reload, we use redux-persist
//that'll add the persistence automatically by persistCombineReducers

export const ConfigureStore = () => {
    const config = {
        key: 'root',
        storage: AsyncStorage,    //storage - the local device storage
        debug: true //debug info also printed
    }
    //a configuration taken by the persistCombineReducers
    const store = createStore(
        persistCombineReducers(config, {
            dishes,
            comments,
            promotions,
            leaders,
            favorites
        }),
        applyMiddleware(thunk, logger)
    );
    //persistor, obtained from the store, required by our application to configure the persistence
    const persistor = persistStore(store)
    return {persistor, store};
}


//*for a more secure way of data storage - secureStore, stores data for each app separately
//*provides a way to encrpy and securely store key-value pairs locally
//*IOS - keychain services as KSecClassGenericPassword
//*Android - sharedPreferences encrypted with the keystore system
//*uses set/get/deleteItemSync()