import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback} from 'reactstrap';
import {Link} from 'react-router-dom';                                         {/*to show error messages*/} 

/*in class components return must be inside render()*/
class Contact extends Component{
    constructor(props) {
        super(props);
        
        this.state = {
            firstname: '',
            lastname: '',
            telnum: '',
            email: '',
            agree: false,
            contactType: 'Tel.',
            message: '',
//we do this so that there's no unnecessary validations: if the user hasn't entered anything there's no need for validation
            touched: {              
                firstname: false,
                lastname: false,
                telnum: false,
                email: false
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this);       //binding necessary to access thru {this.function}
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.validate = this.validate.bind(this);
    }

    //*whenever we type anything, nothing shows on the browser, this is because the value's are tied to the State*//
    //*and since any change on the input box isn't reflected on the state we don't see anything*//

    //*in order to get data to display on the form we need to update the Input tags thru an onChange*//
    handleInputChange(event) {
        const target = event.target;
        //if target is a checkbox the value is in target.checked, for anything else its in target.value;
        const value = target.type === 'checkbox'? target.checked : target.value;
        //name attribute of each Input tag
        const name = target.name;

        //destructuring, since the targets name attribute and the states names are the same we can directly do this
        this.setState({
            [name]: value
        })
    }

    //the touched field will be set to true here, on blur of each message
    handleBlur = field => evt => {
        this.setState({
            touched: {...this.state.touched, [field]: true}
        })
    }

    //regular js validations
    validate(firstname, lastname, telnum, email) {
        const errors = {
            firstname: '',
            lastname: '',
            telnum: '',
            email: ''
        }

        if(this.state.touched.firstname && firstname.length < 3) errors.firstname = 'First Name should be longer than 3 characters';
        else if(this.state.touched.firstname && firstname.length > 10) errors.firstname = 'First Name should be shorter than 10 characters';

        if(this.state.touched.lastname && lastname.length < 3) errors.lastname = 'Last Name should be longer than 3 characters';
        else if(this.state.touched.lastname && lastname.length > 10) errors.lastname = 'Last Name should be shorter than 10 characters';

        //ONLY digits regex
        const reg = /^\d+$/;        
        if(this.state.touched.telnum && !reg.test(telnum)) errors.telnum = 'Tel Number should contain only digits';
        else if(this.state.touched.telnum && telnum.length < 10) errors.telnum = 'Invalid Telephone Number, please enter 10 digits';

        //valid email regex
        const emailReg = /^[a-z0-9]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
        //checking whether there's an @ sign (regex possible)
        if(this.state.touched.email && email.split('').filter(x => x === '@').length !== 1) errors.email = 'Emails must contain an @';
        else if(this.state.touched.email && !emailReg.test(email)) errors.email = 'Please enter a valid email';

        return errors;
    }

    handleSubmit(event) {
        console.log(this.state);
        event.preventDefault();
    }

    render() {
        const errors = this.validate(this.state.firstname, this.state.lastname, this.state.telnum, this.state.email);

        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home </Link></BreadcrumbItem>
                        <BreadcrumbItem active>Contact Us</BreadcrumbItem>
                    </Breadcrumb>
                </div>


                <div className="row row-content">
                    <div className="col-12">
                        <h3>Location Information</h3>
                    </div>

                    <div className="col-12 col-sm-4 offset-sm-1">
                            <h5>Our Address</h5>
                            <address>
                            121, Clear Water Bay Road<br />
                            Clear Water Bay, Kowloon<br />
                            HONG KONG<br />
                            <i className="fa fa-phone"></i>: +852 1234 5678<br />
                            <i className="fa fa-fax"></i>: +852 8765 4321<br />
                            <i className="fa fa-envelope"></i>: <a href="mailto:confusion@food.net">confusion@food.net</a>
                            </address>
                    </div>

                    <div className="col-12 col-sm-6 offset-sm-1">
                        <h5>Map of our Location</h5>
                    </div>

                    <div className="col-12 col-sm-11 offset-sm-1">
                        <div className="btn-group" role="group">
                            <a role="button" className="btn btn-primary" href="tel:+85212345678"><i className="fa fa-phone"></i> Call</a>
                            <a role="button" className="btn btn-info"><i className="fa fa-skype"></i> Skype</a>
                            <a role="button" className="btn btn-success" href="mailto:confusion@food.net"><i className="fa fa-envelope-o"></i> Email</a>
                        </div>
                    </div>
                </div>


                <div className="row row-content">
                    <div className="col-12">
                        <h3>Send us your feedback</h3>
                    </div>

                    <div className="col-12 col-md-9">
                        {/*again, we're using reacts-bootstrap instead of regular html*/}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup row>
                                {/*cuz of js for loop*/}
                                <Label htmlFor="firstname" md={2}>First Name</Label>
                                
                                {/*same as div classname col-md-10*/}
                                <Col md={10}>
                                    {/*
                                    controlled input, cuz the value is tied with our state, so whatever changes that
                                    takes place is reflected on our state
                                    */}
                                    <Input type="text" id="firstname" name="firstname" placeholder="First Name" value={this.state.firstname}
                                    valid={errors.firstname===''} invalid={errors.firstname!==''} onChange={this.handleInputChange} 
                                    onBlur={this.handleBlur('firstname')}/>
                                    {/*so upon any change to any Input we must handle it, so that it displays*/}
                                    {/*onBlur happens when you click on the text field.*/}
                                    {/*The valid and invalid properties are needed for the red and green borders and to display FormFeedback*/}

                                    {/*displays the error right below the Input box*/}
                                    <FormFeedback>{errors.firstname}</FormFeedback>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label htmlFor="lastname" md={2}>last Name</Label>     
                                <Col md={10}>
                                    <Input type="text" id="lastname" name="lastname" placeholder="Last Name" value={this.state.lastname}
                                    valid={errors.lastname===''} invalid={errors.lastname!==''}  onChange={this.handleInputChange} 
                                    onBlur={this.handleBlur('lastname')}/>

                                    <FormFeedback>{errors.lastname}</FormFeedback> 
                                </Col>  
                            </FormGroup>

                            <FormGroup row>
                                <Label htmlFor="telnum" md={2}>Contact Tel.</Label>     
                                <Col md={10}>
                                    <Input type="tel" id="telnum" name="telnum" placeholder="Tel. Number" value={this.state.telnum}
                                    valid={errors.telnum===''} invalid={errors.telnum!==''} onChange={this.handleInputChange} 
                                    onBlur={this.handleBlur('telnum')}/>

                                    <FormFeedback>{errors.telnum}</FormFeedback>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label htmlFor="email" md={2}>Email</Label>     
                                <Col md={10}>
                                    <Input type="email" id="email" name="email" placeholder="Email" value={this.state.email}
                                    valid={errors.email===''} invalid={errors.email!==''} onChange={this.handleInputChange} 
                                    onBlur={this.handleBlur('email')}/>

                                    <FormFeedback>{errors.email}</FormFeedback> 
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                {/*passing js objects. Take 6 columns with a 2 offset*/}
                                <Col md={{size: 6, offset: 2}}>
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="checkbox" name="agree" checked={this.state.agree}
                                            onChange={this.handleInputChange}/> {' '}
                                            <strong>May we contact you?</strong>
                                        </Label>
                                    </FormGroup>
                                </Col>

                                <Col md={{size: 3, offset: 1}}>
                                    <Input type="select" name="contactType" value={this.state.contactType}
                                    onChange={this.handleInputChange}>
                                        <option>Tel.</option>
                                        <option>Email</option>
                                    </Input>    {/*reactstrap's input component has all the input types*/}
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label htmlFor="message" md={2}>Your Feedback</Label>     
                                <Col md={10}>
                                    <Input type="textarea" id="message" name="message" rows="12"
                                    value={this.state.message} onChange={this.handleInputChange}/>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Col md={{size: 10, offset:2}}>
                                    <Button type="submit" color="primary">Send Feedback</Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Contact;