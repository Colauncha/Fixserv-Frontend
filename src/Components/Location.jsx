import React from 'react'
import LocationImage from '../assets/uploads/location.png'

const Location = () => {

    return (
      <> 
      <section className="py-8 px-6">
        <h2 className="text-4xl px-6 font-semibold mb-4 text-[#110000C2] items-center justify-center">Available Locations</h2>
        <button className="flex bg-[#779BE7] text-white w-44 h-14 rounded-full items-center justify-center mb-4">
            <img src={LocationImage} alt='location' className='w-6 h-6' />
            Location
        </button>
      </section>
      
        <iframe
          className="w-full h-64 rounded"
          src="https://www.google.com/search?q=google+map+of+lagos&oq=google+map+of+&gs_lcrp=EgZjaHJvbWUqBwgCEAAYgAQyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCDkzOTRqMGo3qAIIsAIB8QWpjhJdR9-SDQ&sourceid=chrome&ie=UTF-8#:~:text=https%3A//www.google,maps%20%E2%80%BA%20q%3DPeople2profitNG%20..."
          loading="lazy"
        ></iframe>
      </>
      
    );
  }

  export default Location

  