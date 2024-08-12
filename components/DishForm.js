import React, { useState, useEffect } from 'react';
import { Image, Button } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const DishForm = ({ ingredients, onAddDish, onClose, initialData = null }) => {
  const [name, setName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [laborTime, setLaborTime] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSellPrice(initialData.sellPrice.toString());
      setSelectedIngredients(initialData.ingredients);
      setLaborTime(initialData.laborTime);
      setLaborCost(initialData.laborCost);
      setImageUri(initialData.image);
      setDescription(initialData.description);
      setInstructions(initialData.instructions);
    }
  }, [initialData]);

  const handleChooseImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      ImagePicker: true,
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImageUri(selectedImage.uri);
      }
    });
  };

  const handleIngredientChange = (index, field, value) => {
    const newSelectedIngredients = [...selectedIngredients];
    newSelectedIngredients[index] = {
      ...newSelectedIngredients[index],
      [field]: value,
    };
    setSelectedIngredients(newSelectedIngredients);
  };

  const handleAddIngredient = () => {
    setSelectedIngredients([...selectedIngredients, { name: '', quantity: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dishIngredients = selectedIngredients.map((ingredient) => {
        const ingredientDetails = ingredients.find((ing) => ing.name === ingredient.name);
        const unitCost = ingredientDetails.cost / ingredientDetails.amount;
        const ingredientCost = unitCost * ingredient.quantity;
        return {
            ...ingredient,
            unit: ingredientDetails.unit,
            cost: ingredientCost,
        };
    });
    
    const costPrice = dishIngredients.reduce((total, ingredient) => total + ingredient.cost, 0);
    const prepCost = parseFloat(laborCost) * (parseFloat(laborTime) / 3600);
    const profit = parseFloat(sellPrice) - costPrice - prepCost;
    const dish = { name, sellPrice: parseFloat(sellPrice), costPrice, profit, ingredients: dishIngredients, laborTime, laborCost, imageUri, instructions, prepCost, description};
    onAddDish(dish);
    onClose();
    setName('');
    setSellPrice('');
    setLaborTime('');
    setLaborCost('');
    setImageUri('');
    setDescription('');
    setInstructions('');
    console.log("logged dish", dish);
    logDataServer(dish);
  };

  const logDataServer = async (dish) => {
    const response = await fetch('http://localhost:3001/dishes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dish),
    });
    const data = await response.json();
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Dish Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Sell Price"
        value={sellPrice}
        onChange={(e) => setSellPrice(e.target.value)}
        style={styles.input}
      />
      <input 
        type="number"
        placeholder="Labor Time (seconds)"
        value={laborTime}
        onChange={(e) => setLaborTime(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Labor Cost ($ per hour)"
        value={laborCost}
        onChange={(e) => setLaborCost(e.target.value)}
        style={styles.input}
      />
      <Button title="Choose Image" onPress={handleChooseImage} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        style={styles.input}
      />
      {selectedIngredients.map((ingredient, index) => {
        const selectedIngredient = ingredients.find(ing => ing.name === ingredient.name);
        const unit = selectedIngredient ? selectedIngredient.unit : '';
        return (
          <div key={index} style={styles.ingredientRow}>
            <select
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              style={styles.input}
            >
              <option value="">Select Ingredient</option>
              {ingredients.map((ing, i) => (
                <option key={i} value={ing.name}>{ing.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder={`Quantity (${unit})`}
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              style={styles.input}
            />
          </div>
        );
      })}
      <button type="button" onClick={handleAddIngredient} style={styles.button}>Add Ingredient</button>
      <button type="submit" style={styles.button}>Add Dish</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },
  input: {
    margin: 5,
    padding: 5,
    fontSize: 16,
  },
  button: {
    margin: 5,
    padding: 5,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  ingredientRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export default DishForm;
