import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Card} from 'react-native-elements';
import {connect} from 'react-redux';
import {baseUrl} from '../shared/baseUrl';
import {Loading} from './LoadingComponent';
import Animated, { Easing } from 'react-native-reanimated';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        leaders: state.leaders,
        promotions: state.promotions
    }
}


function RenderItem(props) {
    const item = props.item;
    
    if(props.isLoading) {
        return <Loading />
    }

    else if(props.errMess) {
        return <View><Text>{props.errMess}</Text></View>
    }

    else {
        if(item != null) {
            return(//same as before, if theres a designation, there'll be a subtitle
                <Card featuredTitle={item.name} featuredSubtitle={item.designation} image={{uri: baseUrl + item.image}}>
                    <Text style={{margin: 10}}>
                        {item.description}
                    </Text>
                </Card>
            );
        } else {
            return <View></View>
        }
    }
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        //changing animatedValue from 0-8 within an 8s duration, and recall the function after finishing the animation
        //recursing
        this.animatedValue.setValue(0)
        Animated.timing(this.animatedValue, {
            toValue: 8,
            duration: 8000,
            easing: Easing.linear   //a method of animation
        }).start(() => this.animate())
    }

    render() {
        //x position of the item can be controlled here, when the animatedValue changes to values in the inputRange
        //the x coordinats move as such (0 mapped to 1200 movement of x)
        const xpos1 = this.animatedValue.interpolate({
            inputRange: [0, 1, 3, 5, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        })
        const xpos2 = this.animatedValue.interpolate({
            inputRange: [0, 2, 4, 6, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        })
        const xpos3 = this.animatedValue.interpolate({
            inputRange: [0, 3, 5, 7, 8],
            outputRange: [1200, 600, 0, -600, -1200 ]
        })

        return(
//*the xpos1 is used in the transform, which takes in an array, we specifiy the x translation to be of xpos1*//
//*so this cards x value of the top right corner will change according to the outputRange of xpos1, moving the card horiozontally*//
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <RenderItem item={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                        isLoading={this.props.dishes.isLoading}
                        erreMess={this.props.dishes.erreMess} 
                    />
                    <RenderItem item={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                        isLoading={this.props.promotions.isLoading}
                        erreMess={this.props.promotions.erreMess} 
                    />
                    <RenderItem item={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                        isLoading={this.props.leaders.isLoading}
                        erreMess={this.props.leaders.erreMess} 
                    />
            </View>
        )
    }
}

export default connect(mapStateToProps)(Home);