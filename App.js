import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BeerList from "./src/screens/BeerList";
import HomePage from "./src/screens/HomePage";
import TakeBeerReal from "./src/screens/TakeBeerReal";

// Créez une instance de Stack Navigatorr
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="BeerList" component={BeerList} />
        <Stack.Screen name="TakeBeerReal" component={TakeBeerReal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
