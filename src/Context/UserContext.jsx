import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [firstName, setFirstName] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");

    return (
        <UserContext.Provider 
          value={{
            firstName, 
            setFirstName,
            time,
            setTime,
            location,
            setLocation,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
