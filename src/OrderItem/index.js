import { Text, View, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

const OrderItem = ({ order }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.row}
      onPress={() =>
        navigation.navigate("Orders Delivery Screen", { id: order.id })
      }
    >
      <Image source={{ uri: order.Restaurant.image }} style={styles.image} />
      <View style={styles.midSection}>
        <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
        <Text style={styles.texts}>{order.Restaurant.address}</Text>
        <Text style={styles.deliveryTitle}>Delivery Details:</Text>
        <Text style={styles.texts}>{order.User.name}</Text>
        <Text style={styles.texts}>{order.User.address}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons
          name="ios-checkmark-done"
          size={24}
          color="black"
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
};

export default OrderItem;
