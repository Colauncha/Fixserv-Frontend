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

  const [NavbarComponent, setNavbarComponent] = useState(<Navbar bg={'bg-white'} />);
  
  useEffect(() => {
    console.log("Current Path:", path);
    if (
    path === "/" ||
    path.startsWith("/about-us")
    ) {
      setIsVisible(true);
      setNavbarComponent(<Navbar bg={'bg-white'}/>)
    } else if (path.startsWith("/contact-us")) {
      setIsVisible(true);
      setNavbarComponent(<Navbar bg={'bg-[#D8E3FC]'} userIconFill={'fill-[#D8E3FC]'} />)
    } else if (path.startsWith("/client")) {
      setIsVisible(true);
      setNavbarComponent(<DashboardNavbar />);
    } else if (path.startsWith("/artisans")) {
      setIsVisible(true);
      setNavbarComponent(<DashboardNavbar />);
    } else if (path.startsWith("/welcome")) {
      setIsVisible(true);
      setNavbarComponent(<HomeNavbar />);
    } else if (path.startsWith("/notify")) {
      setIsVisible(true);
      setNavbarComponent(<DashboardNavbar />);
    } else if (path.startsWith("/kyc_client")) {
      setIsVisible(true);
      setNavbarComponent(<Navbar />);
    } else if (path.startsWith("/terms-conditions")) {
      setIsVisible(true);
      setNavbarComponent(<Navbar bg={'bg-gradient-to-r from-blue-100 to-blue-0'} userIconFill={'fill-[#D8E3FC]'} />)
      } else if (path.startsWith("/privacy-policy")) {
      setIsVisible(true);
      setNavbarComponent(<Navbar bg={'bg-gradient-to-r from-blue-100 to-blue-0'} userIconFill={'fill-[#D8E3FC]'} />)
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