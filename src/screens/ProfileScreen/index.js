import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from "aws-amplify";
import { TransportationModes, Transporter } from "../../models";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const { dbTransporter, sub, setDbTransporter } = useAuthContext();

  const [name, setName] = useState(dbTransporter?.name || "");
  const [transportationMode, setTransportationMode] = useState(
    TransportationModes.DRIVING
  );

  const navigation = useNavigation();

  const onSave = async () => {
    if (dbTransporter) {
      await updateTransporter();
    } else {
      await createTransporter();
    }
    navigation.goBack();
  };

  const updateTransporter = async () => {
    const transporter = await DataStore.save(
      Transporter.copyOf(dbTransporter, (updated) => {
        updated.name = name;
        updated.transportationMode = transportationMode;
      })
    );
    setDbTransporter(transporter);
  };

  const createTransporter = async () => {
    try {
      const transporter = await DataStore.save(
        new Transporter({
          name,
          sub,
          transportationMode,
        })
      );
      setDbTransporter(transporter);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />

      <View style={styles.transMode}>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.DRIVING)}
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                transportationMode === TransportationModes.DRIVING
                  ? "#3FC060"
                  : "#222222",
            },
          ]}
        >
          <FontAwesome5
            name="car"
            size={40}
            color={
              transportationMode === TransportationModes.DRIVING
                ? "#000000"
                : "white"
            }
          />
        </Pressable>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.BICYCLING)}
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                transportationMode === TransportationModes.BICYCLING
                  ? "#3FC060"
                  : "#222222",
            },
          ]}
        >
          <MaterialIcons
            name="directions-bike"
            size={40}
            color={
              transportationMode === TransportationModes.BICYCLING
                ? "#000000"
                : "white"
            }
          />
        </Pressable>
      </View>
      <Button onPress={onSave} title="Save" />
      <Text onPress={() => Auth.signOut()} style={styles.signOut}>
        Sign out
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
  signOut: {
    textAlign: "center",
    color: "red",
    margin: 10,
  },
  iconContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 5,
    borderColor: "#222222",
    borderRadius: 10,
  },
  transMode: {
    flexDirection: "row",
  },
});

export default ProfileScreen;
