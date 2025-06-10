import React from 'react';
import ArrowImage from '../assets/uploads/ArrowUp.png';
import PhoneImage from '../assets/uploads/Phone_call.png';  
import EmailImage from '../assets/uploads/Email.png';
import Facebook from '../assets/icons/FB.png'; 
import Instagram from '../assets/icons/instagram icon.png'; 
import LinkedIn from '../assets/icons/in.png';
import Twitter from '../assets/icons/X.png';

const Footer = () => {
    return (  
        
      <footer className="bg-[#7A9DF7] text-[#ECF1FC] px-10 py-10 mt-1">
        <div className="flex flex-cols-1 md:grid-cols-4 items-stretch gap-50 h-96">
   
        <div>
        <div className="flex items-center space-x-2 text-xl font-JejuMyeongjo text-[#7A9DF7]">
          <span className="bg-[#ECF1FC] font-JejuMyeongjo text-[#7A9DF7] w-15 h-15 items-center 
           justify-center flex rounded-lg">FS</span>
          <span className='text-[#ECF1FC] text-xl font-JejuMyeongjo'>Fixserv</span> 
        </div>
            <p className="text-md mt-2">Provides a seamless, reliable marketplace<br/> connecting customers
                 with verified<br/> professional gadget repairers.</p> <br/>
                 <div className='flex space-x-4'>
                 <img src={PhoneImage} alt='phone' className='w-10 h-10' /> 
                 <p className="text-md mt-2">+234 987654321</p> <br/>
                 </div>
                  <div className='flex space-x-4'>
              <img src={EmailImage} alt='email' className='w-10 h-10' />   
            <p className="text-md mt-2">fixserv@gmail.com</p> <br/>
            </div>
            <h4 className='py-3 text-md'>Follow us</h4>
            <div className="flex space-x-4">
              <img src={Facebook} alt='fb' className='w-4 h-4 space-x-20' />
              <img src={Instagram} alt='instagram' className='w-5 h-5' />
              <img src={LinkedIn} alt='in' className='w-4 h-4' />
              <img src={Twitter} alt='x' className='w-4 h-4' />
              </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Home</h4> <br/>
            <ul className="space-y-3 text-sm">
              <li>About us</li>
              <li>Contact us</li>
              <li>Help and Support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Services</h4> <br/>
            <ul className="space-y-3 text-sm">
              <li>Technical repair</li>
              <li>Refrigerator</li>
              <li>Gadget</li>
              <li>Dishwasher</li>
              <li>Game Gadgets</li>
            </ul> <br/>

                    {/* Book a service Section */}
           <div className="flex flex-col bg-[#FFFFFF] rounded-md sm:flex-row justify-center items-center">
            <input
              type="email"
              placeholder="Enter working email"
              className="w-40 h-12 rounded-md sm:w-72 pl-10 text-gray-900 focus:outline-none"
            />
            <button className="bg-[#7A9DF7] w-32 h-8 rounded-md text-[#FFFFFF] font-medium">
              Book a service
            </button>
          </div>
          
          </div>        
        </div>
      </footer>
    );
  };
export default Footer;  