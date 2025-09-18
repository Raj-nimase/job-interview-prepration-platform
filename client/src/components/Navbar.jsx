import { motion } from "framer-motion";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { Menu, X, Code2, FileText, Mic, BarChart2, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

const features = [
  {
    icon: <Code2 size={24} className="text-emerald-400" />,
    title: "Quiz Practice",
    description:
      "Practice with a wide range of coding quizzes designed to improve your problem-solving speed and accuracy.",
    link: "/quiz",
  },
  {
    icon: <FileText size={24} className="text-emerald-400" />,
    title: "Resume Builder",
    description:
      "Create professional, ATS-optimized resumes with AI guidance that highlights your strengths.",
    link: "/resume",
  },
  {
    icon: <Mic size={24} className="text-emerald-400" />,
    title: "Mock Interviews",
    description:
      "Simulate real technical interviews with AI-powered feedback to boost your confidence and skills.",
    link: "/selectRole",
  },
  {
    icon: <BarChart2 size={24} className="text-emerald-400" />,
    title: "Dashboard & Analytics",
    description:
      "Monitor your performance with detailed analytics including quiz results, interview feedback, and progress tracking.",
    link: "/dashboard",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    Swal.fire({
      icon: "success",
      title: "Logged out successfully",
      timer: 1500,
    });

    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="w-full bg-black/60 backdrop-blur-md shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
        >
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-600 bg-clip-text text-transparent relative"
          >
            HIREREADY
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-400 to-green-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {[{name:"Home",path:'/'}, {name:"About",path:'/about'},{name:"Contact",path:'/contact'}].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `font-medium cursor-pointer ${
                  isActive ? "text-emerald-400" : "text-white"
                } hover:text-emerald-400 relative`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Features Dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="hover:text-emerald-600 font-medium text-lg">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-lg rounded-lg">
                  <ul className="grid gap-3 w-[400px] md:w-[500px] md:grid-cols-2">
                    {features.map((feature) => (
                      <li
                        key={feature.title}
                        onClick={() => navigate(feature.link)}
                        className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        <div className="text-emerald-400">{feature.icon}</div>
                        <div>
                          <p className="font-semibold text-white">
                            {feature.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Auth Buttons or Profile */}
        <div className="hidden md:flex gap-4 items-center">
          {!isLoggedIn ? (
            <Button className="bg-emerald-500 text-white hover:bg-emerald-600">
              <Link to="/login">Login</Link>
            </Button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-white font-semibold cursor-pointer hover:text-emerald-400 gap-2"
              >
                <User size={20} />
                {user?.name || "User"}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="md:hidden px-6 pb-4 bg-white border-t"
        >
          <div className="flex flex-col gap-4">
            {["Home", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-gray-800 font-medium cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}

            {!isLoggedIn ? (
              <>
                <Button variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="bg-emerald-500 text-white hover:bg-emerald-600">
                  <Link to="/login">Get Started</Link>
                </Button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
