import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export default class HomeScreen extends Component {
    render() {
      return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Creator')}>
                <View >
                    <Text style={styles.buttonText}>Create New Recipe</Text>
                </View>
            </TouchableOpacity>
                <View style={[styles.button, {marginTop: 20}]}>
                    <Text style={styles.buttonText}>View Reciepes</Text>
                </View>
        </View>
      );
    }
  }

  const darkGrey = "#404040"
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#d9d9d9',
        paddingHorizontal: 40,
        paddingTop: 40,
        paddingBottom: 80
    },
    button: {
        flex: 1,
        borderWidth: 1,
        borderColor: darkGrey,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    buttonText: {
      fontSize: 22,
      textAlign: 'center',
      color: darkGrey
    }
  });
  