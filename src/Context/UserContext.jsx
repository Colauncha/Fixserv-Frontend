// import { createContext, useContext, useState } from "react";

// const UserContext = createContext();

// export const UserProvider = ({children}) => {
//     const [firstName, setFirstName] = useState("");
//     const [time, setTime] = useState("");
//     const [location, setLocation] = useState("");

//     return (
//         <UserContext.Provider 
//           value={{
//             firstName, 
//             setFirstName,
//             time,
//             setTime,
//             location,
//             setLocation,
//         }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export const useUser = () => useContext(UserContext);


import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [firstName, setFirstName] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const [repairType, setRepairType] = useState("");
//   const [skillSet, setskillSet] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  return (
    <UserContext.Provider
      value={{
        firstName,
        setFirstName,
        time,
        setTime,
        location,
        setLocation,
        repairType,
        setRepairType,
        // skillSet, 
        // setskillSet,
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
