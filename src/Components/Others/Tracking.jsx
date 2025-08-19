import {useEffect} from 'react'
import { setCookie, getCookie } from '../../util/Cookies';

const Tracking = ({children}) => {
  const IncrVisitorsCount = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEWS_LETTER_URL}/api/tracking/visitors/`,
        {
          method: 'POST',
          headers: {
            'x-clientname': 'FIXSERV'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to push visitors count');
      }

      const data = await response.json();
      console.log('Visitors count incremented:', data);
    } catch (err) {
      console.error('Error fetching visitors count:', err);
    }
  };

  useEffect(() => {
    const dailyVisit = getCookie('dailyVisit');
    if (!dailyVisit) {
      IncrVisitorsCount();
      setCookie('dailyVisit', 'true', 1, { sameSite: 'Lax' });
    }
  }
  , []);

  return (
    <>{children}</>
  )
}

export default Tracking