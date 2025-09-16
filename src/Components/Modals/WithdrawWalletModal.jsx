// import { useState, useEffect } from 'react';
// import {
//   BanknoteArrowUp,
//   Wallet2,
//   X,
//   Landmark,
//   Shield,
//   CreditCard,
//   ArrowLeft,
//   CheckCircle,
//   AlertCircle,
//   Key,
//   ArrowRight,
// } from 'lucide-react';
// import { getIdentity } from '../../Auth/tokenStorage';
// import useAuth from '../../Auth/useAuth';
// import Fetch from '../../util/Fetch';
// import Loader from '../../assets/Loaders/Loader';

// const WithdrawWalletModal = ({ closeModal, walletData = null }) => {
//   const [amount, setAmount] = useState(0);
//   const [accountNumber, setAccountNumber] = useState('');
//   const [bankCode, setBankCode] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [verifyLoading, setVerifyLoading] = useState(false);
//   const [banksLoading, setBanksLoading] = useState(false);
//   const [resolveLoading, setResolveLoading] = useState(false);
//   const [banks, setBanks] = useState([]);
//   const [step, setStep] = useState('acctDetails'); // 'acctDetails' or 'withdraw'
//   const [apiResponse, setApiResponse] = useState(null);
//   const [resolveResponse, setResolveResponse] = useState(null);
//   const [error, setError] = useState('');

//   const user = getIdentity();
//   const { state } = useAuth();

//   useEffect(() => {
//     const fetchBanks = async () => {
//       setBanksLoading(true);
//       try {
//         const { data, error, success } = await Fetch({
//           url: `${import.meta.env.VITE_API_WALLET_URL}/wallet/withdrawal/banks`,
//         });
//         if (!success) {
//           throw new Error(error);
//         }
//         setBanks(data.data);
//       } catch (err) {
//         console.error('Error fetching banks:', err);
//       } finally {
//         setBanksLoading(false);
//       }
//     };

//     fetchBanks();
//   }, []);

//   const handleResolve = async () => {
//     setResolveLoading(true);
//     setError('');

//     try {
//       const { data, error, success } = await Fetch({
//         url: `${
//           import.meta.env.VITE_API_WALLET_URL
//         }/wallet/withdrawal/resolve-account`,
//         method: 'POST',
//         requestData: {
//           accountNumber,
//           bankCode,
//         },
//       });

//       if (!success) {
//         throw new Error(error);
//       }

//       console.log(data);
//       setResolveResponse(data);
//       setStep('withdraw');
//     } catch (err) {
//       setError(err.message || 'Failed to initiate withdrawal');
//       console.error('withdrawal initiation error:', err);
//     } finally {
//       setResolveLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const { data, error, success } = await Fetch({
//         url: `${import.meta.env.VITE_API_WALLET_URL}/wallet/top-up`,
//         token: state.token,
//         method: 'POST',
//         requestData: {
//           amount,
//           email: user.email,
//         },
//       });

//       if (!success) {
//         throw new Error(error);
//       }

//       console.log(data);
//       setApiResponse(data);
//       window.open(data, '_blank');
//       setStep('verify');
//     } catch (err) {
//       setError(err.message || 'Failed to initiate payment');
//       console.error('Payment initiation error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerification = async () => {
//     setVerifyLoading(true);
//     setError('');

//     try {
//       // Replace with your actual verification endpoint
//       const { data, error, success } = await Fetch({
//         url: `${
//           import.meta.env.VITE_API_WALLET_URL
//         }/wallet/top-up/verify/${verificationCode}`,
//         token: state.token,
//       });

//       if (!success) {
//         throw new Error(error);
//       }

//       console.log('Verification successful:', data);
//       closeModal();
//     } catch (err) {
//       setError(err.message || 'Verification failed');
//       console.error('Verification error:', err);
//     } finally {
//       setVerifyLoading(false);
//     }
//   };

//   const resetToAccountStep = () => {
//     setStep('acctDetails');
//     setVerificationCode('');
//     setApiResponse(null);
//     setError('');
//   };

//   const handleBankCode = (bank) => {
//     setBankCode(bank);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
//         onClick={closeModal}
//         aria-hidden="true"
//       />

