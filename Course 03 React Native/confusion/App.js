import React from 'react';
import Main from './components/MainComponent';
import {Provider} from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

import {Loading } from './components/LoadingComponent';
//allows us to add the persistence into our application, it takes a loading component that we can pass, which'll
//be displayed if there's any delay fetching the data
import { PersistGate } from 'redux-persist/es/integration/react'

//we get both of these from the configureStore
const { persistor, store } = ConfigureStore();

export default function App() {
	return (
//this is how we enable persistence in our app, PersistGate takes our persistor obtained from configureStore
//that is used to persist data into our local storage
		<Provider store={store}>
			<PersistGate loading={<Loading />} persistor={persistor}>
				<Main/>
			</PersistGate>	
		</Provider>
	);
}
