import { useRef, useEffect, useState } from "react";
import { View, useWindowDimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useOrderContext } from "../../contexts/OrderContext";
import { useAuthContext } from "../../contexts/AuthContext";
import BottomSheetDetails from "./BottomSheetDetails";
import CustomMarker from "../../components/CustomMarker";
import { DataStore } from "aws-amplify";
import { Transporter } from "../../models";

const OrderDelivery = () => {
  const { order, user, fetchOrder } = useOrderContext();
  const { dbTransporter } = useAuthContext();

  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);

  const mapRef = useRef(null);

  const { width, height } = useWindowDimensions();

  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params?.id;

  useEffect(() => {
    fetchOrder(id);
  }, [id]);

  useEffect(() => {
    if (!driverLocation) {
      return;
    }
    DataStore.save(
      Transporter.copyOf(dbTransporter, (updated) => {
        updated.lat = driverLocation.latitude;
        updated.lng = driverLocation.longitude;
      })
    );
  }, [driverLocation]);

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
        distanceInterval: 500, // reduce this number for more frequent updates(API calls)
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

  const zoomInOnDriver = () => {
    mapRef.current.animateToRegion({
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      // will slightly zoom-in by 0.01, makes it look animated
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const restaurantLocation = {
    latitude: order?.Restaurant?.lat,
    longitude: order?.Restaurant?.lng,
  };
  const deliveryLocation = {
    latitude: user?.lat,
    longitude: user?.lng,
  };

  if (!order || !user || !driverLocation) {
    return <ActivityIndicator size={"large"} color="gray" />;
  }

  // console.log("dishItems are: ", dishItems);

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
            order.status === "ACCEPTED" ? restaurantLocation : deliveryLocation
          }
          strokeWidth={5}
          waypoints={
            order.status === "READY_FOR_PICKUP" ? [restaurantLocation] : []
          }
          strokeColor="#e6404d"
          apikey={"AIzaSyBkwzebsS2WZ7om72e-WJ017ZmsHdKR68o"}
          onReady={(result) => {
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />
        <CustomMarker data={order.Restaurant} type="RESTAURANT" />
        <CustomMarker data={user} type="USER" />
      </MapView>
      <BottomSheetDetails
        totalKm={totalKm}
        totalMinutes={totalMinutes}
        onAccepted={zoomInOnDriver}
      />
      {order.status === "READY_FOR_PICKUP" && (
        <Ionicons
          onPress={() => navigation.goBack()}
          name="caret-back-circle-sharp"
          size={40}
          color="black"
          style={styles.backIcon}
        />
      )}
    </View>
  );
};

export default OrderDelivery;
