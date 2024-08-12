import React from 'react';

import { View, Text, FlatList } from 'react-native';

const ListIngredients = ({ ingredients }) => {
    return (
       <FlatList
            data = {ingredients}
            renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemText}>Quantity: {item.amount} {item.unit}</Text>
                    <Text style={styles.itemText}>Cost: ${item.cost}</Text>
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
};

export default ListIngredients;