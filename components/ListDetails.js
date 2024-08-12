import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useState } from "react";

const ListDishDetails = ({ dish }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{dish.name}</Text>
            <View style={styles.detailsContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.itemText}>Sell Price: ${dish.sellPrice.toFixed(2)}</Text>
                    <Text style={styles.itemText}>Cost Price: ${dish.costPrice.toFixed(2)}</Text>
                    <Text style={styles.itemText}>Profit: ${dish.profit.toFixed(2)}</Text>
                    <Text style={styles.itemText}>Labor Cost: ${dish.prepCost.toFixed(2)}</Text>
                    <Text style={styles.itemText}>Description: {dish.description}</Text>
                    <Text style={styles.itemText}>Instructions: {dish.instructions}</Text>
                    <Text style={styles.itemText}>Ingredients:</Text>
                    <FlatList
                        data={dish.ingredients}
                        renderItem={({ item }) => (
                            <View style={styles.subItemContainer}>
                                <Text style={styles.subItemTitle}>{item.name}</Text>
                                <Text style={styles.subItemText}>Amount: {item.quantity} {item.unit}</Text>
                                <Text style={styles.subItemText}>Cost: ${item.cost.toFixed(2)}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.name}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 10,
    },
    subItemContainer: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    subItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    subItemText: {
        fontSize: 14,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d3d3d3',
        borderRadius: 10,
    },
    placeholderText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
});

export default ListDishDetails;