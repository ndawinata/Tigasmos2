import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import Dashboard from './Pages/Dashboard'
import SplashScr from './Pages/SplashScr'

const App = () => {

    const [splash, setsplash] = useState(true)

    useEffect(()=>{
        setTimeout(()=>{
        setsplash(false)
        },5000)
    },[])

    if(splash){
        return(<SplashScr/>)
    }else{
        return(<Dashboard/>)
    }
        // <Dashboard />
        // <SplashScr />
}

export default App
