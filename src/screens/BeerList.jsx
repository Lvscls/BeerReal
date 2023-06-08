import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import beersData from '../data/beers.json';

const BeerList = () => {
  const navigation = useNavigation();
  const beers = beersData.beers;

  const renderBeerItem = ({ item }) => (
    <View style={styles.beerItem}>
      <Text style={styles.beerName}>{item.name}</Text>
      <Text style={styles.beerAlcohol}>{item.alcoholPercentage}%</Text>
      <Text style={styles.beerDescription}>{item.description}</Text>
      <View style={styles.beerPricesContainer}>
      <View style={styles.beerPriceColumn}>
        <Text style={styles.beerPriceLabel}>25cl:</Text>
        <Text style={styles.beerPrice}>{item.prices['25cl']}€</Text>
      </View>
      <View style={styles.beerPriceColumn}>
        <Text style={styles.beerPriceLabel}>33cl:</Text>
        <Text style={styles.beerPrice}>{item.prices['33cl']}€</Text>
      </View>
      <View style={styles.beerPriceColumn}>
        <Text style={styles.beerPriceLabel}>50cl:</Text>
        <Text style={styles.beerPrice}>{item.prices['50cl']}€</Text>
      </View>
    </View>
    </View>
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des bières</Text>
      <FlatList
        data={beers}
        renderItem={renderBeerItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
    textAlign: 'center',
  },
  beerItem: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  beerDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  beerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  beerAlcohol: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  beerPriceColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  beerPriceLabel: {
    marginRight: 8,
    color: '#666666',
    fontWeight: 'bold',
  },
  beerPrice: {
    color: '#333333',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default BeerList;
