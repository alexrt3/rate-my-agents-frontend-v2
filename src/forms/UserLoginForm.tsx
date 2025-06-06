import React from "react";
import { trimUserLoginFormData } from "../utility/ObjectTrimmer";
import validator from "validator";
import { loginUser } from "../api/auth";
import { userAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

interface UserLoginRequestData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [userLoginForm, setUserLoginForm] =
    React.useState<UserLoginRequestData>({
      email: "",
      password: "",
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedForm = trimUserLoginFormData(userLoginForm);

    try {
      if (!validator.isEmail(trimmedForm.email)) {
        console.log("Invalid email");
        return;
      }

      const data = await loginUser(trimmedForm);
      console.log("Login response data:", data);

      if (data.token) {
        userAuthStore.getState().setToken(data.token);
        userAuthStore.getState().setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          isAgent: data.agent,
        });

        const currentUser = userAuthStore.getState().user;
        console.log("User stored in Zustand:", currentUser);
        navigate("/");
        
      } else {
        console.log("Error: No token received");
      }
    } catch {
      console.log("Error logging in user");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col mb-4">
        <label className="text-black text-start font-semibold text-sm">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          value={userLoginForm.email}
          onChange={handleChange}
          className="border border-black rounded-md p-2 focus:outline-none"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-black text-start font-semibold text-sm">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          value={userLoginForm.password}
          onChange={handleChange}
          className="border border-black rounded-md p-2 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-[#152F3F] text-white font-semibold py-3 px-6 rounded-md w-full hover:bg-[#1b3a4d] transition-colors mb-1"
      >
        Login
      </button>
    </form>
  );
};
