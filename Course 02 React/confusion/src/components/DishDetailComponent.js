import React, {Component} from 'react';
import {Card, CardImg, CardText, CardBody, CardTitle, BreadcrumbItem, Breadcrumb, Button, Modal, ModalBody, ModalHeader, Label, Row, Col} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control, LocalForm, Errors} from 'react-redux-form';    
import {Loading} from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger} from 'react-animation-components'

const required = val => val && val.length;
const maxLength = len => val => !(val) || val.length <= len;
const minLength = len => val => (val) && val.length >= len;

class CommentForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalFlag: false
        }
        this.toggleModal = this.toggleModal.bind(this); 
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal = () => this.setState({modalFlag: !this.state.modalFlag})

    handleSubmit(values) {
        this.toggleModal();
        var output = "";

        if(JSON.stringify(values.author)) output += `Thank you, ${JSON.stringify(values.author)}\n`
        if(JSON.stringify(values.rating)) output += `You rated us, ${JSON.stringify(values.rating)} stars\n`
        if(JSON.stringify(values.comment)) output += `And gave us an additional comment - ${JSON.stringify(values.comment)}`
        alert(output);
        
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render(){
        return (
            <React.Fragment>
                <Button onClick={this.toggleModal} outline color="secondary"><span className="fa fa-pencil"></span> Submit Comment</Button>
                
                <Modal isOpen={this.state.modalFlag} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comments</ModalHeader>

                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Col md={{size: 12}}>
                                        <Label>Rating</Label>
                                </Col>
                                <Col md={{size:12}}>
                                    <Control.select model=".rating" name="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Label htmlFor="author" xs={12}>Your Name</Label>
                                <Col xs={12}>
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name" className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors className="text-danger" model=".author" show="touched"
                                        messages={{
                                            required: "Required.",
                                            minLength: " Must be greater than 3 characters",
                                            maxLength: " Must be 15 characters or less"
                                        }}
                                    />
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Label htmlFor="comment" xs={12}>Comments</Label>
                                <Col xs={12}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="6" className="form-control" 
                                        validators={{
                                            required
                                        }}
                                    />
                                    <Errors className="text-danger" model=".comment" show="touched"
                                        messages={{
                                            required: "Please give us a comment :("
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Button color="primary">Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}

const RenderDish = ({dish}) => {
    if(dish != null) {
        return (                        
            /*all the images are in baseurl/dishes/id*/  
            <FadeTransform in transformProps={{exitTransform: 'scale(0.5) translateY(-50%)'}}>
                <Card>
                    <CardImg width="100%" src={baseUrl + dish.image} alt={baseUrl + dish.name}/>
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        );
    } else {
        return( 
            <div></div>
        );
    }
}

const RenderComments = ({comments, postComment, dishId}) => {
    if(comments != null) {
        return (    
            <React.Fragment>
                <h4 className="m-3">Comments</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {comments.map(com => {
                            return (
                                <Fade in>
                                    <li key={com.id}>
                                        <p>{com.comment}</p>
                                        <p>
                                            {com.author}, 
                                            {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: '2-digit'})
                                            .format(new Date(Date.parse(com.date)))}
                                        </p>
                                    </li>
                                </Fade>
                                )
                            }
                        )}
                    </Stagger>
                </ul>
                <CommentForm dishId={dishId} postComment={postComment} />
            </React.Fragment>
        ); 

    }else {
        return( 
            <div></div>
        );
    }    
}

const DishDetail = props => {
    if(props.isLoading) {   
//loading display, if loading remember it all be coming from the json server
        return(
            <div className="container">
                <div className="row">
                    <Loading/>
                </div>
            </div>
        )
    }
    
//if it fails to load, an appropriate error msg
    else if(props.errorMsg) {
        return(
            <div className="container">
                <div className="row">
                    <h4>{props.errorMsg}</h4>
                </div>
            </div>
        )       
    }

    return (
        <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
            </div>
            
            <div className="row">
                <div className="col-md-5 m-1 col-12">
                    <RenderDish dish={props.dish}/>
                </div>
                <div className="col-md-5 m-1 col-12">
                    <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish.id}/>
                </div>
            </div>
        </div>
    )
}

export default DishDetail;