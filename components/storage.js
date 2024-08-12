import AsyncStorage from '@react-native-async-storage/async-storage';

const INGREDIENTS_KEY = 'ingredients';
const DISHES_KEY = 'dishes';


export const saveToStorage = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`${key} saved successfully!`);
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
};

export const loadFromStorage = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    console.log(`${key} loaded successfully!`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage', error);
  }
};

export const verifyIngredientStorage = async () => {
  const storedIngredients = await AsyncStorage.getItem('ingredients');
  console.log('Ingredients in storage:', storedIngredients);
};

export const verifyDishStorage = async () => {
  const storedDishes = await AsyncStorage.getItem('dishes');
  console.log('Dishes in storage:', storedDishes);
};