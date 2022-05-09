import { useRef, useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import orders from "../../../assets/data/orders.json";
import styles from "./styles";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";

const order = orders[0];

const restaurantLocation = {
  latitude: order.Restaurant.lat,
  longitude: order.Restaurant.lng,
};
const deliveryLocation = {
  latitude: order.User.lat,
  longitude: order.User.lng,
};

const ORDER_STATUSES = {
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
};

const OrderDelivery = () => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState(
    ORDER_STATUSES.READY_FOR_PICKUP
  );
  const [isDriverClose, setIsDriverClose] = useState(false);

  const bottomSheetRef = useRef(null);

  const mapRef = useRef(null);

  const { width, height } = useWindowDimensions();

  const snapPoints = useMemo(() => ["12%", "95%"], []);

  const navigation = useNavigation();

  useEffect(() => {
    const getDeliveryLocations = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === "granted") {
        console.log("Request not granted");
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    getDeliveryLocations();

    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 100,
      },
      (updatedLocation) => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      }
    );
    return foregroundSubscription;
  }, []);

  if (!driverLocation) {
    return <ActivityIndicator size={"large"} />;
  }

  const onButtonPressed = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      bottomSheetRef.current?.collapse();
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        // will slightly zoom-in by 0.01, makes it look animated
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setDeliveryStatus(ORDER_STATUSES.ACCEPTED);
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      bottomSheetRef.current?.collapse();
      setDeliveryStatus(ORDER_STATUSES.PICKED_UP);
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP) {
      bottomSheetRef.current?.collapse();
      navigation.goBack();
      console.warn("Delivery Completed");
    }
  };

  const renderButtonTitle = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      return "Accept Order";
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      return "Pick-Up Order";
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP) {
      return "Completed Delivery";
    }
  };

  const isButtonDisabled = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      return false;
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED && isDriverClose) {
      return false;
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP && isDriverClose) {
      return false;
    }
    return true;
  };

  return (
    <View style={styles.rootContainer}>
      <MapView
        ref={mapRef}
        style={{
          height,
          width,
        }}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.07, // how zoomed in should the map be
          longitudeDelta: 0.07, // how zoomed in should the map be
        }}
      >
        <MapViewDirections
          origin={driverLocation}
          destination={
            deliveryStatus === ORDER_STATUSES.ACCEPTED
              ? restaurantLocation
              : deliveryLocation
          }
          strokeWidth={5}
          waypoints={
            deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP
              ? [restaurantLocation]
              : []
          }
          strokeColor="#e6404d"
          apikey={"AIzaSyBkwzebsS2WZ7om72e-WJ017ZmsHdKR68o"}
          onReady={(result) => {
            setIsDriverClose(result.distance <= 0.1);
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />
        {/* restaurant marker */}
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

        {/* user marker */}
        <Marker
          key={"user " + order.id}
          title={order.User.name}
          description={order.User.address}
          coordinate={{
            latitude: order.User.lat,
            longitude: order.User.lng,
          }}
        >
          <View style={styles.markerIcon}>
            <Ionicons name="person" size={22} color="white" />
          </View>
        </Marker>
      </MapView>

      <Ionicons
        onPress={() => navigation.goBack()}
        name="caret-back-circle-sharp"
        size={40}
        color="black"
        style={styles.backIcon}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.bottomsheetHeader}>
          <Text style={styles.bottomsheetHeaderText}>
            {totalMinutes.toFixed(0)} min
          </Text>
          <MaterialIcons
            name="shopping-bag"
            size={24}
            color="#3FC060"
            style={styles.bottomsheetHeaderIcon}
          />
          <Text style={styles.bottomsheetHeaderText}>
            {totalKm.toFixed(1)} km
          </Text>
        </View>
        <View style={styles.midSection}>
          <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
          <View style={styles.midSectionRows}>
            <FontAwesome5 name="store" size={24} color="black" />
            <Text style={styles.restaurantInfo}>
              {order.Restaurant.address}
            </Text>
          </View>
          <View style={styles.midSectionRows}>
            <Ionicons name="location-sharp" size={24} color="black" />
            <Text style={styles.restaurantInfo}>{order.User.address}</Text>
          </View>

          <View style={styles.menuItemsContainer}>
            <Text style={styles.menuItems}>Onion Rings x 1</Text>
            <Text style={styles.menuItems}>Big Mac x 3</Text>
            <Text style={styles.menuItems}>Bag of Dicks x 1</Text>
            <Text style={styles.menuItems}>Cheese from my crevice x 4</Text>
          </View>
        </View>
        <Pressable
          onPress={onButtonPressed}
          style={{
            ...styles.buttonContainer,
            backgroundColor: isButtonDisabled() ? "grey" : "#3FC060",
          }}
          disabled={isButtonDisabled()}
        >
          <Text style={styles.buttonText}>{renderButtonTitle()}</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
};

export default OrderDelivery;
