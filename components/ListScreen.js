import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';

import { useState } from 'react';
import ListIngredients from './ListIngredients.js';
import Details from './ListDetails.js';

const ListModal = ({
    visible,
    setListModalVisible,
    ingredients,
    dishes,
    clearIngredients,
    clearDishes
  }) => {
    const [selctedDish, setSelectedDish] = useState(null);
    const [detailsModal, setDetailsModal] = useState(false);

    const handleSelectedDish = (selctedDish) => {
      console.log('selected dish', selctedDish);
      setSelectedDish(selctedDish);
      setDetailsModal(true);
      console.log('selected dish', selctedDish);
    };


    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <View style={styles.ingredientsContainer}>
            <ScrollView contentContainerStyle={styles.scrollView} showsHorizontalScrollIndicator={true}>
            <Text style={styles.title}>All Ingredients</Text>
            <ListIngredients ingredients={ingredients} />
            <Pressable onPress={() => clearIngredients()} style={styles.button}>
              <Text style={styles.buttonText}>Clear All Ingredients</Text>
            </Pressable>
          </ScrollView>
          </View>
            <View style={styles.dishesContainer}>
              <ScrollView contentContainerStyle={styles.scrollView} showsHorizontalScrollIndicator={true}>
              <Text style={styles.title}>All Dishes</Text>

              {dishes.map((dish) => (
                <Pressable key={dish.name} onPress={() => handleSelectedDish(dish)} style={styles.dishNames}>
                  <View style={styles.dishContainer}>
                    <Text style={styles.dishNames} >{dish.name}</Text>
                  </View>
                </Pressable>
              ))}
              {detailsModal && (
                <Modal visible={true} animationType="slide">
                  <View style={styles.modalContainer}>
                    {selctedDish.name ? (
                      <Details dish={selctedDish} />
                    ) : (
                      <Text style={styles.title}>No Name</Text>
                    )}
                    <Pressable onPress={() => setDetailsModal(false)} style={styles.closeButton}>
                      <Text style={styles.buttonText}>Close Details</Text>
                    </Pressable>
                  </View>
                </Modal>
              )}
              <Pressable onPress={() => clearDishes()} style={styles.button}>
                <Text style={styles.buttonText}>Clear All Dishes</Text>
              </Pressable>
            </ScrollView>
          </View>
          <Pressable onPress={() => setListModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close List View</Text>
          </Pressable>
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f9f9f9',
    },
    scrollView: {
      paddingBottom: 20, // To ensure space for the close button
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 15,
      marginBottom: 10,
    },
    button: {
      backgroundColor: 'red',
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
    },
    closeButton: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignSelf: 'center',
      width: '80%',
    },
    ingredientsContainer: {
      marginBottom: 20,
      flex: 1,
    },
    dishesContainer: {
      flex: 1,
    },
    scrollView: {
      paddingBottom: 20,
    },  
    dishNames: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 15,
      marginBottom: 10,
    },
    dishContainer: {
      padding: 10,
      marginVertical: 5,
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: 'lightgrey',
      borderRadius: 5,
    },
    modalContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    

  });
  
  export default ListModal;
