import React, {Component} from 'react';
import { Text, View, StyleSheet, Picker, Switch, Button, Modal, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import {Icon} from 'react-native-elements'
import * as Animatable from 'react-native-animatable';
import { ScrollView } from 'react-native-gesture-handler';

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

//calendar api
import * as Calendar from 'expo-calendar';

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: new Date(),
            showDateTime: false,
            mode: 'date'
        }
    }

    handleReservation() {
        Alert.alert(
            'Reservation',
            `Do you Confirm your Reservation?\nGeusts -${this.state.guests}\nSmoking? - ${this.state.smoking}\nDate - ${this.state.date}`,
            [
                {text: 'Cancel', onPress: () => this.resetForm()},
                {text: 'Confirm', 
                    onPress: () => {
                        this.presesentLocalNotification(this.state.date); this.resetForm(); this.addReservationToCalendar(this.state.date);
                    }
                },
            ],
            {cancelable: false}
        )
    }

    //obtain permission to access device calendar
    async obtainCalendarPermission () {
        let permissionStatus = await Calendar.requestCalendarPermissionsAsync();
        if(!permissionStatus === 'granted') {
            permissionStatus = await Calendar.requestCalendarPermissionsAsync();
            if(!permissionStatus === 'granted') {
                Alert.alert("Permission to access Calendar NOT granted");
            }
        }
        return permissionStatus;
    }

    //get devices default calendar ID
    async getDefaultCalendarId() {
        const calendars = await Calendar.getCalendarsAsync();
        const defaultCalendars = calendars.filter(each => each.source.name === 'Phone');
        return defaultCalendars[0].id;
    }

    //add reservation to device default calendar
    async addReservationToCalendar(date) {
        //convert start time to two hours ahead
        const endTime = new Date(Date.parse(date.toISOString()) + (2*60*60*1000))

        await this.obtainCalendarPermission();
        Calendar.createEventAsync(await this.getDefaultCalendarId(), {
            title: 'Con Fusion Table Reservation',
            startDate: date,
            endDate: endTime,
            timeZone: 'Asia/Hong_Kong',
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        })
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: new Date(),
            showDateTime: false,
            mode: 'date'
        }) 
    }

    //ask for permission asynchronously, and returns the permission
    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS)
        //if we didnt get permission, ask again
        if(permission.status !== 'granted') {
            permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS)
            //this time alert the user
            if(permission.status !== 'granted')
                Alert.alert("Permission not granted to show a notification")
        }
        return permission;
    }

    //date of our reservation
    async presesentLocalNotification(date) {
        await this.obtainNotificationPermission();
        //displaying of the notification on status bar
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation.',
            body: `Reservation for ${date} requested`,
            //ios and android specific (sound, title, body, data)
            ios: {  
                //notification sound
                sound: true
            },
            //android specific (vibrate, notif color, sticky notifs, icon, priority, link)
            android: {
                sound: true,
                vibrate: true,
                color: '#513da8'
            }
        })
    }

    render() {
        return(
            <Animatable.View duration={2000} delay={1000} animation="zoomIn">
                <ScrollView>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker style={styles.formItem} selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}
                        >
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                    </View>

                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/ Non-Smoking?</Text>
                        <Switch style={styles.formItem} value={this.state.smoking} trackColor="#512da8"
                            onValueChange={value => this.setState({smoking: value})}
                        >
                        </Switch>
                    </View>

                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>

                        <TouchableOpacity style={styles.formItem} onPress={() => this.setState({ showDateTime: true, mode: 'date' })}
                            style={{
                                padding: 7,
                                borderColor: '#512DA8',
                                borderWidth: 2,
                                flexDirection: "row"
                            }}     
                        >
                            <Icon type='font-awesome' name='calendar' color='#512DA8' />
                            <Text >{' ' + Moment(this.state.date).format('DD-MMM-YYYY h:mm A') }</Text>
                        </TouchableOpacity>

                        {this.state.showDateTime && 
                            <DateTimePicker value={this.state.date} mode={this.state.mode} minimumDate={new Date()} minuteInterval={30}
                                onChange={ (event, date) => {
                                    if (date === undefined) {
                                        this.setState({ showDateTime: false });
                                    }
                                    else {
                                        this.setState({
                                            showDateTime: this.state.mode === "time" ? false : true,
                                            mode: "time",
                                            date: new Date(date)
                                        });
                                    }
                                }}
                            />
                        }
                    </View>

                    <View>
                        <Button title="Reserve" color="#512da8" onPress={() => this.handleReservation()} />
                    </View>
                </ScrollView>
            </Animatable.View>
        )
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;