import { StyleSheet, Text, View, Pressable, Modal, FlatList, ScrollView, TextInput, SafeAreaView} from 'react-native';
import React, { useState, useEffect} from 'react';
import IngredientForm from './components/IngredientForm.js';
import DishForm from './components/DishForm.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Report from './components/Report.js';
import ListIngredients from './components/ListIngredients.js';
import ListDishes from './components/ListDishes.js';
import ListScreen from './components/ListScreen.js';

export default function HomeScreen() {
  const [ingredients, setIngredients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [dishModalVisible, setDishModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [ListModalVisible, setListModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [reportModalVisible, setReportModalVisible] = useState(false);

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('ingredients');
        const storedIngredients = jsonValue != null ? JSON.parse(jsonValue) : [];
        setIngredients(storedIngredients);
        console.log('Ingredients loaded:', storedIngredients);
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      }
    };

    const loadDishes = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('dishes');
        const storedDishes = jsonValue != null ? JSON.parse(jsonValue) : [];
        setDishes(storedDishes);
        console.log('Dishes loaded:', storedDishes);
      } catch (error) {
        console.error('Failed to load dishes:', error);
      }
    };

    const loadData = async () => {
      await loadIngredients();
      await loadDishes();
      console.log('Data loaded');
      setLoading(false); // Set loading to false after data is loaded
    };

    loadData();
  }, []);

  // Save ingredients when they change, but only after loading is complete
  useEffect(() => {
    if (!loading) {
      const saveIngredients = async () => {
        try {
          const jsonValue = JSON.stringify(ingredients);
          await AsyncStorage.setItem('ingredients', jsonValue);
          console.log('Ingredients saved:', jsonValue);
        } catch (error) {
          console.error('Failed to save ingredients:', error);
        }
      };

      saveIngredients();
    }
  }, [ingredients, loading]); // Dependencies include loading state

  // Save dishes when they change, but only after loading is complete
  useEffect(() => {
    if (!loading) {
      const saveDishes = async () => {
        try {
          const jsonValue = JSON.stringify(dishes);
          await AsyncStorage.setItem('dishes', jsonValue);
          console.log('Dishes saved:', jsonValue);
        } catch (error) {
          console.error('Failed to save dishes:', error);
        }
      };

      saveDishes();
    }
  }, [dishes, loading])

  const addIngredient = (newIngredient) => {
    setIngredients(prevIngredients => {
      const index = prevIngredients.findIndex(ing => ing.name === newIngredient.name);
      if (index >= 0) {
        const updatedIngredients = [...prevIngredients];
        updatedIngredients[index] = newIngredient;
        updateDishesWithNewIngredient(newIngredient); // Update dishes with new ingredient
        return updatedIngredients;
      }
      return [...prevIngredients, newIngredient];
    });
  };

  const clearIngredients = async () => {
    console.log("Ingredients alert Shown");
    try { 
      await AsyncStorage.removeItem('ingredients');
      setIngredients([]);
      console.log('Ingredients cleared');
    } catch (error) {
      console.error('Failed to clear ingredients:', error);
    }
  }

  const clearDishes = async () => {
    console.log("Dishes alert Shown");
    try {
      await AsyncStorage.removeItem('dishes');
      setDishes([]);
      console.log('Dishes cleared');
    } catch (error) {
      console.error('Failed to clear dishes:', error);
    }
  }
  
  const addDish = (dish) => {
    setDishes(prevDishes => {
      const index = prevDishes.findIndex(d => d.name === dish.name);
      if (index >= 0) {
        const updatedDishes = [...prevDishes];
        updatedDishes[index] = dish;
        return updatedDishes;
      }
      return [...prevDishes, dish];
    });
  };

  const updateDishesWithNewIngredient = (newIngredient) => {
    setDishes(prevDishes =>
      prevDishes.map(dish => {
        let costPrice = 0;
        dish.ingredients.forEach((ing) => {
          const ingredient = ing.name === newIngredient.name ? newIngredient : ingredients.find(i => i.name === ing.name);
          if (ingredient) {
            costPrice += (ingredient.cost / ingredient.amount) * ing.quantity;
          }
        });
        const profit = dish.sellPrice - costPrice;
        return {
          ...dish,
          costPrice,
          profit,
        };
      })
    );
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeDishModal = () => {
    setDishModalVisible(false);
  };

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredIngredients = ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(lowercasedQuery)
    );
    const filteredDishes = dishes.filter(dish =>
      dish.name.toLowerCase().includes(lowercasedQuery)
    );
    setSearchResults([...filteredIngredients, ...filteredDishes]);
    setShowSearchResults(true);
  };

  const handlePressItem = (item) => {
    setSelectedItem(item);
    setEditModalVisible(true);
  };

  const handleEditItem = (updatedItem) => {
    if (updatedItem.amount) {
      // Update ingredient
      setIngredients(prevIngredients =>
        prevIngredients.map(ingredient =>
          ingredient.name === updatedItem.name ? updatedItem : ingredient
        )
      );
      updateDishesWithNewIngredient(updatedItem);
    } else {
      // Update dish
      setDishes(prevDishes =>
        prevDishes.map(dish =>
          dish.name === updatedItem.name ? updatedItem : dish
        )
      );
    }
    setEditModalVisible(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = () => {
    if (selectedItem.amount) {
      // Delete ingredient
      setIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.name !== selectedItem.name)
      );
    } else {
      // Delete dish
      setDishes(prevDishes =>
        prevDishes.filter(dish => dish.name !== selectedItem.name)
      );
    }
    setEditModalVisible(false);
    setSelectedItem(null);
  };

  const renderForm = () => {
    if (!selectedItem) return null;
    if (selectedItem.amount) {
      return (
        <IngredientForm
          onAddIngredient={handleEditItem}
          onClose={() => setEditModalVisible(false)}
          initialData={selectedItem}
        />
      );
    } else {
      return (
        <DishForm
          ingredients={ingredients}
          onAddDish={handleEditItem}
          onClose={() => setEditModalVisible(false)}
          initialData={selectedItem}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent} 
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.title}>Food Price Calculator</Text>
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Step 1: Insert a new ingredient</Text>
          <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>Add Ingredient</Text>
          </Pressable>
          <Modal
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <IngredientForm onAddIngredient={addIngredient} onClose={closeModal} />
          </Modal>
          <Text style={styles.title}>Total Ingredients added: {ingredients.length}</Text>
          {/* {<ListIngredients ingredients={ingredients} />} */}
          
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Step 2: Insert a new dish</Text>
          <Pressable onPress={() => setDishModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>Add Dish</Text>
          </Pressable>
          <Modal
            visible={dishModalVisible}
            animationType="slide"
            onRequestClose={() => setDishModalVisible(false)}
          >
            <DishForm
              ingredients={ingredients}
              onAddDish={addDish}
              onClose={closeDishModal}
            />
          </Modal>
          <Text style={styles.title}>Total Dishes added: {dishes.length}</Text>

          {/* {dishes && (
            <ListDishes dishes={dishes} />
          )} */}
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Step 3: Search Ingredients or Dishes</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable onPress={handleSearch} style={styles.button}>
            <Text style={styles.buttonText}>Search</Text>
          </Pressable>
          {showSearchResults && (
            <FlatList
              data={searchResults}
              renderItem={({ item }) => (
                <Pressable onPress={() => handlePressItem(item)} style={styles.itemContainer}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  {item.amount ? (
                    <>
                      <ListIngredients ingredients={item} />
                    </>
                  ) : (
                    <>
                      {dishes && (
                        <ListDishes dishes={dishes} />
                      )}
                    </>
                  )}
                </Pressable>
              )}
              keyExtractor={(item) => item.name}
            />
          )}
        </View>

        <Modal
          visible={editModalVisible}
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          {renderForm()}
          <View style={styles.modalContainer}>
            <Pressable
              onPress={handleDeleteItem}
              style={[styles.modalButton, { backgroundColor: 'red' }]}
            >
              <Text style={styles.modalButtonText}>Delete</Text>
            </Pressable>
            <Pressable
              onPress={() => setEditModalVisible(false)}
              style={[styles.modalButton, { backgroundColor: '#ccc' }]}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </Modal>

        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Step 4: View Everything</Text>
          <Pressable onPress={() => setListModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>View all dishes and ingredients</Text>
          </Pressable>
          <ListScreen
            visible={ListModalVisible}
            setListModalVisible={setListModalVisible}
            ingredients={ingredients}
            dishes={dishes}
            clearIngredients={clearIngredients}
            clearDishes={clearDishes}
          />
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Step 5: View Report</Text>
          <Pressable onPress={() => setReportModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>View Report</Text>
          </Pressable>
          <Modal
            visible={reportModalVisible}
            animationType="slide"
            onRequestClose={() => setReportModalVisible(false)}
          >
            <Text style={styles.title}>Report</Text>
            <Report ingredients={ingredients} dishes={dishes} />
            <Pressable onPress={() => setReportModalVisible(false)} style={styles.button}>
              <Text style={styles.buttonText}>Close Report</Text>
            </Pressable>
          </Modal>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 16,
  },
  itemContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});



