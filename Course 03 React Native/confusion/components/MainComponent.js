import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';

import Home from './HomeComponent';
import Menu from './MenuComponent';
import DishDetail from './DishDetailComponent';
import Reservation from './ReservationComponent';
import About from './AboutComponent';
import Contact from './ContactComponent';
import Favorites from './FavoriteComponent';
import LoginTabs from './LoginComponent';
import {Icon} from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { View, Image, Text, StyleSheet, ToastAndroid } from 'react-native';

import {connect} from 'react-redux';
import {fetchDishes, fetchComments, fetchPromotions, fetchLeaders} from '../redux/ActionCreators';

//for handling network connectivities
import NetInfo from "@react-native-community/netinfo";

const mapStateToProps = state => {
    return {
        
    }
}

const mapDispatchToProps = dispatch => ({
    fetchDishes: () => dispatch(fetchDishes()),
    fetchLeaders: () => dispatch(fetchLeaders()),
    fetchComments: () => dispatch(fetchComments()),
    fetchPromotions: () => dispatch(fetchPromotions()),
})


const stackNavigator = createStackNavigator();

const headerOptions = {
    headerStyle: {
        backgroundColor: "#512DA8"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
        color: "#fff"            
    }
};

const CustomerDrawerContentComponent = props => {
    return (
        <ScrollView>
            {/*customized header of drawer navigator*/}
            <View style={styles.drawerHeader}>
                <View style={{flex: 1}}>
                    <Image source={require('./images/logo.png')} style={styles.drawerImage}/>
                </View>
                <View style={{flex: 2}}>
                    <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
                </View>
            </View>
            <DrawerItemList {...props} />
        </ScrollView>
        /*adds all the props into a drawerItemList component, this displays the navigation elements below the customized header*/
    )
}

function MenuNavigatorScreen() {
    return(
        <stackNavigator.Navigator initialRouteName='Menu' screenOptions= {headerOptions}>
            <stackNavigator.Screen name="Menu" component={Menu} 
                options={({navigation}) => ({
                    headerLeft: () => (
                        <Icon name="menu" size={24} color={"#fff"} onPress={() => navigation.toggleDrawer()} />
                    )
                })}
            />
            <stackNavigator.Screen name="DishDetail" component={DishDetail} options={{ headerTitle: "Dish Detail"}}/>  
        </stackNavigator.Navigator>
    );
}

function HomeNavigatorScreen() {
    return(
        <stackNavigator.Navigator screenOptions={headerOptions}>
            <stackNavigator.Screen name="Home" component={Home}
                options={({navigation}) => ({
                    headerLeft: () => (
                        <Icon name="menu" size={24} color={"#fff"} onPress={() => navigation.toggleDrawer()} />
                    )
                })}
            />
        </stackNavigator.Navigator>
    )
}

function AboutNavigatorScreen() {
    return(
        <stackNavigator.Navigator screenOptions={headerOptions}>
            <stackNavigator.Screen name="About Us" component={About}
                options={({navigation}) => ({
                    //hamburger menu icon on top left corner
                    headerLeft: () => (
                        <Icon name="menu" size={24} color={"#fff"} onPress={() => navigation.toggleDrawer()} />
                    )
                })}
            />
        </stackNavigator.Navigator>    
    )
}

function ContactNavigatorScreen() {
    return(
        <stackNavigator.Navigator screenOptions={headerOptions}>
            <stackNavigator.Screen name="Contact Us" component={Contact}
                options={({navigation}) => ({
                    headerLeft: () => (
                        <Icon name="menu" size={24} color={"#fff"} onPress={() => navigation.toggleDrawer()} />
                    )
                })}
            />
        </stackNavigator.Navigator>    
    )
}

function ReservationNavigatorScreen() {
    return(
        <stackNavigator.Navigator screenOptions={headerOptions}>
            <stackNavigator.Screen name="Reservation" component={Reservation}
                options={({navigation}) => ({
                    headerLeft: () => (
                        <Icon name="menu" size={24} color={"#fff"} onPress={() => navigation.toggleDrawer()} />
                    )
                })}
            />
        </stackNavigator.Navigator>    
    )
}

function FavoritesNavigatorScreen() {
    return(
        <stackNavigator.Navigator screenOptions={headerOptions}>
            <stackNavigator.Screen name="Favorites" component={Favorites}
                options={({navigation}) => ({
                    headerLeft: () => (
                        <Icon name="menu" size={24} color={"#fff"} onPress={() => navigation.toggleDrawer()} />
                    )
                })}
            />
        </stackNavigator.Navigator>    
    )
}

