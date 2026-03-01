import { motion } from "framer-motion";
import { useNavigate, Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Code2,
  FileText,
  Mic,
  BarChart2,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
// Removed the commented-out ThemeContext import as we're managing it locally now
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/features/auth/hook/useAuth";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // derive user state from auth context; no local copy
  const { user, logoutUser } = useAuth();
  const isLoggedIn = !!user;

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="w-full bg-background/95 backdrop-blur-md border-b border-border shadow-sm fixed top-0 z-50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-4">
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
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `font-medium cursor-pointer transition-colors ${
                  isActive ? "text-emerald-500" : "text-foreground"
                } hover:text-emerald-500 relative`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Features Dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="hover:text-emerald-500 font-medium text-lg text-foreground">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-card border border-border p-4 shadow-xl rounded-xl">
                  <ul className="grid gap-2 w-[340px] sm:w-[400px] md:w-[500px] md:grid-cols-2">
                    {features.map((feature) => (
                      <li
                        key={feature.title}
                        onClick={() => navigate(feature.link)}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      >
                        <div className="text-emerald-500 shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {feature.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
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
        <div className="hidden md:flex gap-3 items-center">
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted hover:bg-accent text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          {!isLoggedIn ? (
            <Button
              asChild
              className="bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-400"
            >
              <Link to="/login">Login</Link>
            </Button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-foreground font-semibold cursor-pointer hover:text-emerald-500 gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2 py-1"
              >
                <User size={20} />
                {user?.name || "User"}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-foreground hover:bg-accent transition-colors focus:outline-none focus:bg-accent"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-foreground"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
          </motion.button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden overflow-hidden border-t border-border bg-card"
        >
          <div className="flex flex-col gap-2 px-6 py-4">
            {["Home", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="py-3 font-medium text-foreground hover:text-emerald-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}

            {!isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  <Link to="/login">Get Started</Link>
                </Button>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-left py-3 text-destructive font-semibold hover:underline"
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
