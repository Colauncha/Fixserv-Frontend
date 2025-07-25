// import { useState, useEffect } from 'react';
// import { useLocation, Link } from 'react-router-dom';
// import PhoneImage from '../assets/uploads/Phone_call.png';  
// import EmailImage from '../assets/uploads/Email.png';
// import Facebook from '../assets/icons/FB.png'; 
// import Instagram from '../assets/icons/instagram icon.png'; 
// import LinkedIn from '../assets/icons/in.png';
// import Twitter from '../assets/icons/X.png';

// const Footer = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const location = useLocation();
//   const path = location.pathname;

//   useEffect(() => {
//     if (path.startsWith('/auth') || path === '/contact' || path === '/contact-us') {
//       setIsVisible(false);
//     } else {
//       setIsVisible(true);
//     }
//   }, [path]);
  
//     return (        
//       (isVisible && <footer className="bg-[#7A9DF7] text-[#ECF1FC] px-10 py-10 mt-1">
//          <div className="grid grid-cols-1 md:grid-cols-4 gap-24">
   
//         <div>
//         <div className="flex items-center space-x-2 text-xl font-JejuMyeongjo text-[#7A9DF7]">
//           <span className="bg-[#ECF1FC] font-JejuMyeongjo text-[#7A9DF7] w-15 h-15 items-center 
//            justify-center flex rounded-lg">FS</span>
//           <span className='text-[#ECF1FC] text-xl font-JejuMyeongjo'>Fixserv</span> 
//         </div>
//             <p className="text-sm mt-3">
//               Provides a seamless, reliable marketplace<br/> connecting customers
//                  with verified<br/> professional gadget repairers.
//             </p>
//                  <div className='flex items-center space-x-4 mt-4'>
//                  <img src={PhoneImage} alt='phone' className='w-6 h-6' /> 
//                  <p className="text-sm">+234 987654321</p> 
//                  </div>

//                   <div className='flex items-center space-x-4 mt-2'>
//                    <img src={EmailImage} alt='email' className='w-6 h-6' />   
//                     <p className="text-sm">fixserv@gmail.com</p>
//                   </div>
//             <h4 className='text-md mt-4 mb-2'>Follow us</h4>
//             <div className="flex space-x-3">
//               <img src={Facebook} alt='fb' className='w-5 h-5' />
//               <img src={Instagram} alt='instagram' className='w-6 h-6' />
//               <img src={LinkedIn} alt='in' className='w-5 h-5' />
//               <img src={Twitter} alt='x' className='w-5 h-5' />
//               </div>
//           </div>
//           <div>
            
//             <ul className="space-y-3 text-md">
//               <li><Link to="/" className="hover:underline">Home</Link></li>
//               <li><Link to="/about-us" className="hover:underline">About us</Link></li>
//               <li><Link to="/contact-us" className="hover:underline">Contact us</Link></li>
//               <li><Link to="/support" className="hover:underline">Help and Support</Link></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-semibold text-md mb-4">Community</h4>
//            <ul className="space-y-3 text-md mb-24">
//             <li>Community Hub</li>
//             <li>Events</li>
//             </ul>

//            <div className="flex flex-col w-84 bg-[#FFFFFF] rounded-md sm:flex-row justify-center items-center">
//             <input
//               type="email"
//               placeholder="Enter working email"
//               className="w-40 h-12 rounded-md sm:w-72 pl-10 text-gray-900 focus:outline-none"
//             />
            
//             <button
//                className="bg-[#7A9DF7] h-10 px-2 rounded-md text-[#FFFFFF] font-medium text-sm 
//                mt-2 sm:mt-0 sm:-ml-6 mr-6">
//               Book a service
//             </button>
//           </div>
          
//           </div>        
//         </div>
//       </footer>)
//     );
//   };
// export default Footer;  
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
    if (path.startsWith('/auth') || path === '/contact' || path === '/contact-us') {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [path]);

  return (
    isVisible && (
      <footer className="bg-gradient-to-l from-[#7A9DF7] to-[#7A9Dd7] text-[#ECF1FC] px-10 py-12 mt-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-24">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-2 text-xl font-JejuMyeongjo">
              <span className="bg-[#ECF1FC] text-[#7A9DF7] w-10 h-10 flex items-center justify-center rounded-lg font-bold">
                FS
              </span>
              <span className="text-[#ECF1FC] text-xl">Fixserv</span>
            </div>
            <p className="text-sm mt-3">
              A seamless, reliable marketplace connecting customers
              with verified professional gadget repairers.
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <img src={PhoneImage} alt="Phone" className="w-5 h-5" />
                <span className="text-sm">+234 987654321</span>
              </div>
              <div className="flex items-center space-x-2">
                <img src={EmailImage} alt="Email" className="w-5 h-5" />
                <span className="text-sm">fixserv@gmail.com</span>
              </div>
            </div>

            <h4 className="mt-5 mb-2 text-md font-semibold">Follow us</h4>
            <div className="flex space-x-3">
              <img src={Facebook} alt="Facebook" className="w-5 h-5" />
              <img src={Instagram} alt="Instagram" className="w-5 h-5" />
              <img src={LinkedIn} alt="LinkedIn" className="w-5 h-5" />
              <img src={Twitter} alt="Twitter/X" className="w-5 h-5" />
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-md mb-4">Navigation</h4>
            <ul className="space-y-3 text-md">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about-us" className="hover:underline">About Us</Link></li>
              <li><Link to="/contact-us" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/support" className="hover:underline">Help & Support</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-md mb-4">Community</h4>
            <ul className="space-y-3 text-md">
              <li><Link to="/community" className="hover:underline">Community Hub</Link></li>
              <li><Link to="/events" className="hover:underline">Events</Link></li>
            </ul>
          </div>

          {/* Email Subscription */}
          <div>
            <h4 className="font-semibold text-md mb-4">Stay Updated</h4>
            <div className="flex flex-col gap-3 items-center  rounded-md p-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 px-3 shadow-lg text-gray-800 bg-white rounded-xl focus:outline-none"
              />
              <button className="bg-gradient-to-r from-[#7A9DF7] to-[#7A9Dd7] w-full text-white shadow-lg h-10 px-4 rounded-xl cursor-pointer mt-2 sm:mt-0 sm:ml-2 text-sm font-medium hover:shadow-md hover:bg-gradient-to-l hover:from-[#7a9df7d5] hover:to-[#7a9ed7d5]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-[#ECF1FC]/30 mt-10 pt-6 flex flex-col md:flex-row gap-10 justify-center items-center text-sm">
          <p className="mb-2 md:mb-0">© {new Date().getFullYear()} Fixserv. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link to="/terms-conditions" className="hover:underline">Terms & Conditions</Link>
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    )
  );
};

export default Footer;
