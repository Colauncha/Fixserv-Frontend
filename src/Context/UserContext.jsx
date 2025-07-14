import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [id, setId] = useState("");
  const [fullName, setFullName] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const [repairType, setRepairType] = useState("");
  const [skillSet, setskillSet] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  return (
    <UserContext.Provider
      value={{
        id,
        setId, 
        fullName,
        setFullName,
        time,
        setTime,
        location,
        setLocation,
        repairType,
        setRepairType,
        skillSet, 
        setskillSet,
        duration,
        setDuration,
        price,
        setPrice,
        status,
        setStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
