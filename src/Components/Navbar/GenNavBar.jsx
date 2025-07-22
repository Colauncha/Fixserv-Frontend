import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import SelectionNavbar from "./SelectionNavbar";
import HomeNavbar from "./HomeNavbar";
import DashboardNavbar from "./DashboardNavbar";

const GenNavBar = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const path = location.pathname;

  const [NavbarComponent, setNavbarComponent] = useState(<Navbar />);
  
  useEffect(() => {
    console.log("Current Path:", path);
    if (
    path === "/" ||
    path.startsWith("/about-us")
    // || path.startsWith("/contact") 
  ) {
      setIsVisible(true);
      setNavbarComponent(<Navbar />)
    } else if (path.startsWith("/client")) {
      setIsVisible(true);
      setNavbarComponent(<DashboardNavbar />);
      path.split('/').includes("selection") && setNavbarComponent(<SelectionNavbar />);
    } else if (path.startsWith("/artisans")) {
      setIsVisible(true);
      setNavbarComponent(<DashboardNavbar />);
    } else if (path.startsWith("/welcome")) {
      setIsVisible(true);
      setNavbarComponent(<HomeNavbar />);
    } else {
      setIsVisible(false);
    }
  }, [path]);


  return (
    (isVisible && 
      <div className="w-[100%] z-50">
        {NavbarComponent}
      </div>
    )
  )
}

export default GenNavBar