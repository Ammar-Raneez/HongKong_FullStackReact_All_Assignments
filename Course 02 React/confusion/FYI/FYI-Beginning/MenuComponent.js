import React, {Component} from 'react';
import {Media} from 'reactstrap';
import {Card, CardImg, CardImgOverlay, CardText, CardBody, CardTitle} from 'reactstrap';

//user defind Menu component
class Menu extends Component {
    constructor(props) {
        super(props);   //we've gotten access to the parent state thru this 

        //state stores properties we can make use of in this component
        this.state = {
            selectedDish: null
        }
    }

    onDishSelect(dish) {
        this.setState({selectedDish: dish}) //method that changes the state to the passed parameter
        //this is used in our onClick method
    }

    //the following is rendered
    renderDish(dish) {
        if(dish != null) {
            return (    //return information of the specific dish on render
                <Card>
                    <CardImg width="100%" src={dish.image} alt={dish.name}/>
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            );
        } else {
            return( //return a plain empty div if nothing is selected, showing nothing at all
                <div></div>
            );
        }
    }

    render() {  
    //whenever we create a list of items, each item must be unique, that is why the key attribute is given
    //in order to display something react needs a unique identifier
        const menu = this.props.dishes.map(dish => {        //#epic looping - display list of menu items
            return (
                <div key={dish.id} className="col-12 col-md-5 m-1">
                    {/*react event handlers, we call the onDishSelect method passing the clicked on card*/}
                    <Card onClick={() => this.onDishSelect(dish)}>      {/*on click of card this card is sent to the function*/}
                        <CardImg width="100%" src={dish.image} alt={dish.name}/>
                        <CardImgOverlay>
                            <CardTitle>{dish.name}</CardTitle>
                        </CardImgOverlay> 
                    </Card>
                    {/*the Card and many other reactstrap component is used here, and has many methods n classes just like in bootstrap*/}
                    {/*there Media n everything else as well, reactstrap is basically react bootstrap*/}
                </div>
            );
        });   //mapped into our menu 

        return (
            <div className="container">
                <div className="row">
                    {/*displays the list of items*/}
                    {menu}
                </div>
                <div className="row">
                    {/*
                    *initially selectedDish is null, so renderDish will show an empty div
                    *Upon clicking on a card, the selectedDish state is changed to that specific dish
                    *thereby displaying that dish here
                    */}
                    {this.renderDish(this.state.selectedDish)}
                </div> 
            </div>
        );
    }
}

export default Menu;