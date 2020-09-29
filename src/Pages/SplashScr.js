import React from 'react'
import { ImageBackground, StatusBar, StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import BGSplash from '../Assets/img/bgSplash.png'
import Logo from '../Assets/img/LogoTebal.png'

const windowWidth = Dimensions.get('window').width;

const SplashScr = () => {
    return(
        <ImageBackground source={BGSplash} style={{flex:1, resizeMode:'cover', justifyContent:"center"}}>
            <StatusBar hidden={true}/>
            <View style={styles.container}>
                {/* <ILogo width={windowWidth*0.34} height={windowWidth*0.34} /> */}
                <Image style={{height:windowWidth*0.34, width:windowWidth*0.34}} source={Logo}/>
                <Text style={styles.text1}> TIGASMOS </Text>
            </View>
            <View style={styles.container1}>
                <Text style={styles.text}> Version 1.0.0 </Text>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:7,
        justifyContent:'center',
        alignItems:'center'
    },
    container1:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    text:{
        // fontFamily:'segoesc',
        fontSize:18,
        marginBottom:25,
    },
    text1:{
        // fontFamily:'montserratbold',
        fontSize:24,
        fontWeight:'bold',
        marginTop:4,
        letterSpacing:2,
    }
})

export default SplashScr