function LoginNavigatorScreen() {
    return(
        <stackNavigator.Navigator screenOptions={headerOptions}>
            <stackNavigator.Screen name="Login/ Register" component={LoginTabs}
                options={({navigation}) => ({
                    headerLeft: () => (
                        <Icon name="menu" size={24} color={"#fff"} onPress={() => navigation.toggleDrawer()} />
                    )
                })}
            />
        </stackNavigator.Navigator>    
    )
}

const mainDrawNavigator = createDrawerNavigator();

function MainNavigationScreen() {
    return(/*passing through all the props separately into the component*/
        <mainDrawNavigator.Navigator drawerStyle={{backgroundColor: '#d1c4e9'}} initialRouteName="Home"
            drawerContent={props => <CustomerDrawerContentComponent{...props}/>} 
        >   
            <mainDrawNavigator.Screen name="Login" component={LoginNavigatorScreen}
                options={{
                    drawerIcon: ({color}) => (
                        <Icon name="arrow-right" type="font-awesome" size={24} color={color} />
                    )
                }}
            />
            <mainDrawNavigator.Screen name="Home" component={HomeNavigatorScreen}
                options={{
                    //icon in the drawer navigator
                    drawerIcon: ({color}) => (
                        <Icon name="home" type="font-awesome" size={24} color={color} />
                    )
                }}
            />
            <mainDrawNavigator.Screen name="About Us" component={AboutNavigatorScreen} 
                options={{
                    drawerIcon: ({color}) => (
                        <Icon name="info-circle" type="font-awesome" size={24} color={color} />
                    )
                }}
            />
            <mainDrawNavigator.Screen name="Menu" component={MenuNavigatorScreen}
                options={{
                    drawerIcon: ({color}) => (
                        <Icon name="list" type="font-awesome" size={24} color={color} />
                    )
                }}
            />
            <mainDrawNavigator.Screen name="My Favorites" component={FavoritesNavigatorScreen} 
                options={{
                    drawerIcon: ({color}) => (
                        <Icon name="heart" type="font-awesome" size={24} color={color} />
                    )
                }}
            />
            <mainDrawNavigator.Screen name="Reserve Table" component={ReservationNavigatorScreen} 
                options={{
                    drawerIcon: ({color}) => (
                        <Icon name="cutlery" type="font-awesome" size={24} color={color} />
                    )
                }}
            />
            <mainDrawNavigator.Screen name="Contact Us" component={ContactNavigatorScreen} 
                options={{
                    drawerIcon: ({color}) => (
                        <Icon name="address-card" type="font-awesome" size={24} color={color} />
                    )
                }}
            />
        </mainDrawNavigator.Navigator>
    )
}

class Main extends Component {
    //upon mouting of the component we dispatch the events to action creators that fetch the data from the 
    //json server
    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchLeaders();
        this.props.fetchPromotions();

        NetInfo.fetch(connectionInfo => {//type - wifi, cellular, none  effectiveType - 4g, 3g...
                ToastAndroid.show(`Initial Network Connectivity Types: ${connectionInfo.type}, Effective Type: ${connectionInfo.effectiveType}`),
                ToastAndroid.LONG;  //long duration popup
            })
            //whenever there's a connection change, this is called
        NetInfo.addEventListener(connectionChange => this.handleConnectivityChange(connectionChange));
    }

    //whenever you register an event listener you must also remove it, right after component is unmounted, remove it
    componentWillUnmount() {
        NetInfo.removeEventListener(connectionChange => this.handleConnectivityChange(connectionChange));
    }

    handleConnectivityChange(connectionInfo) {
        switch (connectionInfo.type) {
            case 'none':
                ToastAndroid.show('You are now offline!', ToastAndroid.LONG);
                break;
            case 'wifi':
                ToastAndroid.show('You are now connected to WiFi!', ToastAndroid.LONG);
                break;
            case 'cellular':
                ToastAndroid.show('You are now connected to Cellular!', ToastAndroid.LONG);
                break;
            case 'unknown':
                ToastAndroid.show('You now have an unknown connection!', ToastAndroid.LONG);
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <NavigationContainer>
                <MainNavigationScreen/>           
            </NavigationContainer>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawerHeader: {
        backgroundColor: '#512DA8',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    drawerHeaderText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    drawerImage: {
        margin: 10,
        width: 80,
        height: 60
    }    
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);