import React, { Component } from "react";
import Home from "./HomeComponent";
import Menu from "./MenuComponent";
import DishDetail from './DishDetailComponent';
import { DISHES } from "../shared/dishes";
import Footer from "./FooterComponent";
import Header from "./HeaderComponent";
import {Switch, Router, Redirect} from 'react-router-dom'

//*main component is now a Container Component, it doesn't display anything by itself rather it uses*//
//*the Menu and DishDetail classes to render display by passing props and maintaining state (of user interactions etc..)*//
//*these two Components are Presentational Components, they concern with the look*//
//*as they rely on the props passed by the Container Component to render display and all they do is render display*//

//**Theres no specific reason to do this, its only for organizational purposes**//

class Main extends Component {
    constructor(props) {
        super(props);           //constructor is needed only if you need specific states
        this.state = {
            dishes: DISHES,
            selectedDish: null,
        };
    }

    onDishSelect(dishId) {
        this.setState({selectedDish: dishId})   //use the dish_id to target each separate dish
    }

    render() {
        return (
            <div>
                <Header/>
                {/*main container with a row for each, using reacts bootstrap - reactstrap*/}
                <div className="container">
                    {/*dishes object is passed so that it can be used in Menu*/}
                    <Menu dishes={this.state.dishes} onClick={dishId => this.onDishSelect(dishId)}/>
                    {/*an onClick prop is passed which updates the state to the current dish*/}

                    <DishDetail selectedDish={this.state.dishes.filter(dish => dish.id === this.state.selectedDish)[0]}/>
                    {/*that dish is then sent into DishDetail as a prop, which displays the dish, thru filtering*/}
                    
                    {/*the selected dish's id is passed in the filter method which returns the dish that has that
                    specific id (as it is called by the dishes object, which displays the dish and comments)
                    */}

                    {/*we specify [0] as the filter method returns an array of the particular object*/}
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Main;
