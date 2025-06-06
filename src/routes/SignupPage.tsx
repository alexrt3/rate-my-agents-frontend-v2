import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserRegistrationForm } from "../forms/UserRegistrationForm";

export const SignupPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="flex flex-col">
        <div>
          <div className="font-bold text-xl mb-4">Create an Account</div>
        </div>
        <div className="text-end text-sm">
          <UserRegistrationForm />
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-500 underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};
