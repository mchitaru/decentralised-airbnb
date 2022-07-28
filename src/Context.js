import React, { createContext, useState } from "react";

export const userContext = createContext();
export const searchFilterContext = createContext();

const Context = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(
    new Date().toISOString().split("T")[0]
  );

  const now = new Date();
  const [checkOut, setCheckOut] = useState(
    new Date(new Date(now).setDate(now.getDate() + 1)).toISOString().split("T")[0]
  );
  //  const [destination,setDestination] = useState('')
  const [guests, setGuests] = useState(2);
  
  return (
    <userContext.Provider 
      value={{
        account, 
        setAccount,
        provider,
        setProvider
      }}
    >
      <searchFilterContext.Provider
        value={{
          destination,
          setDestination,
          checkIn,
          setCheckIn,
          checkOut,
          setCheckOut,
          guests,
          setGuests,
        }}
      >
        {children}
      </searchFilterContext.Provider>
    </userContext.Provider>
  );
};

export default Context;
