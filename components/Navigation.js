import React from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from "./Layar/Home";


const RootStack = createStackNavigator(
    {
        Home: {
            screen: Home
        },
        
    },
    {
        initialRouteName: "Home"
    },
    
);

const Navigation = createAppContainer(RootStack);

export default class App extends React.Component {
    render() {
        return <Navigation />;
    }
}
