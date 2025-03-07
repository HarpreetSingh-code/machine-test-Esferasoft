import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ImageSelection from './src/screens/ImageSelection'
import { Provider } from 'react-redux'
import store from './src/redux/store'

const App = () => {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <ImageSelection />
      </View>
    </Provider>
  )
}

export default App
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})