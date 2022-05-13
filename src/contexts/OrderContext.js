import { Auth, DataStore } from "aws-amplify";
import { createContext, useEffect, useState, useContext } from "react";
import { Transporter, Order, User, OrderDish } from "../models";
import { useAuthContext } from "./AuthContext";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbTransporter } = useAuthContext();
  const [order, setOrder] = useState();
  const [user, setUser] = useState();
  const [dishes, setDishes] = useState();

  const fetchOrder = async (id) => {
    if (!id) {
      setOrder(null);
      return;
    }
    const fetchedOrder = await DataStore.query(Order, id);
    setOrder(fetchedOrder);

    DataStore.query(User, fetchedOrder.userID).then(setUser);

    DataStore.query(OrderDish, (od) => od.orderID("eq", fetchedOrder.id)).then(
      setDishes
    );
  };

  const acceptOrder = () => {
    // update the order, change STATUS, and assign the transporter
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "ACCEPTED";
        updated.Transporter = dbTransporter;
      })
    ).then(setOrder);
  };

  const pickUpOrder = () => {
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "PICKED_UP";
      })
    ).then(setOrder);
  };

  const completeOrder = () => {
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "COMPLETED";
      })
    ).then(setOrder);
  };
  return (
    <OrderContext.Provider
      value={{
        acceptOrder,
        order,
        user,
        dishes,
        fetchOrder,
        pickUpOrder,
        completeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);
