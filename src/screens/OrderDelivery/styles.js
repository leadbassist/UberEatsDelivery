import { StyleSheet } from "react-native";

export default StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "lightblue",
  },
  handleIndicator: {
    backgroundColor: "#08a3e0a6",
    width: "25%",
    marginTop: 10,
  },
  bottomsheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  bottomsheetHeaderText: {
    fontSize: 25,
    letterSpacing: 0.75,
  },
  bottomsheetHeaderIcon: {
    marginHorizontal: 10,
  },
  restaurantName: {
    fontSize: 25,
    letterSpacing: 0.75,
    paddingVertical: 20,
  },
  midSectionRows: {
    flexDirection: "row",
    marginBottom: 10,
  },
  restaurantInfo: {
    fontSize: 18,
    color: "grey",
    fontWeight: "600",
    marginLeft: 15,
  },
  midSection: {
    paddingHorizontal: 20,
  },
  menuItemsContainer: {
    borderTopWidth: 1,
    borderColor: "#08a3e0a6",
    paddingTop: 20,
  },
  menuItems: {
    fontSize: 15,
    color: "grey",
    fontWeight: "500",
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: "auto",
    marginVertical: 30,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    paddingVertical: 15,
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  markerIcon: {
    backgroundColor: "#444444",
    padding: 5,
    borderRadius: 20,
  },
  backIcon: {
    top: 40,
    left: 15,
    position: "absolute", // this will ensure the button is on top of everything
  },
});
