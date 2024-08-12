import React from "react";
import { View, Text, FlatList } from "react-native";
import { useState } from "react";

const ListDishes = ({ dishes }) => {
  const [selectedDish, setSelectedDish] = useState(null);

  const round = (num, places) => (
    Math.round(num * 10 ** places) / 10 ** places
  )

    return (
      <FlatList
        data={dishes}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemText}>Sell Price: ${round(item.sellPrice, 2)}</Text>
            <Text style={styles.itemText}>Cost Price: ${round(item.costPrice, 2)}</Text>
            <Text style={styles.itemText}>Profit: ${round(item.profit, 2)}</Text>
            <Text style={styles.itemText}>Ingredients:</Text>
            {item.ingredients && (
              <FlatList
                data={item.ingredients}
                renderItem={({ item }) => (
                  <View style={styles.subItemContainer}>
                    <Text style={styles.subItemTitle}>{item.name}</Text>
                    <Text style={styles.subItemText}>Amount: {item.quantity} {item.unit}</Text>
                    <Text style={styles.subItemText}>Cost: ${round(item.cost, 2)}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.name}
              />
            )}
          </View>
        )}
        keyExtractor={(item) => item.name}
      />
    );
}

const styles = {
    itemContainer: {
      padding: 10,
      marginVertical: 5,
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: 'lightgrey',
      borderRadius: 5,
    },
    itemTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    itemText: {
      fontSize: 16,
    },
    subItemContainer: {
      padding: 10,
      marginVertical: 5,
      marginHorizontal: 10,
      backgroundColor: 'lightgrey',
      borderRadius: 5,
    },
    subItemTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    subItemText: {
      fontSize: 14,
    },
  };

export default ListDishes;