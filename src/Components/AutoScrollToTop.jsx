import { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

function AutoScrollToTop({children}) {
  const location = useLocation();
  // const path = location.pathname
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location]);

  return <>{children}</>;
}

export default AutoScrollToTop