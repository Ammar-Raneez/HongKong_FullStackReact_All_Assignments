import React, {Component} from 'react';
import {Card, CardImg, CardText, CardBody, CardTitle} from 'reactstrap';

class DishDetail extends Component {
    constructor(props) {
        super(props)
    }

    renderDish(dish) {
        if(dish != null) {
            return (    
                <Card>
                    <CardImg width="100%" src={dish.image} alt={dish.name}/>
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            );
        } else {
            return( 
                <div></div>
            );
        }
    }

    renderComments(comment) {
        if(comment != null) {
            const com = comment.comments.map(c => {
                return (
                    <li key={c.id}>
                        <p>{c.comment}</p>
                        <p>{c.author}, {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(c.date)))}</p>
                    </li>
                )
            })
            
            return (    
/* {comment.comments.map(com => <li key={com.id} className="m-3"> {com.comment} <br/><br/>-- {com.author}, {com.date.substring(0,10)}</li>)} */
                <div className="container">
                    <h4 className="m-3">Comments</h4>
                    <ul className="list-unstyled">
                        {com}
                    </ul>
                </div>
            );  
        }else {
            return( 
                <div></div>
            );
        }    
    }

//in order to render two divs together wrap em around in React.Fragment tag, this lets you add grouped elements 
//without needing to add extra div nodes to wrap em around  React.Fragment or <>, </>
    render() {
        return (    
            <React.Fragment>
                <div className="col-md-5 m-1 col-12">
                    {this.renderDish(this.props.selectedDish)}
                </div>
                <div className="col-md-5 m-1 col-12">
                    {this.renderComments(this.props.selectedDish)}
                </div>
            </React.Fragment>
        )
    }
}

export default DishDetail;