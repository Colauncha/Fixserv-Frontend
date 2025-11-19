import logo from "../assets/logo2.png";
import facebook from "../assets/facebook.svg";
import instagram from "../assets/insta.svg";
import twitter from "../assets/twitter.svg";

function Footer() {
  return (
    <footer className="bg-[#258B59] text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Evant logo" className="w-10 h-10" />
              <span className="text-2xl font-bold">Evant</span>
            </div>
            <p className="text-gray-300">
              48, Otunba Adewale Street, Opebi, Ikeja, Lagos, Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-bold mb-3">BASICS</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#home" className="">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">PARTNERS</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="">
                    NNPC
                  </a>
                </li>
                <li>
                  <a href="#" className="">
                    RGV Oil
                  </a>
                </li>
                <li>
                  <a href="#" className="">
                    Oando Oil and Gas
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">RESOURCES</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3">FOLLOW US</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition cursor-pointer"
              >
                <img src={facebook} alt="Facebook" className="w-10 h-10" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition cursor-pointer"
              >
                <img src={instagram} alt="Instagram" className="w-10 h-10" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition cursor-pointer"
              >
                <img src={twitter} alt="Twitter" className="w-10 h-10" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
