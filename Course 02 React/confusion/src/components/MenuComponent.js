import React from 'react';
import {Card, CardImg, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Loading} from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';    //gonna fetch the img source from server

//MenuComponent is now a functional Component
//*its basically the exact same code, but converted into functions as theres no need for a constructor*//

//we can pass "props" as the parameter, but since we already know which properties exactly, we can straightaway define it like this
//(the props themselves are passed as parameters) - ES6 destructuring

//*({dish, onClick}) is actually*//
/*const func = o => {
    var dish = o.dish;
    var onClick = o.onClick;
}
*/

const RenderMenuItem = ({eachDish}) => {
    //the parameters passed are now used so there's no need for "this"
    return (                
        <Card>         
            {/*js template literals, to get the url param, which is the id of the dish (ex:- menu/1)*/}
            <Link to={`/menu/${eachDish.id}`}>
            <CardImg width="100%" src={baseUrl + eachDish.image} alt={eachDish.name}/>
            <CardImgOverlay>
                <CardTitle>{eachDish.name}</CardTitle>
            </CardImgOverlay> 
            </Link>
        </Card>
    )
}

const Menu = props => {
    const menu = props.dishes.dishes.map(dish => {      
        return (    
        //the parameters for RenderMenuItem is given thru Menu which gets the props from the MainComponent class
        //so again there's no need for "this" as everything is now "parameterized"
            <div key={dish.id} className="col-12 col-md-5 m-1">
                <RenderMenuItem eachDish={dish}/>
            </div>
        );
    });  

    if(props.dishes.isLoading) {
        return(
            <div className="container">
                <div className="row">
                    <Loading/>
                </div>
            </div>
        )
    }
    else if(props.dishes.errorMsg) {
        return(
            <div className="container">
                <div className="row">
                    <h4>{props.dishes.errorMsg}</h4>
                </div>
            </div>
        )       
    }
    return (
        <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem active><Link to="/menu">Menu</Link></BreadcrumbItem>
                </Breadcrumb>
            </div>
            <div className="row">
                <h3>Menu</h3>
                <hr/>
            </div>
            <div className="row">
                {menu}
            </div>
        </div>
    );
}

export default Menu;