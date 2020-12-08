import React, { Component } from "react";
import Home from "./HomeComponent";
import Menu from "./MenuComponent";
import DishDetail from "./DishDetailComponent";
import Footer from "./FooterComponent";
import Header from "./HeaderComponent";
import Contact from "./ContactComponent";
import About from './AboutComponent';
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import {actions} from 'react-redux-form';
import { connect } from "react-redux"; //finally, to connect our react app with the redux store (withRouter is needed as well)
import {TransitionGroup, CSSTransition} from 'react-transition-group'

import {postComment, fetchDishes, fetchComments, fetchPromos, fetchLeaders, postFeedback} from '../redux/ActionCreators'      
//importing the actionCreators so we can dispatch it to the store

//**mapStateToProps returns an object full of data, with each field being a prop for the wrapped component**//
//the entire state we created in the store is available by doing this, as props
const mapStateToProps = state => {
    return{
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
}
// action ---> dispatch ---> store

//returns the action object that is sent to the dispatch function, which then can be available to our mainComponent once we connect it
const mapDispatchToProps = dispatch => {
    return{
        postFeedback: feedback => dispatch(postFeedback(feedback)),
        postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
        fetchDishes: () => dispatch(fetchDishes()),
        fetchComments: () => dispatch(fetchComments()),
        fetchPromos: () => dispatch(fetchPromos()),
        fetchLeaders: () => dispatch(fetchLeaders()),
        resetFeedbackForm: () => {dispatch(actions.reset('feedback'))},
//dispatch a reset action to request 'feedback' whenever this function is called (whenever a state changes)
    }
}

class Main extends Component {
    //constructor is needed only if you need specific states
    constructor(props) {
        super(props);           

        this.HomePage = this.HomePage.bind(this);
        this.DishWithId = this.DishWithId.bind(this);
    }

    //executes immediately once the component is mounted onto the dom, goes and fetches em all from the server
    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
    }

    HomePage = () => {
        return (
            <Home 
                dish={this.props.dishes.dishes.filter(dish => dish.featured)[0]}
                dishesLoading={this.props.dishes.isLoading}
                dishesErrorMsg={this.props.dishes.errorMsg}
                promotion={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]}
                promoLoading={this.props.promotions.isLoading}
                promoErrorMsg={this.props.promotions.errorMsg}
                leader={this.props.leaders.leaders.filter(leader => leader.featured)[0]}
                leaderLoading={this.props.leaders.isLoading}
                leaderErrorMsg={this.props.leaders.errorMsg}
            />
        );
    }

    //actually gets match, location, history but we need only match as of now
    DishWithId = ({match}) => {
        return (
            <DishDetail 
                dish={this.props.dishes.dishes.filter(dish => dish.id === parseInt(match.params.dishId, 10))[0]}
                isLoading={this.props.dishes.isLoading}
                errorMsg={this.props.dishes.errorMsg}
                comments={this.props.comments.comments.filter(comment => comment.dishId === parseInt(match.params.dishId, 10))}
                commentsErrorMsg={this.props.comments.errorMsg}
                postComment={this.props.postComment}
            />
        )
    }

    render() {
        return (
            <div>
                {/*rendering Header and Footer components,*/}
                <Header/>

                <TransitionGroup>
                    {/*specifies the Routing (paths). Visiting the links calls each component*/}
                    <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                        <Switch location={this.props.location}>    
                            <Route path="/home" component={this.HomePage}/>

                            {/*we add "exact" so that it'll match only /menu, NOT /menu/id*/}
                            <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes}/>}/>

                            {/*passing url parameters*/}
                            <Route path="/menu/:dishId" component={this.DishWithId}/>

                            {/*We can do this if we dont have to pass in any props to the Component*/}
                            <Route exact path="/contactus" component={() => <Contact postFeedback={this.props.postFeedback} resetFeedbackForm={this.props.resetFeedbackForm}/>}/>

                            {/*here we pass props*/}
                            <Route exact path="/aboutus" component={() => <About isLoading={this.props.dishes.isLoading} errorMsg={this.props.dishes.errorMsg} leaders={this.props.leaders}/>}/>

                            {/*if we visit a link not Routed, we are redirected to home*/}
                            <Redirect to="/home"/>  
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
                
                <Footer/>
            </div>
        );
    }
}
//*map state to props is called everytime a state changes*//
//**connect generates a wrapper container component that subscribes to the store**//
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));  
//connects our Main to the Store, so that it subscribes to the redux store
//withRouter() is a necessity if you use the react-router