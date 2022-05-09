import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "../screens/OrdersScreen";
import OrdersDelivery from "../screens/OrderDelivery";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Order Screen" component={OrdersScreen} />
      <Stack.Screen name="Orders Delivery Screen" component={OrdersDelivery} />
    </Stack.Navigator>
  );
};

export default Navigation;
