import { useState } from 'react'
import { BanknoteArrowUp, Wallet2, X, ExternalLink, Shield, CheckCircle, AlertCircle, Key, ArrowRight } from 'lucide-react'
import { getIdentity } from '../../Auth/tokenStorage';
import useAuth from '../../Auth/useAuth';
import Fetch from '../../util/Fetch';
import Loader from '../../assets/Loaders/Loader'
import { toast } from 'react-toastify';

const FundWalletModal = ({ closeModal }) => {
  const [amount, setAmount] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [step, setStep] = useState('amount'); // 'amount' or 'verify'
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState('');

  const user = getIdentity();
  const { state } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error, success } = await Fetch({
        url: `${import.meta.env.VITE_API_WALLET_URL}/wallet/top-up`,
        token: state.token,
        method: 'POST',
        requestData: {
          amount,
          email: user.email,
        },
      });

      if (!success) {
        throw new Error(error);
      }

      console.log(data);
      setApiResponse(data?.data?.paymentUrl);
      setVerificationCode(data?.data?.paymentUrl?.reference);
      window.open(data?.data?.paymentUrl?.authorization_url, '_blank');
      toast.info(
        data?.data?.instructions ||
          'Follow the instructions to complete payment'
      );
      setStep('verify');
    } catch (err) {
      setError(err.message || 'Failed to initiate payment');
      console.error('Payment initiation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    setVerifyLoading(true);
    setError('');

    try {
      // Replace with your actual verification endpoint
      const { data, error, success } = await Fetch({
        url: `${
          import.meta.env.VITE_API_WALLET_URL
        }/wallet/top-up/verify/${verificationCode}`,
        token: state.token,
      });

      if (!success) {
        throw new Error(error);
      }

      console.log('Verification successful:', data);
      closeModal();
    } catch (err) {
      setError(err.message || 'Verification failed');
      console.error('Verification error:', err);
    } finally {
      setVerifyLoading(false);
    }
  };

  const resetToAmountStep = () => {
    setStep('amount');
    setVerificationCode('');
    setApiResponse(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
              {step === 'amount' ? (
                <BanknoteArrowUp className="w-6 h-6 text-blue-600" />
              ) : (
                <Key className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 'amount' ? 'Fund Wallet' : 'Verify Payment'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {step === 'amount'
                  ? 'Add money to your wallet securely'
                  : 'Enter verification code to complete payment'}
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                step === 'amount' ? 'bg-blue-500' : 'bg-green-500'
              }`}
            />
            <span className="text-xs font-medium text-gray-600">Amount</span>
            <div
              className={`flex-1 h-0.5 ${
                step === 'verify' ? 'bg-green-200' : 'bg-gray-200'
              }`}
            />
            <div
              className={`w-3 h-3 rounded-full ${
                step === 'verify' ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
            <span className="text-xs font-medium text-gray-600">Verify</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Error</h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {step === 'amount' && (
              <>
                {/* Current Balance Display */}
                {user?.walletBalance !== undefined && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wallet2 className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Current Balance
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        ₦{user.walletBalance?.toLocaleString() || '0.00'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Amount Input Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        ₦
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Enter Amount
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        ₦
                      </span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="100"
                        step="100"
                        className="w-full pl-8 pr-4 py-4 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors placeholder:text-gray-400"
                      />
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {[1000, 2500, 5000, 10000].map((quickAmount) => (
                        <button
                          key={quickAmount}
                          onClick={() => setAmount(quickAmount.toString())}
                          className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          ₦{quickAmount.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    {/* Amount Validation */}
                    {amount && (
                      <div className="text-sm">
                        {parseInt(amount) < 100 ? (
                          <p className="text-red-600 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Minimum funding amount is ₦100
                          </p>
                        ) : (
                          <p className="text-green-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Amount: ₦{parseInt(amount).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Secure Payment
                      </h4>
                      <p className="text-sm text-gray-600">
                        Your payment will be processed securely through our
                        payment gateway. You'll receive a verification code to
                        complete the transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 'verify' && (
              <>
                {/* Transaction Summary */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Transaction Amount
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₦{parseInt(amount).toLocaleString()}
                    </span>
                  </div>
                  {apiResponse?.reference && (
                    <div className="text-xs text-gray-600">
                      Reference: {verificationCode}
                    </div>
                  )}
                </div>

                {/* Verification Code Input */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Key className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Enter Verification Code
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter verification code"
                      className="w-full px-4 py-4 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors placeholder:text-gray-400 text-center tracking-wider"
                    />

                    <p className="text-sm text-gray-600 text-center">
                      Check your email or SMS for the verification code sent to
                      complete this transaction.
                    </p>
                  </div>
                </div>

                {/* Back to Amount Button */}
                <button
                  onClick={resetToAmountStep}
                  className="w-full py-2 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                  ← Back to Amount
                </button>
              </>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              {/* Status Text */}
              <div className="flex-1 text-sm">
                {step === 'amount' ? (
                  !amount ? (
                    <span className="text-gray-500">
                      Enter amount to continue
                    </span>
                  ) : parseInt(amount) < 100 ? (
                    <span className="text-red-500">Minimum ₦100 required</span>
                  ) : (
                    <span className="text-green-600 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Ready to fund ₦{parseInt(amount).toLocaleString()}
                    </span>
                  )
                ) : !verificationCode ? (
                  <span className="text-gray-500">Enter verification code</span>
                ) : (
                  <span className="text-green-600 font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Ready to verify payment
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

                {step === 'amount' ? (
                  <button
                    onClick={handleSubmit}
                    disabled={
                      !user || !amount || parseInt(amount) < 100 || loading
                    }
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg min-w-[140px] justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        Continue
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleVerification}
                    disabled={!verificationCode || verifyLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg min-w-[140px] justify-center"
                  >
                    {verifyLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Complete Payment
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundWalletModal