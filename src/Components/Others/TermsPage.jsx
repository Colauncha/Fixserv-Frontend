import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  //   const [activeTab, setActiveTab] = useState("terms");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-l from-blue-100 to-blue-0 p-14">
      {/* Content */}
      <h1 className="text-3xl font-semibold mb-4 mt-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 cursor-pointer">
        <span className="from-purple-700 to-blue-700 bg-clip-text text-transparent bg-gradient-to-r">
          Terms of Service
        </span>
      </h1>
      <div className="px-4 py-6 text-md text-gray-800">
        {/* <h3 className="text-4xl flex justify-center text-[#2c55ac] font-extrabold mb-2">
            Welcome to Fixserv!
          </h3> */}

        {/* Text Content */}
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            <h3 className="font-semibold text-2xl text-[#2c55ac] mb-1">
              {' '}
              Introduction
            </h3>
            Welcome to FixServ. These Terms and Conditions outline the rules and
            regulations for using our platform. By accessing or using Fixserv,
            you agree to comply with and be bound by these terms.
          </p>

          <p>
            <h3 className="font-semibold text-2xl text-[#2c55ac] mb-1">
              {' '}
              Eligibility
            </h3>
            To use Fixserv, you must be at least 18 years old or have
            parental/guardian consent. You are responsible for ensuring that
            your account information is accurate and kept up-to-date.
          </p>

          <p>
            <h3 className="font-semibold text-2xl text-[#2c55ac] mb-1">
              {' '}
              Use of the Platform
            </h3>
            Fixserv connects clients with skilled artisans and service
            providers. You agree not to use the platform for unlawful, harmful,
            or misleading purposes. We reserve the right to suspend or terminate
            your account for any violations.
          </p>

          <p>
            <h3 className="font-semibold text-2xl text-[#2c55ac] mb-1">
              {' '}
              Payments and Bookings
            </h3>
            Payments must be made through the authorized channels provided by
            Fixserv. Service fees may apply and will be disclosed beforehand.
            Bookings are subject to availability and may be rescheduled if
            necessary.
          </p>

          <p>
            <h3 className="font-semibold text-2xl text-[#2c55ac] mb-1">
              {' '}
              Reviews and Ratings
            </h3>
            Users can leave reviews after completing a service. All feedback
            must be honest and respectful, based on actual experience.
          </p>

          <h3 className="font-semibold text-2xl text-[#2c55ac] mb-1">
            {' '}
            User Responsibilities
          </h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Keep your login information secure. You are responsible for all
              activity under your account.
            </li>
            <li>
              Fixserv is not liable for any loss or damage caused by service
              providers or clients.
            </li>
            <li>
              All content on Fixserv (logos, text, designs) is owned by Fixserv
              and cannot be reused without permission.
            </li>
          </ol>

          <p>
            <h3 className="font-semibold text-2xl text-[#2c55ac] mb-1">
              {' '}
              Updates to Terms
            </h3>
            By continuing to use Fixserv, you accept any updates we make to
            these Terms and Conditions. Please review them periodically for
            changes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex gap-4">
          {/* <button
            onClick={() => setSelected('notNow')}
            className={`px-4 py-2 border rounded text-sm shadow-md cursor-pointer ${
              selected === 'notNow'
                ? 'bg-[#779BE7] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Not right now...
          </button> */}

          <button
            onClick={() => {
              navigate('/');
              setSelected('agree');
            }}
            className={`px-4 py-2 rounded text-sm shadow-lg cursor-pointer ${
              selected === 'agree'
                ? 'bg-[#779BE7] text-white'
                : 'bg-[#2c55ac] text-white hover:bg-blue-600'
            }`}
          >
            I agree with terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
