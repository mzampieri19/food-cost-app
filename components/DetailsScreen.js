import React, { useState } from 'react';
import { View, Text, Image, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import ListDetails from './ListDetails.js'; // Import the ListDetails component

const Details = ({ dishes }) => {
  const [selectedDish, setSelectedDish] = useState(null);

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView} showsHorizontalScrollIndicator={false}>
          {dishes.map((dish) => (
          <Pressable key={dish.name} onPress={() => setSelectedDish(dish)} style={styles.dishNames}>
            <View style={styles.dishContainer}>
              <Text style={styles.dishNames} >{dish.name}</Text>
            </View>
          </Pressable>
        ))}
        {selectedDish && (
          <Modal visible={true} animationType="slide" onRequestClose={() => setSelectedDish(null)}>
            <View style={styles.modalContainer}>

              {selectedDish.name ? (
                <ListDetails dish={selectedDish} />
              ) : (
                <Text style={styles.title}>No Name</Text>
              )}
              {selectedDish.imageUri ? (
                    <Image source={{ uri: selectedDish.imageUri }} style={styles.largeImage} />
                  ) : (
                    <View style={styles.placeholder}>
                      <Text style={styles.placeholderText}>{selectedDish.name}</Text>
                    </View>
              )}
              <Pressable onPress={() => setSelectedDish(null)} style={styles.closeButton}>
                <Text style={styles.buttonText}>Close Details</Text>
              </Pressable>
            </View>
          </Modal>
        )}



        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingBottom: 20, // To ensure space for the close button
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
  largeImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  placeholder: {
    width: '100%',
    height: 300,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },

});


export default Details;
