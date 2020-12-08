import React, {Component} from 'react';
import logo from './logo.svg';
import {Navbar, NavbarBrand} from 'reactstrap';  //reactstrap, bootstrap Navbar
import Menu from './components/MenuComponent';
// import './App.css';
import {DISHES} from './shared/dishes';

class App extends Component { //all components must extend from the Component
  constructor(props) {
    super(props);
    this.state = {
      dishes: DISHES    //lifiting the state to parent access, so that it's accessible by all child classes (ex Menu)
    }
  }
  
  //render() method is what is called, which returns the html content inside it
  render() {
    //className is used, as uk class is a reserved word in ES6
    //we specify js content within curly braces
    //**this shiz is rendered by calling <App/> in the ReactDOM method**//
    //**the reason to do jsx is to avoid artificial separation of rendering logic from UI logic - it contains both**//
    // return (  //if you remember if content is larger than 1 line, you must wrap in brackets
    //   <div className="App">
    //     <header className="App-header"> 
    //       <img src={logo} className="App-logo" alt="logo"/>  
    //       <h1 className="App-title">Welcome to React</h1>
    //       <p>Edit <code>src/App.js</code> and save to reload.</p>
    //       <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a>
    //     </header>
    //   </div>
    //);
    
    //Navbar is now a component, so we use the tags as such, with caps, cuz otherwise its thought of like html DOM elements
    return (
      <div className="App">
        <Navbar dark color="primary">
          <div className="container">
            <NavbarBrand href="/">Ristorante Con Fusion</NavbarBrand>
          </div>
        </Navbar>
        <Menu dishes={this.state.dishes}/>  {/*passing the state as props to the Menu component*/} 
        {/*dishes is passed as the prop name as that's how its defined in the state*/}
      </div>  
    )
  }
}

export default App;   //to be used in index.js
