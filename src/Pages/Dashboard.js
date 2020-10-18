import React, { Component } from 'react'
import { Text, StyleSheet, View, StatusBar, Dimensions, ImageBackground, Image, ScrollView, TouchableOpacity, Alert } from 'react-native'
import BG from '../Assets/img/bg2.png'
import Icon1 from 'react-native-vector-icons/Ionicons';
import PushNotification from "react-native-push-notification";
import OpenApplication from 'react-native-open-application';
import Axios from 'axios'
import moment from 'moment'
import socketIOClient from 'socket.io-client'
var parseString = require('react-native-xml2js').parseString;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const dateNow = moment().format("D/MM/YYYY")

const Tsunami = (props) => {
    if(props.tgl==dateNow){
        return(
            <Text>{props.data}</Text>
        )
    }else{
        return(
            <Text>None</Text>
        )
    }
}

function IconWithBadge({ name, badgeCount, color, size, }) {
    return (
        <View style={{ width: 24, height: 24, marginRight:10 }}>
            <Icon1 name={name} size={size} color="white" backgroundColor="#0073BD" />
            {badgeCount > 0 && (
            <View
                style={{
                // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
                    position: 'absolute',
                    right: -6,
                    top: -5,
                    backgroundColor: '#f44336',
                    borderRadius: 6,
                    width: 12,
                    height: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                {badgeCount}
            </Text>
            </View>
        )}
        </View>
    );
}
function HomeIconWithBadge(props) {
    return <IconWithBadge {...props} badgeCount={props.value} />;
}

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

    state={
        notifNow:"None",
        gempaTerkini:{},
        badge:0,
        notif:[{desc:'None'}],
        site:[{
            pasut:0
        }]
    }

    handlePush(){
            PushNotification.localNotification({
                bigText: this.state.notifNow, // (optional) default: "message" prop
                vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                title: "Tsunami Alert", // (optional)
                message: "Telah Terjadi Tsunami", // (required)
            });
    }

    handleClickNotif(){
        Alert.alert(
            "Tsunami Alert",
            this.state.notifNow,
            [
                {
                    text: "Cancel",
                    onPress: () => this.setState({...this.state, badge:this.state.badge}),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.setState({...this.state, badge:0}) }
            ],
            { cancelable: false }
        );
    }

    componentDidMount(){
        Axios.get(`http://139.180.220.65:5000/api/notif`)
                    .then((val)=>{
                        let data = val.data.datas
                        this.setState({...this.state, notif:data})
                        if(moment(data[data.length-1].date).format("D/MM/YYYY")==dateNow){
                            this.setState({...this.state, badge:this.state.badge+1})
                            this.setState({...this.state, notifNow:data[data.length-1].desc})
                        }else{
                            this.setState({...this.state, notifNow:"None"})
                        }                       
                    })
        Axios.get(`http://139.180.220.65:5000/api/site`)
                    .then((val)=>{
                        let data = val.data.datas
                        this.setState({...this.state, site:data})                        
                    })
        Axios.get('https://data.bmkg.go.id/gempadirasakan.xml')
                    .then((val)=>{
                        parseString(val.data, (err, result)=>{
                            let data = result.Infogempa.Gempa[0]
                            this.setState({...this.state, gempaTerkini:data})
                        })
                    }) 
        let io = socketIOClient("http://139.180.220.65:5000")
        io.on("site", (data) => {
            this.state.site.push(data)
            this.setState({...this.state, site:this.state.site})
        })
        io.on("notif", (data) => {
            // console.log(data)
            this.setState({...this.state, notifNow:data.desc})
            this.state.notif.push(data)
            this.setState({...this.state, notif:this.state.notif})
            if(moment(data.date).format("D/MM/YYYY")==dateNow){
                this.setState({...this.state, badge:this.state.badge+1})
                this.setState({...this.state, notifNow:data.desc})
                this.handlePush()
            }else{
                this.setState({...this.state, notifNow:"None"})
            }     
        })
        
    }
    
    render() {
        // console.log(this.state.notif[this.state.notif.length-1])
        // console.log(moment(this.state.notif[this.state.notif.length-1].date).format("D/MM/YYYY"))
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#0073BD"  />
                <ImageBackground source={BG} style={styles.image}>
                    <View style={{flexDirection:'row', justifyContent:"flex-end", margin:15, alignItems:"center"}}>
                        {/* <Icon1.Button name="md-menu" backgroundColor="#0073BD" onPress={()=>{}} size={35} /> */}
                        <TouchableOpacity onPress={()=>{
                            this.handleClickNotif()
                        }} >
                            <HomeIconWithBadge name={"ios-notifications"} size={28} value={this.state.badge}/>
                        </TouchableOpacity>
                        {/* <Icon1.Button name="ios-notifications" backgroundColor="#0073BD" onPress={()=>{}} size={28} /> */}
                    </View>
                    <View style={{alignItems:"center"}}>
                        <View style={styles.circle}>
                            <Text style={{color:'#fff', fontSize:26, fontWeight:'bold'}}>Heigh</Text>
                            <View style={{flexDirection:'row', margin:8}}>
                                <Text style={{color:'#fff', fontSize:42, fontWeight:'bold'}}>{this.state.site[this.state.site.length-1].pasut}</Text>
                                <Text style={{color:'#fff', fontSize:24, fontWeight:'bold', marginTop:23}}> m</Text>
                            </View>
                            <Text style={{color:'#fff', fontSize:18}}>Tide Gauge</Text>
                        </View>
                        <View style={{marginTop:35, marginBottom:16}}>
                            {/* <Button
                                title="Press me"
                                onPress={() => {this.handlePush()}}
                            /> */}
                            <Text style={{color:'#fff', fontSize:18}}>Tide Gauge Monitoring Station</Text>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.box}>
                            <Text style={styles.judul}>Tsunami Alert</Text>
                            <View style={{marginBottom:10, marginTop:8, justifyContent:"center", alignItems:"center", borderColor:"#ff7171", borderStyle:"dotted", borderWidth:3, padding:5, borderRadius:10 }}>
                                <Text style={{textAlign:"center"}}> <Tsunami 
                                tgl={moment(this.state.notif[this.state.notif.length-1].date).format("D/MM/YYYY")} 
                                data={this.state.notif[this.state.notif.length-1].desc} 
                                /> 
                                </Text>
                            </View>
                            <Text style={styles.judul}>Recent Earthquake <Text style={{fontSize:9, fontWeight:'normal'}} >{this.state.gempaTerkini.Tanggal}</Text> </Text>
                            <View style={{padding:8, marginTop:8, marginBottom:30, borderWidth:3, borderRadius:10, borderColor:'rgba(59,59,59,0.38)', borderStyle:"dotted"}}>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{height:20, width:20, marginRight:8, marginVertical:3}} source={{uri:'https://www.bmkg.go.id/asset/img/gempabumi/magnitude.png'}}/>
                                    <Text>Magnitudo : {this.state.gempaTerkini.Magnitude} </Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{height:20, width:20, marginRight:8, marginVertical:3}} source={{uri:'https://www.bmkg.go.id/asset/img/gempabumi/kedalaman.png'}}/>
                                    <Text>Kedalaman : {this.state.gempaTerkini.Kedalaman}</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{height:20, width:20, marginRight:8, marginVertical:3}} source={{uri:'https://www.bmkg.go.id/asset/img/gempabumi/koordinat.png'}}/>
                                    <Text>Lokasi : {this.state.gempaTerkini.Posisi}</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{height:20, width:20, marginRight:8, marginVertical:3}} source={{uri:'https://www.bmkg.go.id/asset/img/gempabumi/lokasi.png'}}/>
                                    <Text>{this.state.gempaTerkini.Keterangan}</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{height:20, width:20, marginRight:8, marginVertical:3}} source={{uri:'https://www.bmkg.go.id/asset/img/gempabumi/wilayah-dirasakan.png'}}/>
                                    <Text>Dirasakan (Skala MMI): {this.state.gempaTerkini.Dirasakan}</Text>
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
        marginBottom:10,
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
