import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  image: {
    width: "25%",
    height: "100%",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  row: {
    flexDirection: "row",
    margin: 10,
    borderColor: "#3FC060",
    borderWidth: 2,
    borderRadius: 15,
    justifyContent: "space-between",
  },
  icon: {
    marginLeft: "auto",
    color: "white",
  },
  midSection: {
    flex: 1, // this will ensure the midSection does not overstep its allocated space
    marginLeft: 10,
    padding: 5,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  texts: {
    color: "grey",
  },
  deliveryTitle: {
    marginTop: 10,
  },
  iconContainer: {
    padding: 5,
    backgroundColor: "#3FC060",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
