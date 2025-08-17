import { useState } from "react";
import { Link } from "react-router-dom";
import { AccountBalanceWallet, BarChart, Security, Menu, Close } from "@mui/icons-material";
import Logo from "./Logo";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <div className="size-12">
                  <Logo />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-800">
                  Expense Tracker
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="#features"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Features
              </Link>
              <Link
                to="/register"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition"
              >
                Log In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-indigo-600 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <Close fontSize="large" />
                ) : (
                  <Menu fontSize="large" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="block text-gray-600 hover:text-indigo-600 font-medium py-2 px-3"
                  onClick={toggleMenu}
                >
                  Home
                </Link>
                <Link
                  to="#features"
                  className="block text-gray-600 hover:text-indigo-600 font-medium py-2 px-3"
                  onClick={toggleMenu}
                >
                  Features
                </Link>
                <Link
                  to="/signup"
                  className="block text-gray-600 hover:text-indigo-600 font-medium py-2 px-3"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="block bg-indigo-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-indigo-700 transition"
                  onClick={toggleMenu}
                >
                  Log In
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Take Control of Your Finances
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Track your expenses, manage your budget, and gain insights with our intuitive expense tracker.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-indigo-600 font-semibold py-3 px-6 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Choose Our Expense Tracker?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <AccountBalanceWallet
                className="text-indigo-600 mx-auto mb-4"
                style={{ fontSize: 40 }}
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Easy Expense Tracking
              </h3>
              <p className="text-gray-600">
                Add and categorize expenses in seconds with a user-friendly interface.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <BarChart
                className="text-indigo-600 mx-auto mb-4"
                style={{ fontSize: 40 }}
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Insightful Analytics
              </h3>
              <p className="text-gray-600">
                Visualize your spending patterns with charts and detailed reports.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Security
                className="text-indigo-600 mx-auto mb-4"
                style={{ fontSize: 40 }}
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Secure Authentication
              </h3>
              <p className="text-gray-600">
                Sign up or log in securely with email or Google OAuth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Tracking?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users managing their finances effortlessly.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              Sign Up Now
            </Link>
            <Link
              to="/login"
              className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link to="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
            <Link to="/support" className="text-gray-400 hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;