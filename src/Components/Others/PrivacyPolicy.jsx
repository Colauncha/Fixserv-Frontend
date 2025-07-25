import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-100 to-blue-0 text-black p-10">
      <div className="max-w-full mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-9 text-blue-700 cursor-pointer">Privacy <span className="text-purple-700">Policy</span></h2>
        {/* <div className="flex gap-4 mb-6 border-b pb-2 text-gray-600">
          <span className="cursor-pointer hover:text-black">Terms</span>
          <span className="font-semibold text-black border-b-2 border-black cursor-pointer">
            Privacy Policy
          </span>
        </div> */}

        <h3 className="text-xl flex justify-center font-semibold mb-8">Welcome to our privacy policy!</h3>
        <p className="mb-4">
          We value your privacy and are committed to protecting your personal information. This policy outlines the data we collect, how we use it, and your rights regarding your data.
        </p>
        <p className="mb-4">
          We collect your personal data only when necessary and for legitimate purposes, such as account registration and customer support. We never sell your data.
        </p>
        <p className="mb-4">
          By using our services, you consent to the practices described in this policy. Please read it carefully and contact us if you have any questions.
        </p>

        <h3 className="text-xl font-semibold mt-10 mb-8">Data Collection</h3>

        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <span className="font-semibold">Personal Information:</span> We collect your full name, email address, phone number, and location during registration to create your user profile.
          </li>
          <li>
            <span className="font-semibold">Usage Data:</span> We collect information on how you use the platform (pages visited, features used) to improve our services and user experience.
          </li>
          <li>
            <span className="font-semibold">Device Information:</span> Your device type, browser, and operating system may be collected to ensure compatibility and troubleshoot issues.
          </li>
        </ol>
      </div>

    </div>
  );
};

export default PrivacyPolicy;


// import React from "react";

// const PrivacyPolicy = () => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-start bg-white text-black px-4 py-10">
//       <div className="max-w-4xl w-full text-center">
//         <h2 className="text-3xl font-bold mb-9 text-blue-700 cursor-pointer">
//           Privacy <span className="text-purple-700">Policy</span>
//         </h2>
//         {/* <div className="flex gap-4 mb-6 border-b pb-2 text-gray-600">
//            <span className="cursor-pointer hover:text-black">Terms</span>
//            <span className="font-semibold text-black border-b-2 border-black cursor-pointer">
//              Privacy Policy
//            </span>
//          </div> */}

//         <div className="bg-gradient-to-b from-purple-100 to-blue-100 rounded-full px-10 py-14 sm:px-14 sm:py-18 shadow-md transition-all duration-300">
//           <h3 className="text-xl font-semibold mb-8">
//             Welcome to our privacy policy!
//           </h3>

//           <div className="space-y-4 text-left text-gray-700 leading-relaxed">
//             <p>
//               We value your privacy and are committed to protecting your personal information. This policy outlines the data we collect, how we use it, and your rights regarding your data.
//             </p>
//             <p>
//               We collect your personal data only when necessary and for legitimate purposes, such as account registration and customer support. We never sell your data.
//             </p>
//             <p>
//               By using our services, you consent to the practices described in this policy. Please read it carefully and contact us if you have any questions.
//             </p>

//             <h3 className="text-xl font-semibold mt-10 mb-4 text-center">Data Collection</h3>

//             <ol className="list-decimal pl-6 space-y-4">
//               <li>
//                 <span className="font-semibold">Personal Information:</span> We collect your full name, email address, phone number, and location during registration to create your user profile.
//               </li>
//               <li>
//                 <span className="font-semibold">Usage Data:</span> We collect information on how you use the platform (pages visited, features used) to improve our services and user experience.
//               </li>
//               <li>
//                 <span className="font-semibold">Device Information:</span> Your device type, browser, and operating system may be collected to ensure compatibility and troubleshoot issues.
//               </li>
//             </ol>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrivacyPolicy;