//       {/* Modal Container */}
//       <div className="relative z-10 bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
//               {step === 'amount' ? (
//                 <BanknoteArrowUp className="w-6 h-6 text-blue-600" />
//               ) : (
//                 <Key className="w-6 h-6 text-blue-600" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 {step === 'acctDetails'
//                   ? 'Withdraw Funds'
//                   : 'Verify Withdrawal'}
//               </h2>
//               <p className="text-sm text-gray-500 mt-1">
//                 {step === 'acctDetails'
//                   ? 'Withdraw money from your wallet securely'
//                   : 'Enter verification code to complete transaction'}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={closeModal}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
//             aria-label="Close modal"
//           >
//             <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
//           </button>
//         </div>

//         {/* Progress Indicator */}
//         <div className="px-6 py-3 bg-gray-50">
//           <div className="flex items-center gap-2">
//             <div
//               className={`w-3 h-3 rounded-full ${
//                 step === 'acctDetail' ? 'bg-blue-500' : 'bg-green-500'
//               }`}
//             />
//             <span className="text-xs font-medium text-gray-600">
//               Account Details
//             </span>
//             <div
//               className={`flex-1 h-0.5 ${
//                 step === 'withdraw' ? 'bg-green-200' : 'bg-gray-200'
//               }`}
//             />
//             <div
//               className={`w-3 h-3 rounded-full ${
//                 step === 'withdraw' ? 'bg-blue-500' : 'bg-gray-300'
//               }`}
//             />
//             <span className="text-xs font-medium text-gray-600">Withdraw</span>
//           </div>
//         </div>

//         {/* Modal Body */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="p-6 space-y-6">
//             {/* Error Display */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <h4 className="font-medium text-red-800 mb-1">Error</h4>
//                     <p className="text-sm text-red-700">{error}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {step === 'acctDetails' && (
//               <>
//                 {/* Current Balance Display */}
//                 {walletData !== undefined && (
//                   <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <Wallet2 className="w-5 h-5 text-blue-600" />
//                         <span className="text-sm font-medium text-gray-700">
//                           Current Balance
//                         </span>
//                       </div>
//                       <span className="text-lg font-bold text-gray-900">
//                         ₦{walletData?.balance?.toLocaleString() || '0.00'}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Account details section */}
//                 {banksLoading ? (
//                   <div className="flex items-center justify-center py-10">
//                     <Loader className="w-6 h-6 text-gray-400 animate-spin" />
//                   </div>
//                 ) : (
//                   banks.length > 0 && (
//                     <div className="bg-gray-50 flex flex-col gap-3 px-2 py-4 rounded-xl">
//                       <div>
//                         <div className="flex items-center gap-3 mb-2">
//                           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                             <Landmark className="w-4 h-4 text-blue-600" />
//                           </div>
//                           <label htmlFor="banks">Select Bank</label>
//                         </div>
//                         <select
//                           onChange={(e) => handleBankCode(e.target.value)}
//                           name="banks"
//                           className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
//                         >
//                           <option value="">Select Bank</option>
//                           {banks.map((bank) => (
//                             <option key={bank.id} value={bank.code}>
//                               {bank.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div className="space-y-2">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                             <CreditCard className="w-4 h-4 text-blue-600" />
//                           </div>
//                           <h3 className="text-lg font-normal text-gray-900">
//                             Account Number
//                           </h3>
//                         </div>
//                         <div className="relative">
//                           <input
//                             type="text"
//                             value={accountNumber}
//                             onChange={(e) => setAccountNumber(e.target.value)}
//                             placeholder="Enter your account number"
//                             min="100"
//                             step="100"
//                             className="w-full px-3 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors placeholder:text-gray-400"
//                           />
//                         </div>
//                       </div>
//                       <div className="relative space-y-2 flex justify-between items-center">
//                         <button
//                           onClick={handleResolve}
//                           disabled={null}
//                           className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg min-w-[140px] justify-center"
//                         >
//                           {resolveLoading ? (
//                             <>
//                               <Loader
//                                 otherStyles={'text-white'}
//                                 className="w-4 h-4 animate-spin"
//                               />
//                               resolving...
//                             </>
//                           ) : (
//                             <>
//                               <CheckCircle className="w-4 h-4" />
//                               Verify Account
//                             </>
//                           )}
//                         </button>
//                         <div className="text-sm font-light text-gray-600">
//                           {resolveResponse?.data?.accountName}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 )}
//               </>
//             )}

