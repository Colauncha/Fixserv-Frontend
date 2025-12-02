import React, { useState, useRef } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import ArrowUp from '../assets/uploads/ArrowUp.png';
import axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom';


const Waitlist = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState('');

  const [passwordMatch, setPasswordMatch] = useState(null);

  const [loading, setLoading] = useState(false);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const addressRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const userTypeRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const phoneNumberRef = useRef(null);

  const fieldRefs = {
    firstName: firstNameRef,
    lastName: lastNameRef,
    address: addressRef,
    email: emailRef,
    password: passwordRef,
    confirmPassword: confirmPasswordRef,
    userType: userTypeRef,
    phoneNumber: phoneNumberRef,
  };

  const validatePhone = (phone) => {
    const regex = /^(0|\+234)[0-9]{10}$/;
    return regex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    setErrors({ ...errors, [name]: false });

    if (name === 'password') {
      const minLength = /.{6,}/;
      const hasNumber = /[0-9]/;
      const hasUpper = /[A-Z]/;
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

      if (
        minLength.test(value) &&
        hasNumber.test(value) &&
        hasUpper.test(value) &&
        hasSpecial.test(value)
      ) {
        setPasswordStrength('Strong');
      } else if (
        minLength.test(value) &&
        (hasNumber.test(value) ||
          hasUpper.test(value) ||
          hasSpecial.test(value))
      ) {
        setPasswordStrength('Medium');
      } else if (
        !minLength.test(value) ||
        !hasNumber.test(value) ||
        !hasUpper.test(value) ||
        !hasSpecial.test(value)
      ) {
        setPasswordStrength('Weak');
      }

      if (form.confirmPassword) {
        setPasswordMatch(value === form.confirmPassword);
      }
    }

    if (name === 'confirmPassword') {
      setPasswordMatch(value === form.password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    let newErrors = {};
    let firstEmptyField = null;

    for (const key in form) {
      if (!form[key]) {
        newErrors[key] = true;
        if (!firstEmptyField) firstEmptyField = key;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill out all required fields.');
      setLoading(false);
      fieldRefs[firstEmptyField]?.current?.focus();
      return;
    }

    if (!validatePhone(form.phoneNumber)) {
      toast.error(
        'Enter a valid Nigerian phone number (e.g. 08012345678 or +2348012345678)'
      );
      setLoading(false);
      phoneNumberRef.current?.focus();
      return;
    }

    const validatePassword = (password) => {
      const minLength = /.{6,}/;
      const hasNumber = /[0-9]/;
      const hasUpper = /[A-Z]/;
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

      if (!minLength.test(password))
        return 'Password must be at least 6 characters';
      if (!hasUpper.test(password))
        return 'Password must contain at least one capital letter';
      if (!hasNumber.test(password))
        return 'Password must contain at least one number';
      if (!hasSpecial.test(password))
        return 'Password must contain at least one special character';

      return null;
    };

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      toast.error(passwordError);
      setLoading(false);
      passwordRef.current?.focus();
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      setLoading(false);
      confirmPasswordRef.current?.focus();
      return;
    }

    const payload = {
      email: form.email,
      password: form.password,
      fullName: `${form.firstName} ${form.lastName}`,
      role: form.userType,
      phoneNumber: form.phoneNumber,
    };

    try {
      await axios.post(
        'https://user-management-h4hg.onrender.com/api/users/register-waitlist',
        payload
      );

      toast.success('🎉 Successfully added to the waitlist!');

      setForm({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: '',
        phoneNumber: '',
      });

      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.';

      toast.error(`❌ ${backendMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      <ToastContainer position="top-center" />

      <div className="w-full bg-[#F5F5F5] flex flex-col items-center py-20 px-4">
        <div className="w-full max-w-5xl bg-[#2C4179] rounded-md py-16 px-6 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Be the First to Experience FIXSERV V2 🚀
          </h2>

          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Version 2 is almost here; faster, smarter, and built just for you.
            Join our waitlist today and lock in early access before the official
            drop.
          </p>
        </div>

        <div className="w-full bg-[#F5F5F5] flex flex-col items-center py-20 px-4">
          <div className="w-full max-w-3xl bg-white p-10 rounded-lg shadow-md">
            <h3 className="text-3xl font-bold text-center mb-2 text-[#000000]">
              Join the Fixserv V2 Waitlist
            </h3>
            <p className='text-center text-[#656565] mb-8'>
              Enter your details to secure your spot.
            </p>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex flex-col">
                <label className="text-[#1F4C73] font-medium mb-1">
                  First Name
                </label>
                <input
                  ref={firstNameRef}
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className={`border rounded-md px-4 py-2 focus:outline-none 
                  ${
                    errors.firstName
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-[#1F4C73]'
                  }`}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[#1F4C73] font-medium mb-1">
                  Last Name (Surname)
                </label>
                <input
                  ref={lastNameRef}
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className={`border rounded-md px-4 py-2 focus:outline-none 
                  ${
                    errors.lastName
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-[#1F4C73]'
                  }`}
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-[#1F4C73] font-medium mb-1">
                  Address
                </label>
                <input
                  ref={addressRef}
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className={`border rounded-md px-4 py-2 focus:outline-none 
                  ${
                    errors.address
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-[#1F4C73]'
                  }`}
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-[#1F4C73] font-medium mb-1">Email</label>
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`border rounded-md px-4 py-2 focus:outline-none 
                  ${
                    errors.email
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-[#1F4C73]'
                  }`}
                />
              </div>

              <div className="flex flex-col md:col-span-2 relative">
                <label className="text-[#1F4C73] font-medium mb-1">
                  Password
                </label>

                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`border rounded-md px-4 py-2 focus:outline-none w-full
      ${
        errors.password
          ? 'border-red-500'
          : 'border-gray-300 focus:border-[#1F4C73]'
      }`}
                />

                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[40px] cursor-pointer text-[#1F4C73]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>

                {form.password && (
                  <p
                    className={`mt-1 text-sm ${
                      passwordStrength === 'Weak'
                        ? 'text-red-500'
                        : passwordStrength === 'Medium'
                        ? 'text-yellow-500'
                        : 'text-green-500'
                    }`}
                  >
                    Password Strength: {passwordStrength}
                  </p>
                )}
              </div>

              <div className="flex flex-col md:col-span-2 relative">
                <label className="text-gray-700 font-medium mb-1">
                  Confirm Password
                </label>

                <input
                  ref={confirmPasswordRef}
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`border rounded-md px-4 py-2 focus:outline-none w-full
      ${
        errors.confirmPassword
          ? 'border-red-500'
          : 'border-gray-300 focus:border-[#1F4C73]'
      }`}
                />

                <div
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[40px] cursor-pointer text-[#1F4C73]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </div>
                {form.confirmPassword && (
                  <p
                    className={`mt-1 text-sm ${
                      passwordMatch ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {passwordMatch
                      ? 'Passwords match ✅'
                      : 'Passwords do not match ❌'}
                  </p>
                )}
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-[#1F4C73] font-medium mb-1">
                  Phone Number
                </label>
                <input
                  ref={phoneNumberRef}
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={`border rounded-md px-4 py-2 focus:outline-none 
      ${
        errors.phoneNumber
          ? 'border-red-500'
          : 'border-gray-300 focus:border-[#1F4C73]'
      }`}
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-[#1F4C73] font-medium mb-1">
                  Which user are you?
                </label>
                <select
                  ref={userTypeRef}
                  name="userType"
                  value={form.userType}
                  onChange={handleChange}
                  className={`border rounded-md px-4 py-2 bg-white focus:outline-none 
                  ${
                    errors.userType
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-[#1F4C73]'
                  }`}
                >
                  <option value="">Select user type</option>
                  {/* <option value="customer">CLIENT</option>
                <option value="artisan">ARTISAN</option> */}

                  <option value="CLIENT">CLIENT</option>
                  <option value="ARTISAN">ARTISAN</option>
                </select>
              </div>

              {/* Submit */}
              <div className="md:col-span-2 flex justify-center mt-4">

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-12 py-3 rounded-md font-medium text-lg transition cursor-pointer
    ${
      loading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-[#1F4C73] text-white hover:bg-[#163956]'
    }`}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Waitlist;
