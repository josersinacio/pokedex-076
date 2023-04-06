import React, { useEffect, useState } from "react";
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';

export default function App() {
  const pokedexType = Platform.OS === 'ios' ? 1: 2;

  const [pokemons, setPokemons] = useState([])

  async function loadPokemons(pokedexType) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokedex/${pokedexType}/`);
    const json =  await response.json()
  
    setPokemons(json.pokemon_entries)
  } 

  async function onPressPokemonItem(item) {
    await WebBrowser.openBrowserAsync(`https://www.google.com/search?q=${item.pokemon_species.name}`)
  }

  useEffect(() => {
    loadPokemons(pokedexType, setPokemons);
  }, [])

  const renderPokemonItem = ({ item }) => (
    <TouchableOpacity onPress={() => onPressPokemonItem(item)}>
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="contain"
          placeholder={<Image source={require('./assets/pokeball.png')} style={styles.placeholder} />}
        />
        <Text style={{ color: '#fff', textTransform: 'capitalize' }}>{item.pokemon_species.name}</Text>
      </View>
    </TouchableOpacity>
  )

  const getItemLayout = (data, index) => ({
    length: 120,
    offset: 120 * index,
    index,
  })

  const keyExtractor = item => item.entry_number.toString()

  return <>
    <View style={styles.container}>
      <StatusBar style="light" translucent={true}/>
      <FlatList
        data={pokemons.map(pokemon => ({
          ...pokemon,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.entry_number}.png`,
        }))}
        contentContainerStyle={styles.content}
        renderItem={renderPokemonItem}
        keyExtractor={keyExtractor}
        numColumns={3}
        getItemLayout={getItemLayout}
        initialNumToRender={30}
        windowSize={15}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        legacyImplementation={false}
        columnWrapperStyle={{ justifyContent: 'space-evenly' }}
        showsVerticalScrollIndicator={false}
        lazy={true}
      />
    </View>
  </>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010010',
  },
  content: {
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
  },
  image: {
    width: 80,
    height: 80,
  },
  placeholder: {
    width: 80,
    height: 80,
    opacity: 0.5,
  },
})
