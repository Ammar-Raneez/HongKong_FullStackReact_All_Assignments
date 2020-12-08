import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input, CheckBox, Button, Icon } from 'react-native-elements';
import {baseUrl} from '../shared/baseUrl';

//secureStore gonna used to store login info
import * as SecureStore from 'expo-secure-store';
import * as Permissions from 'expo-permissions';

//image picker, allows us to pick an image either through the current gallery, or thru the camera
import * as ImagePicker from 'expo-image-picker';

//image manupilator
import * as ImageManipulator from "expo-image-manipulator";

//bottom tab navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native-animatable';



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    componentDidMount() {
        //get userinfo field from secureStore
        try {
            SecureStore.getItemAsync('userinfo')
                .then(userdata => {
                    //the data returned is in json string format, in order to manupilate it we need to parse it
                    let userinfo = JSON.parse(userdata);
                    if(userinfo) {
                        this.setState({username: userinfo.username, password: userinfo.password, remember: true})
                    }
                })
                .catch(error => console.log(error))
        }catch{error => console.log(error)}
    }

    handeLogin() {
        console.log(JSON.stringify(this.state));
        //save into secureStore only if checked
        if(this.state.remember) {
            //obv must be same name as the key we specified in componentDidMount
            SecureStore.setItemAsync('userinfo', JSON.stringify({username: this.state.username, password: this.state.password}))
                .catch(error => console.log("Could not save user " + error))
        //if decided not to save, delete it
        } else {
            SecureStore.deleteItemAsync('userinfo')
                .catch(error => console.log("Could not delete user " + error))
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Input placeholder="Username" leftIcon={{type: 'font-awesome', name: "user"}}
                    onChangeText={username => this.setState({username})} value={this.state.username}  
                />
                {/*since same name variables can destructure username: usernamt to just username*/}
                <Input placeholder="Password" leftIcon={{type: 'font-awesome', name: "key"}}
                    onChangeText={password => this.setState({password})} value={this.state.password}  
                />                                 
                <CheckBox title="Remember Me" center checked={this.state.remember}
                    onPress={() => this.setState({remember: !this.state.remember})}
                />
                <View style={styles.formButton}>
                    <Button icon={<Icon name="arrow-right" type="font-awesome" color="#fff" size={24} />} onPress={() => this.handeLogin()} 
                        title="login" color="#512da8" 
                    />               
                </View>
                <View style={styles.formButton}>
                    <Button clear icon={<Icon name="user-plus" type="font-awesome" color="#fff" size={24} />} 
                        onPress={() => this.props.navigation.navigate('Register')} title="Register" titleStyle={{color: 'blue'}}
                    />               
                </View>
            </View>
        );
    }
}


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            imageUrl: baseUrl + 'images/logo.png',
            remember: false
        }
    }

    getImageFromGallery = async () => {
        const cameraRollForIOSPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if(cameraRollForIOSPermission.status == 'granted') {
            let chosenImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            })
            if(!chosenImage.cancelled) {
                this.processImage(chosenImage.uri)
            }
        }
    }

    getImageFromCamera = async () => {
        //camera permission in general
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        //this permission is required for ios
        const cameraRollPermission =await Permissions.askAsync(Permissions.CAMERA_ROLL);

        //if given permission, we can launch the camera
        if(cameraPermission.status === 'granted' && cameraRollPermission.status === "granted") {
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,    //allow editing upon capture
                aspect: [4,3]   //store image w this aspect ratio
            });
            //if user cancelled the camera during the image is processing we should not do anything
            if(!capturedImage.cancelled) {
                //capturedImage returns an uri, which tells the location of the image in the device memory
                this.processImage(capturedImage.uri);
            }
        }
    }

    //same handler to save the username and password
    handeRegister() {
        if(this.state.remember) {
            SecureStore.setItemAsync('userinfo', JSON.stringify({username: this.state.username, password: this.state.password}))
                .catch((error) => console.log('Could not save user info', error));        }
    }

    //manupilate our image
    processImage = async imageUri => {
        console.log(imageUri)
        let processedImage = await ImageManipulator.manipulateAsync(
            imageUri, 
            [
                {resize: {width: 400}}      //we dont need a very high resolution image (raw from our camera)
            ],
            {format: 'png'}
        );
        console.log(processedImage);
        this.setState({imageUrl: processedImage.uri }); //override the raw imageUrl with the processed one
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image source={{uri : this.state.imageUrl }} loadingIndicatorSource={require('./images/logo.png')} style={styles.image} />
                        <Button title="Camera" onPress={this.getImageFromCamera} />
                        <Button title="Gallery" onPress={this.getImageFromGallery} />
                    </View>
                    <Input placeholder="Firstname" leftIcon={{type: 'font-awesome', name: "user"}}
                        onChangeText={firstname => this.setState({firstname})} value={this.state.firstname}  
                    />
                    <Input placeholder="Lastname" leftIcon={{type: 'font-awesome', name: "user"}}
                        onChangeText={lastname => this.setState({lastname})} value={this.state.lastname}  
                    />
                    <Input placeholder="Email" leftIcon={{type: 'font-awesome', name: "envelope-o"}}
                        onChangeText={email => this.setState({email})} value={this.state.email}  
                    />
                    <Input placeholder="Username" leftIcon={{type: 'font-awesome', name: "user"}}
                        onChangeText={username => this.setState({username})} value={this.state.username}  
                    />
                    <Input placeholder="Password" leftIcon={{type: 'font-awesome', name: "key"}}
                        onChangeText={password => this.setState({password})} value={this.state.password}  
                    />                                 
                    <CheckBox title="Remember Me" center checked={this.state.remember}
                        onPress={() => this.setState({remember: !this.state.remember})}
                    />
                    <View style={styles.formButton}>
                        <Button icon={<Icon name="user-plus" type="font-awesome" color="#fff" size={24} />} onPress={() => this.handeRegister()} 
                            title="Register" color="#512da8" 
                        />
                    </View>
                </View>     
            </ScrollView>  
        )
    }
}

const bottomTabNavigator = createBottomTabNavigator();

function LoginTabs() {
    return (
        <bottomTabNavigator.Navigator initialRouteName="Login" 
            tabBarOptions={{activeBackgroundColor: '#9575CD',inactiveBackgroundColor: '#D1C4E9', activeTintColor: '#ffffff', inactiveTintColor: 'gray'}}
        >
            <bottomTabNavigator.Screen name="Login" component={Login} 
                options={{tabBarIcon: ({tintColor}) => (<Icon name="arrow-right" type="font-awesome" size={24} iconStyle={{color: tintColor}} />)}}
            />
            <bottomTabNavigator.Screen name="Register" component={Register} 
                options={{tabBarIcon: ({tintColor}) => (<Icon name="user-plus" type="font-awesome" size={24} iconStyle={{color: tintColor}} />)}}
            />
        </bottomTabNavigator.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 20,
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 20
    },
    image: {
        margin: 10,
        width: 80,
        height: 60
    },
    formCheckbox: {
        margin: 40,
        backgroundColor: null
    },
    formButton: {
        margin: 60
    }
});

export default LoginTabs;
