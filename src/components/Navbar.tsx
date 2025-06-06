import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAuthStore } from "../store/authStore";


const Navbar: React.FC = () => {
  const user = userAuthStore((state) => state.user);
  const logout = userAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogoout = () => {
    logout();
    navigate("/login");
  }
  return (
    <nav className="flex justify-between items-center px-8 py-4 mb-8 shadow-md">
      <div className="text-2xl font-bold">FindMyAgent</div>
        {!user ? (
          <div className="flex space-x-6">
            <Link to="/signup" className="text-gray-600 hover:text-blue-500">
            Sign Up
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-blue-500">
              Login
            </Link>
          </div>
        ) : (
          <button
            onClick={handleLogoout}
            className="text-gray-600 hover:text-blue-500"
          >Logout</button>
        )}
    </nav>
  );
};

export default Navbar;