//             {/* Amount Input Section */}
//             {step === 'withdraw' && (
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                     <span className="text-blue-600 font-semibold text-sm">
//                       ₦
//                     </span>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Enter Amount
//                   </h3>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="relative">
//                     <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
//                       ₦
//                     </span>
//                     <input
//                       type="number"
//                       value={amount}
//                       onChange={(e) => setAmount(e.target.value)}
//                       placeholder="0.00"
//                       min="100"
//                       step="100"
//                       className="w-full pl-8 pr-4 py-4 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors placeholder:text-gray-400"
//                     />
//                   </div>

//                   {/* Quick Amount Buttons */}
//                   <div className="grid grid-cols-4 gap-2">
//                     {[1000, 2500, 5000, 10000].map((quickAmount) => (
//                       <button
//                         key={quickAmount}
//                         onClick={() => setAmount(quickAmount.toString())}
//                         className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                       >
//                         ₦{quickAmount.toLocaleString()}
//                       </button>
//                     ))}
//                   </div>

//                   {/* Amount Validation */}
//                   {amount && (
//                     <div className="text-sm">
//                       {parseInt(amount) < 100 ? (
//                         <p className="text-red-600 flex items-center gap-2">
//                           <AlertCircle className="w-4 h-4" />
//                           Minimum funding amount is ₦100
//                         </p>
//                       ) : (
//                         <p className="text-green-600 flex items-center gap-2">
//                           <CheckCircle className="w-4 h-4" />
//                           Amount: ₦{parseInt(amount).toLocaleString()}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Payment Method Info */}
//             <div className="bg-gray-50 rounded-xl p-4">
//               <div className="flex items-start gap-3">
//                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//                   <Shield className="w-4 h-4 text-green-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-900 mb-1">
//                     Secure Payment
//                   </h4>
//                   <p className="text-sm text-gray-600">
//                     Your payment will be processed securely through our payment
//                     gateway. You'll receive a verification code to complete the
//                     transaction.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {step === 'withdraw' && (
//               <div className="flex items-center justify-center gap-3 mt-4 cursor-pointer select-none">
//                 <ArrowLeft
//                   onClick={resetToAccountStep}
//                   className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
//                 />
//                 <p className="text-xs text-gray-400 text-center">
//                   Back to Account Details
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Modal Footer */}
//         <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
//           <div className="px-6 py-5">
//             <div className="flex items-center justify-between gap-4">
//               {/* Status Text */}
//               <div className="flex-1 text-sm">
//                 {step === 'amount' ? (
//                   !amount ? (
//                     <span className="text-gray-500">
//                       Enter amount to continue
//                     </span>
//                   ) : parseInt(amount) < 100 ? (
//                     <span className="text-red-500">Minimum ₦100 required</span>
//                   ) : (
//                     <span className="text-green-600 font-medium flex items-center gap-2">
//                       <CheckCircle className="w-4 h-4" />
//                       Ready to fund ₦{parseInt(amount).toLocaleString()}
//                     </span>
//                   )
//                 ) : !verificationCode ? (
//                   <span className="text-gray-500">Enter verification code</span>
//                 ) : (
//                   <span className="text-green-600 font-medium flex items-center gap-2">
//                     <CheckCircle className="w-4 h-4" />
//                     Ready to verify payment
//                   </span>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={closeModal}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
//                 >
//                   Cancel
//                 </button>

//                 {step === 'amount' ? (
//                   <button
//                     onClick={handleSubmit}
//                     disabled={
//                       !user || !amount || parseInt(amount) < 100 || loading
//                     }
//                     className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg min-w-[140px] justify-center"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader className="w-4 h-4 animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         <ArrowRight className="w-4 h-4" />
//                         Continue
//                       </>
//                     )}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleVerification}
//                     disabled={!verificationCode || verifyLoading}
//                     className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg min-w-[140px] justify-center"
//                   >
//                     {verifyLoading ? (
//                       <>
//                         <Loader className="w-4 h-4 animate-spin" />
//                         Verifying...
//                       </>
//                     ) : (
//                       <>
//                         <CheckCircle className="w-4 h-4" />
//                         Complete Payment
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WithdrawWalletModal;

