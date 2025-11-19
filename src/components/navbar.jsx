import logo from "../assets/logo.svg";

function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <span className="text-4xl font-bold text-[#358350]">Evant</span>
        </div>
        <div className="flex gap-12">
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#home"
              className="text-[#19070B] hover:text-green-600 transition"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-[#19070B] hover:text-green-600 transition"
            >
              About Us
            </a>
            <a
              href="#services"
              className="text-[#19070B] hover:text-green-600 transition"
            >
              Services
            </a>
            <a
              href="#contact"
              className="text-[#19070B] hover:text-green-600 transition"
            >
              Contact
            </a>
            <a
              href="#investors"
              className="text-[#19070B] hover:text-green-600 transition"
            >
              Investors
            </a>
          </nav>
          <button className="bg-[#3A7750] text-white px-12 py-3 rounded-md hover:bg-green-700 transition">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
