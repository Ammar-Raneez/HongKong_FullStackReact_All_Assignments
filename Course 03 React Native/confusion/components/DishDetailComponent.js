import React, { Component } from 'react';
import { Text, View, Modal, Button, PanResponder, Alert, Share } from 'react-native';
import { Card, Icon, Rating } from 'react-native-elements';
import { ScrollView, FlatList, TextInput } from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {baseUrl} from '../shared/baseUrl';
import {postFavorite, postComment} from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})


function RenderDish(props) {
    const dish = props.dish;
    let view;

    const handleViewRef = ref => view = ref; 

    //share
    const shareDish = (title, message, url) => {
        Share.share({
            title: title,   //title
            message: `${title} : ${message} ${url}`,    //body of the message
            url: url        //enables us to put info into the shared app, in this case the url we share is the images location
        }, {dialogTitle: `Share ${title}`}  //the pop up that shows up
        )
    }

    const recognizeDrag = ({moveX, moveY, dx, dy}) => {
        if(dx < -200) return true;
        return false;
    }

    const recognizeComment = ({moveX, moveY, dx, dy}) => {
        if(dx > 200) return true;
        return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },

        onPanResponderGrant: () => {
            view.rubberBand(1000)
                .then(endState => console.log(endState.finished? 'Finished' : 'cancelled'))
        },

        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState))
                Alert.alert(    
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );

                else if(recognizeComment(gestureState)) props.toggleModal()

            return true;
        }
    })

        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000} {...panResponder.panHandlers} ref={handleViewRef}>
                    <Card featuredTitle={dish.name} image={{uri: baseUrl + dish.image}}>
                        <Text style={{margin: 10}}>
                            {dish.description}
                        </Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Icon raised reverse name={props.favorite ? 'heart': 'heart-o'} type="font-awesome" color='#f50'
                                onPress={() => props.favorite ? console.log('Already Favorited') : props.onPress()}
                            />
                            <Icon raised reverse name="pencil" type="font-awesome" color="#512da8" onPress={() => props.toggleModal()} />
                            <Icon raised reverse name="share" type="font-awesome" color="#51d2a8" onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                        </View>

                        <Modal animationType={'fade'} transparent={false} visible={props.showModal}>
                            <View>
                                <Rating fractions={0} showRating onFinishRating={props.onRatingChange} />
                                <View style={{flexDirection: 'row'}}>
                                    <Icon style={{padding: 10}} type="font-awesome" name="user" size={20} color="#444" />
                                    <TextInput placeholder="Author" value={props.author} onChange={event => props.onAuthorChange(event)} />
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                    <Icon style={{padding: 7}} type="font-awesome" name="comment" size={20} color="#444" />
                                    <TextInput placeholder="Comment" value={props.comment} onChange={event => props.onCommentChange(event)} />
                                </View>

                                <View style={{padding: 10}}>
                                    <Button onPress = {() =>{props.handleSubmit()}} color="#512DA8" title="SUBMIT" />
                                    <Button onPress = {() =>{props.toggleModal(); props.resetForm();}} color="#444" title="CANCEL" />
                                </View>
                            </View>
                        </Modal>
                    </Card>
                </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({item, index}) => {
        return (
            <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
                <View key={index} style={{margin: 10}}>
                    <Text style={{fontSize: 14}}>{item.comment}</Text>
                    <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                    <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
                </View>
            </Animatable.View>
        );
    };
    
    return (
        <Card title='Comments'>
            <FlatList data={comments} renderItem={renderCommentItem} keyExtractor={item => item.id.toString()} />
        </Card>
    );
}

class DishDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating: '',
            author: '',
            comment: ''
        }
    }

    toggleModal = () => {
        this.setState({showModal: !this.state.showModal})
    }
    resetForm = () => {
        this.state = {
            showModal: false,
            rating: '',
            author: '',
            comment: ''
        }
    }

    onAuthorChange = event => {
        this.setState({author: event.nativeEvent.text})
    }
    onCommentChange = event => {
        this.setState({comment: event.nativeEvent.text})
    }
    onRatingChange = value => {
        this.setState({rating: value})
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId)
    }

    addComment(dishId, rating, author, comment) {
        this.props.postComment(dishId, rating, author, comment);
    }

    handleSubmit(dishId) {
        this.toggleModal();
        this.addComment(dishId, this.state.rating, this.state.author, this.state.comment)
        this.resetForm();
    }

    render() {
        const dishId = this.props.route.params.dishId;
        return(  
            <ScrollView>
                <RenderDish favorite={this.props.favorites.some(element => element === dishId)} 
                    dish={this.props.dishes.dishes[+dishId]} 
                    onPress={() => this.markFavorite(dishId)} 
                    resetForm={() => this.resetForm()} toggleModal={() => this.toggleModal()} showModal={this.state.showModal}
                    rating={this.state.rating} onRatingChange={value => this.onRatingChange(value)}
                    author={this.state.author} onAuthorChange={event => this.onAuthorChange(event)} 
                    comment={this.state.comment} onCommentChange={event => this.onCommentChange(event)}
                    handleSubmit={ () => this.handleSubmit(dishId)}
                />
                <RenderComments comments={this.props.comments.comments.filter(comment => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);