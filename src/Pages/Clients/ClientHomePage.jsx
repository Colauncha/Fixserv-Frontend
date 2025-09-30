// import React from 'react'
// import ClientHome from '../../Components/Guest/ClientHome'

// const ClientHomePage = () => {


//   return (
//     <div>
//       <ClientHome />
//     </div>
//   )
// }

// export default ClientHomePage



import React, { useEffect, useState } from 'react';
import ClientHome from '../../Components/Guest/ClientHome';
import axios from 'axios';

const ClientHomePage = () => {
  const [artisans, setArtisans] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); 

  const fetchArtisans = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/artisans`
      );
      setArtisans(res.data);
    } catch (error) {
      console.error('Failed to fetch artisans:', error);
    }
  };

  useEffect(() => {
    fetchArtisans();

    // 
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(loggedInUser);
  }, []);

  return (
    <ClientHome
      artisans={artisans}
      currentUser={currentUser}
      refreshArtisans={fetchArtisans}
    />
  );
};

export default ClientHomePage;
