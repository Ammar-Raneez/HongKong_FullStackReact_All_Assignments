import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ListItem } from 'react-native-elements';
import { Loading } from './LoadingComponent';
import { View, Text, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {baseUrl} from '../shared/baseUrl';
import {deleteFavorite} from '../redux/ActionCreators';
import Swipeout from 'react-native-swipeout';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    deleteFavorite: dishId => dispatch(deleteFavorite(dishId))
})

class Favorites extends Component {
    render() {
        const { navigate } = this.props.navigation;

        const renderMenuItem = ({item, index}) => {
            //swipeout buttons
            const rightButton = [
                {
                    text: 'Delete', 
                    type: 'delete',
                    onPress: () => {   //alert header       //alert message 
                        Alert.alert('Delete Favorite?', `Are you sure you wish to Delete this Favorite Dish ${item.name}? `,
                            //buttons in alert
                            [   //cancel button, confirm button, cancel only if onPress of confirm    
                                {text: 'Cancel', onPress: () => console.log(`${item.name} Not Deleted`), style: 'cancel'},
                                {text: 'Confirm', onPress: () => this.props.deleteFavorite(item.id), style: 'destructive'}
                            ],
                            //this makes certain that there cant be any other way to cancel the alert dialog unless
                            //clicked cancel/ confirm explicitly
                            {cancelable: false}
                        )
                    }
                }
            ]

            return (     
                //upon clicking, automatically close the swipeout
                <Swipeout right={rightButton} autoClose={true}>
                    <Animatable.View animation="fadeInRightBig" duration={2000}>
                        <ListItem onPress={() => navigate('DishDetail', { dishId: item.id })} key={index} title={item.name} 
                            subtitle={item.description} hideChevron={true} leftAvatar={{ source : {uri: baseUrl + item.image}}}
                        /> 
                    </Animatable.View>
                </Swipeout>
            )      
        }

        if(this.props.isLoading) {
            return <Loading />
        }
        else if(this.props.errmess) {
            return <View><Text>{this.props.dishes.errmess}</Text></View>
        }
        else {
            return (
                //if dish.id exists in favorites array, some returns true, and filter will return that dish that returned true
                <FlatList keyExtractor={item => item.id.toString()} 
                    data={this.props.dishes.dishes.filter(dish => this.props.favorites.some(element => element === dish.id))} 
                    renderItem={renderMenuItem}
                />
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);