import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';

const ReportScreen = ({ ingredients, dishes }) => {
  const [totalProfit, setTotalProfit] = useState(0);
  const [mostProfitableDishes, setMostProfitableDishes] = useState([]);
  const [mostProfitableIngredients, setMostProfitableIngredients] = useState([]);
  const [mostUsedIngredients, setMostUsedIngredients] = useState([]);

  useEffect(() => {
    calculateReport();
  }, [ingredients, dishes]);

  const calculateReport = () => {
    let profit = 0;
    let dishProfits = [];
    let ingredientProfits = [];
    let ingredientUsage = {};

    dishes.forEach(dish => {
      // Ensure dish has a valid sellPrice and cost
      const dishSellPrice = parseFloat(dish.sellPrice) || 0;
      const dishCost = parseFloat(dish.cost) || 0;
      const dishProfit = dishSellPrice - dishCost;

      profit += dishProfit;
      dishProfits.push({ name: dish.name, profit: dishProfit });
    });

    ingredients.forEach(ingredient => {
      // Ensure ingredient has a valid price and cost
      const ingredientPrice = parseFloat(ingredient.price) || 0;
      const ingredientCost = parseFloat(ingredient.cost) || 0;
      const ingredientProfit = ingredientPrice - ingredientCost;

      ingredientProfits.push({ name: ingredient.name, profit: ingredientProfit });
    });

    dishes.forEach(dish => {
      dish.ingredients.forEach(ingredient => {
        if (ingredientUsage[ingredient.name]) {
          ingredientUsage[ingredient.name] += 1;
        } else {
          ingredientUsage[ingredient.name] = 1;
        }
      });
    });

    // Sort and slice the top 3 most profitable dishes and ingredients
    setMostProfitableDishes(dishProfits.sort((a, b) => b.profit - a.profit).slice(0, 3));
    setMostProfitableIngredients(ingredientProfits.sort((a, b) => b.profit - a.profit).slice(0, 3));
    setMostUsedIngredients(Object.entries(ingredientUsage).sort(([, a], [, b]) => b - a).slice(0, 3));
    setTotalProfit(profit);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Total Ingredients: {ingredients.length}</Text>
      <Text>Total Dishes: {dishes.length}</Text>
      <Text>Total Profit: ${totalProfit.toFixed(2)}</Text>

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Top 3 Most Profitable Dishes</Text>
      <FlatList
        data={mostProfitableDishes}
        renderItem={({ item }) => <Text>{item.name}: ${item.profit.toFixed(2)}</Text>}
        keyExtractor={(item) => item.name}
      />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Top 3 Most Profitable Ingredients</Text>
      <FlatList
        data={mostProfitableIngredients}
        renderItem={({ item }) => <Text>{item.name}: ${item.profit.toFixed(2)}</Text>}
        keyExtractor={(item) => item.name}
      />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Top 3 Most Used Ingredients</Text>
      <FlatList
        data={mostUsedIngredients}
        renderItem={({ item }) => <Text>{item[0]}: Used {item[1]} times</Text>}
        keyExtractor={(item) => item[0]}
      />

    </View>
  );
};

export default ReportScreen;
