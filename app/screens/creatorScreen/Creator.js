import React, {Component} from 'react';
import {Platform, 
    StyleSheet, 
    Text, View, 
    TextInput, 
    TouchableOpacity, 
    Picker,
    ScrollView,
    Alert
} from 'react-native';
import Modal from "react-native-modal";

import firebase from 'react-native-firebase';

export default class CreatorScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            ingredientModalVisible: false,
            ingredients: [],
            currIngredient: {
                unit: "lbs"
            },
            category: "breakfast",
            directions: [],
            title: "",
            editingIngredient: -1
        };
        this.ref = firebase.firestore().collection('recipes');
    }

    setIngredientModalVisible(visible) {
        this.setState({ingredientModalVisible: visible});
    }

    editIngredient(i){
        let ingredient = Object.assign({}, this.state.ingredients[i]);
        this.setState({
            currIngredient: ingredient,
            editingIngredient: i,
            ingredientModalVisible: true
        });
    }

    getIngredientList(){
        return this.state.ingredients.map((ingred, i) => {
            return(
                <View key={i} style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 3
                }}>

                    <Text numberOfLines= {1}
                        style={{
                            flex: 6,
                            textAlign: 'left',
                            fontSize: 18,
                            color: darkGrey,
                    }}>&bull; {ingred.name}</Text>

                    <Text numberOfLines= {1}
                        style={{
                            flex: 3,
                            textAlign: 'left',
                            marginLeft: 10,
                            fontSize: 18,
                            color: darkGrey,
                    }}>{ingred.amount} {ingred.unit}</Text>

                    <TouchableOpacity onPress={() => {
                        this.editIngredient(i);
                    }}>
                        <View style={[styles.button, { paddingHorizontal: 2, marginLeft: 2, alignSelf: 'stretch'}]}>
                            <Text style={{color: darkGrey, textAlign: 'center', fontSize: 18}}>Edit</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            )
        })
    }

    addNewDirection(){
        arrCopy = this.state.directions;
        arrCopy.push("");
        this.setState({directions: arrCopy});
    }

    getDirections(){
        return this.state.directions.map((direct, i) => {
            return(
                <View key={i} style={{                      // Index as key is an antipattern, should use UUID
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingHorizontal: 10
                }}>

                    <Text
                        style={{
                            textAlign: 'left',
                            fontSize: 18,
                            color: darkGrey,
                    }}>{i+1}. </Text>

                    <TextInput style={{fontSize: 18}}
                        placeholder="Enter New Direction" onChangeText={(text)=>{
                        arrCopy = this.state.directions;
                        arrCopy[i] = text;
                        this.setState({
                            directions: arrCopy
                        })
                    }}></TextInput>

                </View>
            )
        })
    }

    convertIngredientsList() {
        return this.state.ingredients.map((ing, i)=>{
            switch(ing.unit){
                case "lbs": // to grams
                    return{
                        name: ing.name,
                        amount: ing.amount*453.592,
                        unit: ing.unit
                    }
                break;

                case "oz": // to grams
                    return{
                        name: ing.name,
                        amount: ing.amount*28.3495,
                        unit: ing.unit
                    }
                break;

                case "g": // same
                    return{
                        name: ing.name,
                        amount: ing.amount,
                        unit: ing.unit
                    }
                break;

                case "mg": // to grams
                    return{
                        name: ing.name,
                        amount: ing.amount*0.001,
                        unit: ing.unit
                    }
                    
                break;

                case "fl oz": // to litres
                    return{
                        name: ing.name,
                        amount: ing.amount*0.0295735,
                        unit: ing.unit
                    }
                break;

                case "pt": // to litres
                    return{
                        name: ing.name,
                        amount: ing.amount*0.473176,
                        unit: ing.unit
                    }
                break;

                case "qt": // to litres
                    return{
                        name: ing.name,
                        amount: ing.amount*0.946353,
                        unit: ing.unit
                    }
                break;

                case "gal": // to litres
                    return{
                        name: ing.name,
                        amount: ing.amount*3.78541,
                        unit: ing.unit
                    }
                break;

                case "l": // same
                    return{
                        name: ing.name,
                        amount: ing.amount,
                        unit: ing.unit
                    }
                break;

                case "ml": // to litres
                    return{
                        name: ing.name,
                        amount: ing.amount*0.001,
                        unit: ing.unit
                    }
                break;

                default:
                     return{
                        name: ing.name,
                        amount: ing.amount,
                        unit: ing.unit
                     }
                break;
            }
        })
    }

    addRecipe() {
        convertedIngredients = this.convertIngredientsList();
        this.ref.add({
            title: this.state.title,
            category: this.state.category,
            ingredients: convertedIngredients,
            directions: this.state.directions
        }).then(()=>{
            Alert.alert('Successfully created recipe!')
            this.setState({
                ingredientModalVisible: false,
                ingredients: [],
                currIngredient: {
                    unit: "lbs"
                },
                category: "breakfast",
                directions: [],
                title: "",
                editingIngredient: -1
            });
        }).catch((e)=>{
            Alert.alert('Unable to send Data',e);
        })
    }

    render() {
      return (
        <View style={styles.container}>
            <View style = {{borderWidth: 1, borderColor: darkGrey, borderRadius: 15, paddingLeft: 4, marginBottom: 8, backgroundColor: 'white'}}>
                <TextInput style={styles.name} placeholder="Recipe Name" onChangeText={(text)=>{
                            this.setState({
                                title: text
                            })
                        }}></TextInput>
            </View>

            <View style={{backgroundColor: 'white',  borderWidth: 1, borderColor: darkGrey, borderRadius: 15, backgroundColor: 'white'}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.titleText}>Category</Text>
                </View>
                <Picker selectedValue={this.state.category}
                    style={{height: 100}}
                    onValueChange={(itemValue, itemIndex) =>{
                        this.setState({category: itemValue});
                    }}
                    itemStyle={{height: 110}}
                >
                            <Picker.Item label="Breakfast" value="breakfast" />
                            <Picker.Item label="Lunch" value="lunch" />
                            <Picker.Item label="Dinner" value="dinner" />
                            <Picker.Item label="Snack" value="Snack" />
                </Picker>
            </View>

            <ScrollView style={styles.fieldContainer} contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'stretch'}}>
                <View style={styles.fieldTitle}>
                    <Text style={styles.titleText}>Ingredients</Text>
                </View>
                <View style={{flex: 1}}>
                    <View style ={{marginBottom: 8}}>
                        {this.getIngredientList()}
                    </View>
                    

                    <TouchableOpacity onPress={()=>this.setIngredientModalVisible(true)}>
                        <View style={[styles.button, {marginBottom: 8}]}>
                            <Text style={styles.buttonText}> ⊕ Add New Ingredient </Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            <ScrollView style={styles.fieldContainer} contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'stretch'}}>
                <View style={styles.fieldTitle}>
                    <Text style={styles.titleText}>Directions</Text>
                </View>

                <View style={{flex: 1}}>
                    <View style ={{marginBottom: 8}}>
                        {this.getDirections()}
                    </View>

                    <TouchableOpacity onPress={()=>this.addNewDirection()}>
                        <View style={[styles.button, {marginBottom: 8}]}>
                            <Text style={styles.buttonText}> ⊕ Add New Direction </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <TouchableOpacity onPress={() => {
                Alert.alert('Done?',
                    'Are you sure you want to create this recipe?',[
                        {text: 'No, not yet'},
                        {text: 'Yes, I\'m done!', onPress: ()=>this.addRecipe()}
                    ])
            }}>
                <View style={[styles.button, {paddingHorizontal: 2, marginTop: 20, height: 40, backgroundColor: 'white'}]}>
                    <Text style={{color: darkGrey, fontSize: 20}}>Submit</Text>
                </View>
            </TouchableOpacity>


        <Modal
            isVisible={this.state.ingredientModalVisible}
            onBackdropPress={()=>{
                this.setIngredientModalVisible(false)
            }}
        >
            <View style={{
                marginTop: 22,
                backgroundColor: 'white',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 15,
                paddingBottom: 8
            }}>
                <Text style={{textAlign: 'center', color: darkGrey, fontSize: 20, marginBottom: 4}}>Add Ingredient</Text>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 8
                }}>
                    <View style = {{flex: 5, borderWidth: 1, borderColor: darkGrey, borderRadius: 15, paddingLeft: 4, marginBottom: 8, backgroundColor: 'white'}}>
                        <TextInput style={styles.name} placeholder="Name" onChangeText={(text)=>{
                            this.setState({
                                currIngredient: Object.assign({}, this.state.currIngredient,  {name: text})
                            })
                        }}>{this.state.editingIngredient>=0 ? this.state.ingredients[this.state.editingIngredient].name : ""}</TextInput>
                    </View>

                    <View style = {{flex: 4, borderWidth: 1, borderColor: darkGrey, borderRadius: 15, paddingLeft: 4, marginBottom: 8, backgroundColor: 'white', marginHorizontal: 4}}>
                        <TextInput style={styles.name} placeholder="Amount" onChangeText={(text)=>{
                            this.setState({
                                currIngredient: Object.assign({}, this.state.currIngredient,  {amount: text})
                            })
                        }}>{this.state.editingIngredient>=0 ? this.state.ingredients[this.state.editingIngredient].amount : ""}</TextInput>
                    </View>

                    <Picker selectedValue={this.state.currIngredient.unit}
                        style={{flex: 2, borderWidth: 1, borderColor: darkGrey, borderRadius: 15, paddingLeft: 4, marginBottom: 8,}}
                        itemStyle={{height: 110}}
                        onValueChange={(itemValue, itemIndex) =>{
                            newObj = Object.assign({}, this.state.currIngredient,  {unit: itemValue});
                            this.setState({currIngredient: newObj});
                        }}
                    >
                        <Picker.Item label="lbs" value="lbs" />
                        <Picker.Item label="oz" value="oz" />
                        <Picker.Item label="g" value="g" />
                        <Picker.Item label="mg" value="mg" />
                        <Picker.Item label="fl oz" value="fl oz" />
                        <Picker.Item label="pt (US)" value="pt" />
                        <Picker.Item label="qt" value="qt" />
                        <Picker.Item label="gal" value="gal" />
                        <Picker.Item label="l" value="l" />
                        <Picker.Item label="ml" value="ml" />
                        <Picker.Item label="none" value="" />
                    </Picker>

                </View>

                        <TouchableOpacity onPress={() => {
                            if(!isNaN(this.state.currIngredient.amount)){
                                arrCopy = this.state.ingredients;
                                if(this.state.editingIngredient >= 0){
                                    arrCopy[this.state.editingIngredient] = this.state.currIngredient;
                                }else{
                                    arrCopy.push(this.state.currIngredient);
                                }
                                this.setState({
                                    ingredients: arrCopy,
                                    currIngredient: {unit: "lbs"},
                                    editingIngredient: -1
                                });
                                this.setIngredientModalVisible(false);
                            }else{
                                Alert.alert("Amount must be a number");
                                this.setState({
                                    currIngredient: {
                                        name: this.state.currIngredient.name,
                                        amonut: "",
                                        unit:this.state.currIngredient.unit
                                    }
                                });
                            }

                        }}>
                            <View style={[styles.button, {paddingHorizontal: 2, alignSelf: 'stretch'}]}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </View>
                        </TouchableOpacity>
            </View>
        </Modal>
        

        </View>
      );
    }
  }

  const darkGrey = "#404040"
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'stretch',
        backgroundColor: '#d9d9d9',
        paddingHorizontal: 40,
        paddingTop: 40,
        paddingBottom: 80
    },
    name: {
        fontSize: 20
    },
    fieldContainer: {
        flex: 2,
        borderWidth: 1,
        borderColor: darkGrey,
        borderRadius: 15,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        marginTop: 20
    },
    fieldTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 8
    },
    titleText: {
        fontSize: 20,
        color: darkGrey,
    },
    button: {
        alignSelf: 'stretch',
        borderWidth: 1,
        borderColor: darkGrey,
        borderRadius: 15,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d9d9d9',
        paddingBottom: 2
    },
    buttonText: {
        color: darkGrey,
        fontSize: 18
    }
  });
  