import React, { Component } from 'react'
import { Text, StyleSheet, View, StatusBar, Dimensions, ImageBackground, Image, ScrollView, Button, Linking } from 'react-native'
import BG from '../Assets/img/bg2.png'
import Icon1 from 'react-native-vector-icons/Ionicons';
import PushNotification from "react-native-push-notification";
import OpenApplication from 'react-native-open-application';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

PushNotification.configure({
    onRegister: function (token) {
        console.log("TOKEN:", token);
    },

    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        OpenApplication.openApplication('com.tigasmos2');
    },

    onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);
    },

    onRegistrationError: function(err) {
        console.error(err.message, err);
    },

    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },

    popInitialNotification: true,
    requestPermissions: true,
});

export default class Dashboard extends Component {

    handlePush(){
        PushNotification.localNotification({
            ticker: "My Notification Ticker", // (optional)
            bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
            subText: "This is a subText", // (optional) default: none
            color: "red", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            title: "My Notification Title", // (optional)
            message: "My Notification Message", // (required)
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#0073BD"  />
                <ImageBackground source={BG} style={styles.image}>
                    <View style={{flexDirection:'row', justifyContent:"space-between", marginHorizontal:10, marginVertical:5, alignItems:"center"}}>
                        <Icon1.Button name="md-menu" backgroundColor="#0073BD" onPress={()=>{}} size={35} />
                        <Icon1.Button name="ios-notifications" backgroundColor="#0073BD" onPress={()=>{}} size={28} />
                    </View>
                    <View style={{alignItems:"center"}}>
                        <View style={styles.circle}>
                            <Text style={{color:'#fff', fontSize:26, fontWeight:'bold'}}>Heigh</Text>
                            <View style={{flexDirection:'row', margin:8}}>
                                <Text style={{color:'#fff', fontSize:42, fontWeight:'bold'}}>2.46</Text>
                                <Text style={{color:'#fff', fontSize:24, fontWeight:'bold', marginTop:23}}> m</Text>
                            </View>
                            <Text style={{color:'#fff', fontSize:18}}>Tide Gauge</Text>
                        </View>
                        <View style={{marginTop:35, marginBottom:20}}>
                            <Button
                                title="Press me"
                                onPress={() => {this.handlePush()}}
                            />
                            <Text style={{color:'#fff', fontSize:18}}>Tide Gauge Monitoring Station</Text>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.box}>
                            <Text style={styles.judul}>Tsunami Alert</Text>
                            <View style={{marginBottom:10, marginTop:8, justifyContent:"center", alignItems:"center", borderColor:"#ff7171", borderStyle:"dotted", borderWidth:4, padding:5, borderRadius:10 }}>
                                <Text style={{textAlign:"center"}}>Peringatan Dini TSUNAMI yang disebabkan oleh gempa Mag:7.1, 14-Nov-19 23:17:43 WIB, Sumber : BMKG</Text>
                            </View>
                            <Text style={styles.judul}>Recent Earthquake</Text>
                            <View style={{padding:8, marginTop:8, marginBottom:30, borderWidth:3, borderRadius:10, borderColor:'rgba(59,59,59,0.38)', borderStyle:"dotted"}}>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{height:20, width:20, marginRight:8, marginVertical:3}} source={{uri:'https://www.bmkg.go.id/asset/img/gempabumi/magnitude.png'}}/>
                                    <Text>Magnitudo : 3.0</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{height:20, width:20, marginRight:8, marginVertical:3}} source={{uri:'https://www.bmkg.go.id/asset/img/gempabumi/kedalaman.png'}}/>
                                    <Text>Kedalaman : 10 km</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{height:20, width:20, marginRight:8, marginVertical:3}} source={{uri:'https://www.bmkg.go.id/asset/img/gempabumi/koordinat.png'}}/>
                                    <Text>Lokasi : 3.65 LS - 128.37 BT</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{height:20, width:20, marginRight:8, marginVertical:3}} source={{uri:'https://www.bmkg.go.id/asset/img/gempabumi/lokasi.png'}}/>
                                    <Text>Pusat gempa berada di laut 22 km Timur Ambon</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{height:20, width:20, marginRight:8, marginVertical:3}} source={{uri:'https://www.bmkg.go.id/asset/img/gempabumi/wilayah-dirasakan.png'}}/>
                                    <Text>Dirasakan (Skala MMI): III Salahutu, II Ambon, II Haruku</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    
                </ImageBackground>   
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        // alignItems: "center",
        // justifyContent: "center"
    },
    circle:{
        marginTop:15,
        marginBottom:25,
        width:windowWidth*0.5,
        height:windowWidth*0.5,
        borderWidth:3,
        borderColor:"#fff",
        borderRadius:windowWidth*0.5/2,
        alignItems: "center",
        justifyContent: "center"
    },
    textDalam:{
        color:"#fff"
    },
    judul:{
        fontWeight:"bold",
        color:"#3b3b3b",
        fontSize:18
    },
    box:{
        padding:15,
        width:windowWidth*0.9,
        height:windowHeight*0.36,
        borderRadius:15,
        backgroundColor:"#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    }
})
