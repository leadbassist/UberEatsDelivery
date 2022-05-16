import { Auth, DataStore } from "aws-amplify";
import { createContext, useEffect, useState, useContext } from "react";
import { Transporter } from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbTransporter, setDbTransporter] = useState(null);
  const [loading, setLoading] = useState(true);

  const sub = authUser?.attributes?.sub;

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
  }, []);

  useEffect(() => {
    if (!sub) {
      return;
    }

    // checking in db to see if the authenticated Transporter exists by checking their "sub".
    // THEN, set DbTransporter state to the FIRST transporter which is the latest transporter
    // who signed in
    DataStore.query(Transporter, (transporter) =>
      transporter.sub("eq", sub)
    ).then((transporters) => {
      setDbTransporter(transporters[0]);
      setLoading(false);
    });
  }, [sub]);

  // console.log("dbTransporter: ", dbTransporter);

  useEffect(() => {
    if (!dbTransporter) {
      return;
    }

    const subscription = DataStore.observe(
      Transporter,
      dbTransporter.id
    ).subscribe((msg) => {
      if (msg.opType === "UPDATE") {
        setDbTransporter(msg.element);
      }
    });
    return () => subscription.unsubscribe();
  }, [dbTransporter]);

  return (
    <AuthContext.Provider
      value={{ authUser, dbTransporter, sub, setDbTransporter, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
