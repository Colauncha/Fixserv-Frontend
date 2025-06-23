import SearchLogo from '../../assets/icons/search.png'; // Adjust the path as necessary

const ClientNavbar = () => {
  return (
    <section className ="flex flex-col items-center justify-between w-full">
    <div className="flex items-center justify-between px-10 py-6 shadow-md bg-white w-full">
      
      <div className="flex items-center space-x-4">
        {/* Hamburger/more Icon */}
        <div className="flex flex-col justify-between w-18 h-10 cursor-pointer">
          <span className="h-2 bg-[#7A9DF7] rounded"></span>
          <span className="h-2 bg-[#7A9DF7] rounded"></span>
          <span className="h-2 bg-[#7A9DF7] rounded"></span>
        </div>

        {/* Welcome Text */}
        <h1 className="text-4xl font-light text-[#000000] pl-15">
          Welcome <br />
          <span className="text-4xl font-light">to Fixserv</span>
        </h1>
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center bg-[#94B0F8] rounded-full overflow-hidden h-13 w-[900px] max-w-[90%]">
        <input
          type="text"
          placeholder="Service, Artisans or Location"
          className="px-4 py-1 w-full outline-none text-[#110000C2]"
        />

       <button>
        <img src={SearchLogo} alt='search' className="bg-[#7A9DF7] p-3 px-10 rounded-full text-white" />
         </button>
      </div>

    </div>

     {/* Categories dropdowns bar */}
      <div className="flex items-center justify-center w-full gap-15 py-4 bg-[#ECF1FC] ">
        <select className="px-15 py-5 border border-gray-300 rounded-md text-md">
          <option>Television</option>
        </select>
        <select className="px-15 py-5 border border-gray-300 rounded-md text-md">
          <option>Refrigerator</option>
        </select>
        <select className="px-15 py-5 border border-gray-300 rounded-md text-md">
          <option>Gadgets</option>
        </select>
        <select className="px-15 py-5 border border-gray-300 rounded-md text-md">
          <option>Game Gadgets</option>
        </select>
      </div>

    </section>

  );
};

export default ClientNavbar;


  
     

