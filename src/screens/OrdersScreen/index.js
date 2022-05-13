import { useRef, useMemo, useState, useEffect } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import orders from "../../../assets/data/orders.json";
import OrderItem from "../../OrderItem";
import styles from "./styles";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import { DataStore } from "aws-amplify";
import { Order } from "../../models";

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const bottomSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();

  const snapPoints = useMemo(() => ["12%", "95%"], []);

  useEffect(() => {
    DataStore.query(Order, (order) =>
      order.status("eq", "READY_FOR_PICKUP")
    ).then(setOrders);
  }, []);

  console.log("orders list", orders);

  return (
    <View style={styles.rootContainer}>
      <MapView
        style={{
          height,
          width,
        }}
        showsUserLocation
        followsUserLocation
      >
        {orders.map((order) => (
          <Marker
            key={order.id}
            title={order.Restaurant.name}
            description={order.Restaurant.address}
            coordinate={{
              latitude: order.Restaurant.lat,
              longitude: order.Restaurant.lng,
            }}
          >
            <View style={styles.markerIcon}>
              <Entypo name="shop" size={24} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.title}>You're Online</Text>
          <Text style={styles.subtitle}>Available Orders: {orders.length}</Text>
        </View>
        <BottomSheetFlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </View>
  );
};

export default OrderScreen;
