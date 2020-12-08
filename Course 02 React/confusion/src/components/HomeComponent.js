import React from 'react';
import {Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle} from 'reactstrap';
import {Loading} from "./LoadingComponent";

//we gonna fetch everything from the json server
import { baseUrl } from '../shared/baseUrl';

import {FadeTransform} from 'react-animation-components'

const RenderCard = ({item, isLoading, errorMsg}) => {
    if(isLoading) {
        return(
            <Loading/>
        )
    }
    else if(errorMsg) {
        return(
            <h4>{errorMsg}</h4>
        )
    }
    return (
        <FadeTransform in transformProps={{exitTransform: 'scale(0.5) translateY(-50%)'}}>
            <Card>
                <CardBody>
                <CardImg src={baseUrl + item.image} alt={item.name} />
                    <CardTitle>{item.name}</CardTitle>
                    {item.designation ? <CardSubtitle>{item.designation}</CardSubtitle>: null}
                    <CardText>{item.description}</CardText>
                </CardBody>
            </Card>
        </FadeTransform>    
    )
}

//home and default page
const Home = props => {
    return (
        <div className="container">
            <div className="row align-items-start">
                <div className="col-12 col-md m-1">
                    <RenderCard item={props.dish} isLoading={props.dishesLoading} errorMsg={props.dishesErrorMsg}/>
                </div>
                <div className="col-12 col-md m-1">
                    <RenderCard item={props.promotion} isLoading={props.promoLoading} errorMsg={props.promoErrorMsg}/>
                </div>
                <div className="col-12 col-md m-1">
                    <RenderCard item={props.leader} isLoading={props.leaderLoading} errorMsg={props.leaderErrorMsg}/>
                </div>
            </div>
        </div>
    )
}

export default Home;