import { useState, useEffect, useCallback } from 'react';
import {
  BanknoteArrowUp,
  Wallet2,
  X,
  Landmark,
  Shield,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Key,
  ArrowRight,
} from 'lucide-react';
import { getIdentity } from '../../Auth/tokenStorage';
import useAuth from '../../Auth/useAuth';
import Fetch from '../../util/Fetch';
import Loader from '../../assets/Loaders/Loader';

/* -------------------- Helper Components -------------------- */
const ErrorBox = ({ message }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-1.5">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
      <div>
        <h4 className="font-medium text-red-800 mb-1">Error</h4>
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  </div>
);

const ModalFooter = ({
  step,
  amount,
  closeModal,
  handleSubmit,
  user,
  walletData,
  loading,
  resolveData,
}) => {
  return (
    <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Status Text */}
          <div className="flex-1 text-sm">
            {step === 'withdraw' ? (
              !amount ? (
                <span className="text-gray-500">Enter amount to continue</span>
              ) : parseInt(amount) < 100 ? (
                <span className="text-red-500">Minimum ₦100 required</span>
              ) : (
                <span className="text-green-600 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Ready to Withdraw ₦{parseInt(amount).toLocaleString()}
                </span>
              )
            ) : (
              <span className="text-green-600 font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Input Account Details
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={
                !resolveData || !user || !amount || amount > walletData?.balance
              }
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg min-w-[140px] justify-center"
            >
              {loading.submit ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Withdraw
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressIndicator = ({ step }) => (
  <div className="px-6 py-3 bg-gray-50">
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          step === 'acctDetails' ? 'bg-blue-500' : 'bg-green-500'
        }`}
      />
      <span className="text-xs font-medium text-gray-600">Account Details</span>
      <div
        className={`flex-1 h-0.5 ${
          step === 'withdraw' ? 'bg-green-200' : 'bg-gray-200'
        }`}
      />
      <div
        className={`w-3 h-3 rounded-full ${
          step === 'withdraw' ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      />
      <span className="text-xs font-medium text-gray-600">Withdraw</span>
    </div>
  </div>
);

const AccountDetails = ({
  walletData,
  banks,
  banksLoading,
  accountNumber,
  setAccountNumber,
  bankCode,
  setBankCode,
  handleResolve,
  resolveLoading,
  resolveResponse,
}) => (
  <>
    {walletData && (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Current Balance
            </span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            ₦{walletData.balance?.toLocaleString() || '0.00'}
          </span>
        </div>
      </div>
    )}

    {banksLoading ? (
      <div className="flex items-center justify-center py-10">
        <Loader className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    ) : (
      banks.length > 0 && (
        <div className="bg-gray-50 flex flex-col gap-3 px-2 py-4 rounded-xl">
          {/* Bank Selection */}
          <div>
            <label className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Landmark className="w-4 h-4 text-blue-600" />
              </span>
              Select Bank
            </label>
            <select
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
            >
              <option value="">Select Bank</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div>
            <label className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </span>
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your account number"
              className="w-full px-3 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500"
            />
          </div>

          {/* Verify Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleResolve}
              disabled={resolveLoading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium shadow-lg disabled:opacity-50"
            >
              {resolveLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Resolving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Verify Account
                </>
              )}
            </button>
            <span className="text-sm text-gray-600">
              {resolveResponse?.data?.accountName}
            </span>
          </div>
        </div>
      )
    )}
  </>
);

const WithdrawStep = ({ amount, setAmount }) => (
  <div className="space-y-4">
    <label className="flex items-center gap-3">
      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
        ₦
      </span>
      <span className="text-lg font-semibold text-gray-900">Enter Amount</span>
    </label>

    <div className="space-y-3">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          ₦
        </span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min="100"
          step="100"
          className="w-full pl-8 pr-4 py-4 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500"
        />
      </div>

      {/* Quick Amounts */}
      <div className="grid grid-cols-4 gap-2">
        {[1000, 2500, 5000, 10000].map((q) => (
          <button
            key={q}
            onClick={() => setAmount(q.toString())}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            ₦{q.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Validation */}
      {amount && (
        <p
          className={`text-sm flex items-center gap-2 ${
            parseInt(amount) < 100 ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {parseInt(amount) < 100 ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          {parseInt(amount) < 100
            ? 'Minimum amount is ₦100'
            : `Amount: ₦${parseInt(amount).toLocaleString()}`}
        </p>
      )}
    </div>
  </div>
);

/* -------------------- Main Modal -------------------- */
const WithdrawWalletModal = ({ closeModal, walletData = null }) => {
  const [state, setState] = useState({
    amount: '',
    accountNumber: '',
    bankCode: '',
    verificationCode: '',
    step: 'acctDetails',
    error: '',
  });
  const [loading, setLoading] = useState({
    main: false,
    verify: false,
    banks: false,
    resolve: false,
    submit: false,
  });
  const [banks, setBanks] = useState([]);
  const [resolveResponse, setResolveResponse] = useState(null);

  const user = getIdentity();
  const { state: auth } = useAuth();

  /* Fetch banks */
  useEffect(() => {
    (async () => {
      setLoading((l) => ({ ...l, banks: true }));
      try {
        const { data, success, error } = await Fetch({
          url: `${import.meta.env.VITE_API_WALLET_URL}/wallet/withdrawal/banks`,
        });
        if (success) setBanks(data.data);
        else throw new Error(error);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading((l) => ({ ...l, banks: false }));
      }
    })();
  }, []);

  /* Resolve Account */
  const handleResolve = useCallback(async () => {
    setLoading((l) => ({ ...l, resolve: true }));
    try {
      const { data, success, error } = await Fetch({
        url: `${
          import.meta.env.VITE_API_WALLET_URL
        }/wallet/withdrawal/resolve-account`,
        method: 'POST',
        requestData: {
          accountNumber: state.accountNumber,
          bankCode: state.bankCode,
        },
      });
      if (!success) throw new Error(error);
      setResolveResponse(data);
      setState((s) => ({ ...s, step: 'withdraw' }));
    } catch (err) {
      setState((s) => ({ ...s, error: err.message }));
    } finally {
      setLoading((l) => ({ ...l, resolve: false }));
    }
  }, [state.accountNumber, state.bankCode]);

  /* Submit Withdrawal */
  const handleSubmit = useCallback(async () => {
    setLoading((l) => ({ ...l, submit: true }));
    try {
      const { data, success, error } = await Fetch({
        url: `${import.meta.env.VITE_API_WALLET_URL}/wallet/withdrawal`,
        token: auth.token,
        method: 'POST',
        requestData: {
          userId: user.id,
          amount: state.amount,
          accountNumber: state.accountNumber,
          bankCode: state.bankCode,
          pin: '1234',
        },
      });
      if (!success) throw new Error(error);
      console.log('Withdrawal successful:', data);
      closeModal();
    } catch (err) {
      setState((s) => ({ ...s, error: err.message }));
    } finally {
      setLoading((l) => ({ ...l, submit: false }));
    }
  }, [
    user.id,
    state.amount,
    state.accountNumber,
    state.bankCode,
    auth.token,
    closeModal,
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="relative z-10 h-[95dvh] overflow-auto bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              {state.step === 'acctDetails' ? (
                <Key className="w-6 h-6 text-blue-600" />
              ) : (
                <BanknoteArrowUp className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {state.step === 'acctDetails'
                  ? 'Withdraw Funds'
                  : 'Enter Amount'}
              </h2>
              <p className="text-sm text-gray-500">
                {state.step === 'acctDetails'
                  ? 'Withdraw money securely'
                  : 'Specify withdrawal amount'}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress */}
        <ProgressIndicator step={state.step} />

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {state.error && <ErrorBox message={state.error} />}
          {state.step === 'acctDetails' && (
            <AccountDetails
              walletData={walletData}
              banks={banks}
              banksLoading={loading.banks}
              accountNumber={state.accountNumber}
              setAccountNumber={(val) =>
                setState((s) => ({ ...s, accountNumber: val }))
              }
              bankCode={state.bankCode}
              setBankCode={(val) => setState((s) => ({ ...s, bankCode: val }))}
              handleResolve={handleResolve}
              resolveLoading={loading.resolve}
              resolveResponse={resolveResponse}
            />
          )}
          {state.step === 'withdraw' && (
            <WithdrawStep
              amount={state.amount}
              setAmount={(val) => setState((s) => ({ ...s, amount: val }))}
            />
          )}
        </div>
        {/* Footer */}
        <ModalFooter
          step={state.step}
          amount={state.amount}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
          user={user}
          walletData={walletData}
          loading={loading}
          resolveData={resolveResponse}
        />
      </div>
    </div>
  );
};

export default WithdrawWalletModal;
