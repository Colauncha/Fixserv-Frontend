import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PhoneImage from '../assets/uploads/Phone_call.png';  
import EmailImage from '../assets/uploads/Email.png';
import Facebook from '../assets/icons/FB.png'; 
import Instagram from '../assets/icons/instagram icon.png'; 
import LinkedIn from '../assets/icons/in.png';
import Twitter from '../assets/icons/X.png';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (path.startsWith('/auth')) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

  }, [path]);
    return (        
      (isVisible && <footer className="bg-[#7A9DF7] text-[#ECF1FC] px-10 py-10 mt-1">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-24">
   
        <div>
        <div className="flex items-center space-x-2 text-xl font-JejuMyeongjo text-[#7A9DF7]">
          <span className="bg-[#ECF1FC] font-JejuMyeongjo text-[#7A9DF7] w-15 h-15 items-center 
           justify-center flex rounded-lg">FS</span>
          <span className='text-[#ECF1FC] text-xl font-JejuMyeongjo'>Fixserv</span> 
        </div>
            <p className="text-sm mt-3">
              Provides a seamless, reliable marketplace<br/> connecting customers
                 with verified<br/> professional gadget repairers.
            </p>
                 <div className='flex items-center space-x-4 mt-4'>
                 <img src={PhoneImage} alt='phone' className='w-6 h-6' /> 
                 <p className="text-sm">+234 987654321</p> 
                 </div>

                  <div className='flex items-center space-x-4 mt-2'>
                   <img src={EmailImage} alt='email' className='w-6 h-6' />   
                    <p className="text-sm">fixserv@gmail.com</p>
                  </div>
            <h4 className='text-md mt-4 mb-2'>Follow us</h4>
            <div className="flex space-x-3">
              <img src={Facebook} alt='fb' className='w-5 h-5' />
              <img src={Instagram} alt='instagram' className='w-6 h-6' />
              <img src={LinkedIn} alt='in' className='w-5 h-5' />
              <img src={Twitter} alt='x' className='w-5 h-5' />
              </div>
          </div>
          <div>
            
            <ul className="space-y-3 text-md">
              <li>Home</li>
              <li>About us</li>
              <li>Contact us</li>
              <li>Help and Support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-md mb-4">Community</h4>
           <ul className="space-y-3 text-md mb-24">
            <li>Community Hub</li>
            <li>Events</li>
            </ul>

           <div className="flex flex-col w-84 bg-[#FFFFFF] rounded-md sm:flex-row justify-center items-center">
            <input
              type="email"
              placeholder="Enter working email"
              className="w-40 h-12 rounded-md sm:w-72 pl-10 text-gray-900 focus:outline-none"
            />
            
            <button
               className="bg-[#7A9DF7] h-10 px-2 rounded-md text-[#FFFFFF] font-medium text-sm 
               mt-2 sm:mt-0 sm:-ml-6 mr-6">
              Book a service
            </button>
          </div>
          
          </div>        
        </div>
      </footer>)
    );
  };
export default Footer;  
