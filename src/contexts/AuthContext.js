import { Auth, DataStore } from "aws-amplify";
import { createContext, useEffect, useState, useContext } from "react";
import { Transporter } from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbTransporter, setDbTransporter] = useState(null);

  const sub = authUser?.attributes?.sub;

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
  }, []);

  useEffect(() => {
    // checking in db to see if the authenticated Transporter exists by checking their "sub".
    // THEN, set DbTransporter state to the FIRST transporter which is the latest transporter
    // who signed in
    DataStore.query(Transporter, (transporter) =>
      transporter.sub("eq", sub)
    ).then((transporters) => setDbTransporter(transporters[0]));
  }, [sub]);

  // console.log(dbTransporter);

  return (
    <AuthContext.Provider
      value={{ authUser, dbTransporter, sub, setDbTransporter }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
