import React from 'react';

const repairs = [
  {
    name: 'Kunle Juwon',
    time: 'Two months ago',
    type: 'Refrigerator repair',
    location: '2 Ifat Solarity Close, Lagos',
    duration: '2 weeks',
    price: '30 thousand naira',
    status: 'Booked',
  },
  {
    name: 'Kunle Juwon',
    time: 'Two months ago',
    type: 'Refrigerator repair',
    location: '2 Ifat Solarity Close, Lagos',
    duration: '2 weeks',
    price: '30 thousand naira',
    status: 'Booked',
  },
  {
    name: 'Kunle Juwon',
    time: 'Two months ago',
    type: 'Refrigrator repair',
    location: '2 Ifat Solarity Close, Lagos',
    duration: '2 weeks',
    price: '20 thouand naira - 30 thousand naira',
    status: 'Available',
  },
    {
    name: 'Kunle Juwon',
    time: 'One months ago',
    type: 'Refrigerator repair',
    location: '2 Ifat Solarity Close, Lagos',
    duration: '2 weeks',
    price: '40 thousand naira',
    status: 'Booked',
  },
    {
    name: 'Ade Remi',
    time: 'Two minutes ago',
    type: 'Refrigerator repair',
    location: '2 Ifat Solarity Close, Lagos',
    duration: '2 weeks',
    price: '30 thousand naira',
    status: 'Available',
  },
    {
    name: 'Kunle Juwon',
    time: 'Two minutes ago',
    type: 'Refrigerator repair',
    location: '2 Ifat Solarity Close, Lagos',
    duration: '2 weeks',
    price: '30 thousand naira',
    status: 'Booked',
  }
];

const AllRepairs = () => {
  return (
    <div className="max-w-5xl mx-auto p-2 font-sans">
  
      <div className="flex justify-between items-center mb-6">
        <button className="bg-[#7A9DF75C] text-[#110000C2] font-medium px-4 py-1 rounded shadow-sm">
          All Repairs
        </button>
        <button className="text-[#110000C2] font-medium px-4 py-1 border border-gray-300 rounded">
          Incoming Repair
        </button>
      </div>

     
      {repairs.map((repair, index) => (
        <div
          key={index}
          className="bg-white border border-blue-100 rounded-lg p-4 mb-6"
        >
         
          <div className="flex justify-between items-start mb-2 border-b border-blue-100 pb-3">
       
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7A9DF7] text-[#110000C2] font-bold text-lg flex items-center justify-center">
                {repair.name.charAt(0)}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{repair.name}</p>
                <span className="text-sm text-gray-400">{repair.time}</span>
              </div>
            </div>
            
            <div className="text-sm font-semibold text-gray-500">{repair.status}</div>
          </div>

          
          <div className="flex justify-between flex-wrap gap-2 text-sm text-gray-700 ml-12">
            <div className="space-y-1">
              <p><span className="font-medium">Repair Type:</span> {repair.type}</p>
              <p><span className="font-medium">Location:</span> {repair.location}</p>
            </div>
            <div className="space-y-1 text-right">
              <p><span className="font-medium">Duration:</span> {repair.duration}</p>
              <p><span className="font-medium">Price:</span> {repair.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllRepairs;