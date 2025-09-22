import React, { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSelector, useDispatch } from "react-redux";
import { login as loginAction, logout as logoutAction } from "../store/slice/authSlice.js";
import { logoutUser, getCurrentUser } from "../api/user.api.js";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!isAuthenticated) {
      (async () => {
        try {
          const res = await getCurrentUser();
          if (res?.user) {
            dispatch(loginAction(res.user));
          }
        } catch (err) {
          
        }
      })();
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error", err);
    }
    dispatch(logoutAction());
    navigate({ to: "/auth" });
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-white tracking-wide hover:opacity-90 transition"
            >
              URL Shortener
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-gray-100 transition cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
