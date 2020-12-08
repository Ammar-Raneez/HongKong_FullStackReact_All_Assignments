import React, { Component } from "react";
import Main from "./components/MainComponent";
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';       //makes redux store become available to all components
import {ConfigureStore} from './redux/configureStore';

const store = ConfigureStore();

//main runner - calls <Main/> which in turn calls Menu and DishDetail
class App extends Component {


    render() {
        /*wrapping around with Provider makes our store state available to all our components*/
        /*BrowserRouter enables router navigation*/
        return (    
            <Provider store={store}>    
                <BrowserRouter>         
                    <div>
                        <Main/>
                    </div>
                </BrowserRouter>
            </Provider>
        )
    }
}

export default App;
