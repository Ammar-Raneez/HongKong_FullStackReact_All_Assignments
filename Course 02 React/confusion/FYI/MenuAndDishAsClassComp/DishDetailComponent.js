import React, {Component} from 'react';
import {Card, CardImg, CardText, CardBody, CardTitle} from 'reactstrap';

class DishDetail extends Component {
    // constructor(props) {
    //     super(props)        //upon arriving in this Component, we have the currently clicked on Dish's object
    // }

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

                        <p>{c.author}, {/*some messed up way to convert the ISO into the date we want*/}
                            {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: '2-digit'})
                            .format(new Date(Date.parse(c.date)))}
                        </p>
                    </li>
                )
            })
            return (    
                <React.Fragment>
                    <h4 className="m-3">Comments</h4>
                    <ul className="list-unstyled">
                        {com}
                    </ul>
                </React.Fragment>
            ); 

        }else {
            return( 
                <div></div>
            );
        }    
    }

    render() {
        return (    
            <div className="row">
                <div className="col-md-5 m-1 col-12">
                    {this.renderDish(this.props.selectedDish)}
                </div>
                <div className="col-md-5 m-1 col-12">
                    {this.renderComments(this.props.selectedDish)}
                </div>
            </div>
        )
    }
}

export default DishDetail;