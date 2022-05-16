import { useRef, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { useOrderContext } from "../../contexts/OrderContext";
import { useNavigation } from "@react-navigation/native";

const STATUS_TO_TITLE = {
  READY_FOR_PICKUP: "Accept Order",
  ACCEPTED: "Pick-Up Order",
  PICKED_UP: "Complete Delivery",
};

const BottomSheetDetails = (props) => {
  const { totalKm, totalMinutes, onAccepted } = props;
  const isDriverClose = totalKm <= 1; // descrease this number for higher accuracy

  const { order, user, dishes, acceptOrder, pickUpOrder, completeOrder } =
    useOrderContext();

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["12%", "95%"], []);

  const navigation = useNavigation();

  const onButtonPressed = async () => {
    const { status } = order; // destructuring status from order
    if (status === "READY_FOR_PICKUP") {
      bottomSheetRef.current?.collapse();
      acceptOrder();
      onAccepted();
    }
    if (status === "ACCEPTED") {
      bottomSheetRef.current?.collapse();
      pickUpOrder();
    }
    if (status === "PICKED_UP") {
      await completeOrder();
      bottomSheetRef.current?.collapse();
      navigation.goBack();
      // console.warn("Delivery Completed");
    }
  };

  const isButtonDisabled = () => {
    const { status } = order;
    if (status === "READY_FOR_PICKUP") {
      return false;
    }
    if ((status === "ACCEPTED" || status === "PICKED_UP") && isDriverClose) {
      return false;
    }
    return true;
  };

  return (
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
          <Text style={styles.restaurantInfo}>{order.Restaurant.address}</Text>
        </View>
        <View style={styles.midSectionRows}>
          <Ionicons name="location-sharp" size={24} color="black" />
          <Text style={styles.restaurantInfo}>{user?.address}</Text>
        </View>

        <View style={styles.menuItemsContainer}>
          {dishes?.map((dishItem) => (
            <Text style={styles.menuItems} key={dishItem.id}>
              {dishItem.Dish.name} x {dishItem.quantity}
            </Text>
          ))}
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
        <Text style={styles.buttonText}>{STATUS_TO_TITLE[order.status]}</Text>
      </Pressable>
    </BottomSheet>
  );
};

export default BottomSheetDetails;
