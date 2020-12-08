import React, { Component } from 'react';
import {Text, FlatList} from 'react-native';
import {Card, ListItem} from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {baseUrl} from '../shared/baseUrl';
import {Loading} from './LoadingComponent';
import * as Animatable from 'react-native-animatable';

//fetching leaders state from redux store
const mapStateToProps = state => {
    return {
        leaders: state.leaders
    }
}

function History() {
    return(
        <Card title="Our History">
            <Text style={{margin: 10}}>
                Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. 
                With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  
                Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.
            </Text>
            <Text style={{margin: 10}}>
                The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan.
            </Text>
        </Card>
    );
}

class About extends Component {
    renderLeader = ({item, index}) => {
        return (
            <ListItem hideChevron={true} key={index} leftAvatar={{source: { uri: baseUrl + item.image }}} 
            subtitle={item.description} title={item.name}/>
        );
    }

    render() {
        if(this.props.leaders.isLoading) {
            return (
                <ScrollView>
                    <History/>
                    <Card title="Cooperate Leadership">
                        <Loading />
                    </Card>
                </ScrollView>
            );
        }
        else if(this.props.leaders.errmess) {
            return (
                <ScrollView>
                    <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                        <History />
                        <Card title="Cooperate Leadership">
                            <Text>{this.props.leaders.errmess}</Text>
                        </Card>
                    </Animatable.View> 
                </ScrollView>
            )
        }
        else {
            return(
                <ScrollView>
                    <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>   
                        <History/>
                        <Card title="Cooperate Leadership">
                            <FlatList keyExtractor={item => item.id.toString()} data={this.props.leaders.leaders} renderItem={this.renderLeader}/>
                        </Card>
                    </Animatable.View>  
                </ScrollView>
            );
        }
    }
}

export default connect(mapStateToProps)(About);