import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "../screens/OrdersScreen";
import OrdersDelivery from "../screens/OrderDelivery";
import ProfileScreen from "../screens/ProfileScreen";
import { useAuthContext } from "../contexts/AuthContext";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { dbTransporter } = useAuthContext();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {dbTransporter ? (
        <>
          <Stack.Screen name="Order Screen" component={OrdersScreen} />
          <Stack.Screen
            name="Orders Delivery Screen"
            component={OrdersDelivery}
          />
        </>
      ) : (
        <Stack.Screen name="Profile Screen" component={ProfileScreen} />
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
