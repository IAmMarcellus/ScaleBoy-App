/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { View, Text } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";

import HomeScreen from './screens/homeScreen/Home';
import CreatorScreen from './screens/creatorScreen/Creator';

const AppNavigator = createStackNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        title: "Scale Boy",
        headerBackTitle: "Home"
      }
    },
    Creator: {
      screen: CreatorScreen,
      navigationOptions: {
        title: "Recipe Creator"
      }
    }
},
{
    initialRouteName: "Home"
});

export default createAppContainer(AppNavigator);


