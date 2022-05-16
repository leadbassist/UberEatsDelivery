import { View, StyleSheet } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Marker } from "react-native-maps";

const CustomMarker = ({ data, type }) => {
  return (
    <Marker
      // key={order.id}
      title={data.name}
      description={data.address}
      coordinate={{
        latitude: data.lat,
        longitude: data.lng,
      }}
    >
      <View style={styles.markerIcon}>
        {type === "RESTAURANT" ? (
          <Entypo name="shop" size={24} color="white" />
        ) : (
          <Ionicons name="person" size={22} color="white" />
        )}
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerIcon: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 20,
  },
});

export default CustomMarker;
