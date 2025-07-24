// import React from "react";
// import DigitalImage from '../assets/uploads/Digital.png';
// import ProfessionalImage from '../assets/uploads/Professional.png';
// import ArtisansImage from '../assets/uploads/Artisans.png';

// const LandingSection = () => {
//   return (
//     <section className="w-full min-h-screen flex  justify-center items-center px-6 pt-6 pb-0 -mt-10 bg-white">
//       <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center">
//         {/* Left Side - Text Content */}
//         <div className="w-full md:w-1/2 space-y-6">
//           <h1 className="text-4xl font-bold text-left text-[#110000C2] leading-snug">
//             Digital <span className="text-[#779BE7]">marketplace that<br />connects you with</span><br />
//             professional artisans
//           </h1> <br/>

//           <p className='text-left text-lg text-[#779BE7]'>
//           Give your devices a reliable repair <br/> with just a few click.
//         </p> <br />

//           <div className="flex bg-[#ECF1FC] w-full max-w-md h-[47px] rounded-2xl items-center">
//             <input
//               title="Email"
//               id="email"
//               type="email"
//               placeholder="Your Email"
//               className="flex-1 m-1 border-2 border-[#ECF1FC] bg-[#ECF1FC] rounded-md h-10 p-2"
//               required
//             />
//             <button className="text-white px-6 h-full w-[180px] bg-[#7A9DF7] rounded-2xl">
//               Join the waitlist
//             </button>
//           </div>
//         </div>

//         {/* Right Side - Images */}
//         <div className="w-full md:w-1/2 relative mt-10 md:mt-0 h-[350px] flex items-center justify-center">
//           <img
//             src={DigitalImage}
//             alt="Digital repair"
//             className="w-40 h-45 rounded-lg absolute top-0 left-20"
//           />
//           <img
//             src={ProfessionalImage}
//             alt="Professional repair"
//             className="w-40 h-45 rounded-lg absolute top-48 left-20"
//           />
//           <img
//             src={ArtisansImage}
//             alt="Artisans repair"
//             className="w-40 h-72 rounded-lg absolute top-10 left-64"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LandingSection;

import React from "react";
import DigitalImage from '../assets/uploads/Digital.png';
import ProfessionalImage from '../assets/uploads/Professional.png';
import ArtisansImage from '../assets/uploads/Artisans.png';

const LandingSection = () => {
  return (
    <section className="w-full min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-16 pt-16 pb-6 bg-white">
      <div className="max-w-7xl mx-auto w-full flex flex-col-reverse md:flex-row justify-between items-center gap-10">
        
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#110000C2]">
            Digital <span className="text-[#779BE7]">marketplace that<br className="hidden sm:block" />connects you with</span><br />
            professional artisans
          </h1>

          <p className="text-[#779BE7] text-base sm:text-lg lg:text-xl">
            Give your devices a reliable repair<br className="hidden sm:block" /> with just a few clicks.
          </p>

          <div className="flex flex-col sm:flex-row items-center bg-[#ECF1FC] rounded-2xl w-full max-w-md p-2 space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              title="Email"
              id="email"
              type="email"
              placeholder="Your Email"
              className="flex-1 border border-gray-300 bg-[#ECF1FC] rounded-md h-12 px-4 text-sm"
              required
            />
            <button className="text-white w-full sm:w-[180px] h-12 bg-[#7A9DF7] rounded-2xl text-sm font-semibold">
              Join the waitlist
            </button>
          </div>
        </div>

        {/* Right Side - Images */}
        <div className="w-full md:w-1/2 relative flex justify-center items-center h-[350px] sm:h-[400px] lg:h-[500px]">
          <img
            src={DigitalImage}
            alt="Digital repair"
            className="w-24 sm:w-32 lg:w-40 h-auto rounded-lg absolute top-0 left-1/4"
          />
          <img
            src={ProfessionalImage}
            alt="Professional repair"
            className="w-24 sm:w-32 lg:w-40 h-auto rounded-lg absolute bottom-0 left-1/4"
          />
          <img
            src={ArtisansImage}
            alt="Artisans repair"
            className="w-32 sm:w-40 lg:w-48 h-auto rounded-lg absolute top-1/4 right-10"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingSection;
