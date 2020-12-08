import React, { Component } from 'react';
import {FlatList, View, Text} from 'react-native';    //flatlist is a regular list
import {Tile} from 'react-native-elements'; //list items
import {connect} from 'react-redux';
import {baseUrl} from '../shared/baseUrl';
import {Loading} from './LoadingComponent';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes
    }
}


class Menu extends Component {
    render() {
        //item holds each dish, index is what is supplied by the keyExtractor
        renderMenuItem = ({item, index}) => {
            return (                    //all from the json
                //animatable api from react, so much more easier, takes in animation type and duration of animation
                <Animatable.View animation="fadeInRightBig" duration={2000}>
                    <Tile onPress={() => navigate('DishDetail', { dishId: item.id })} key={index} title={item.name} 
                        caption={item.description} featured imageSrc={{uri: baseUrl + item.image}}
                    /> 
                </Animatable.View>      
            )      
        }

        //whenever we use react navigation the navigate prop is passed as well
        const { navigate } = this.props.navigation;
        
        if(this.props.dishes.isLoading) {
            return <Loading />
        }
        else if(this.props.dishes.errmess) {
            return <View><Text>{this.props.dishes.errmess}</Text></View>
        }
        else {
            return (
                //iterates thru the entire dishes object in our json, and render each item
                <FlatList keyExtractor={item => item.id.toString()} data={this.props.dishes.dishes} renderItem={renderMenuItem}/>
            )   //keyExtractor takes finds unique identifier in data attribute, in our case each item has an id  
        }       //its required to be converted into a string, so that has been done
    }      
}                   

export default connect(mapStateToProps)(Menu);