import { useEffect, useState } from "react";
import {
  getAgentPropertyTypes,
  registerUser,
  userEmailExists,
  userPhoneNumberExists,
} from "../api/auth";
import { trimUserRegistrationFormData } from "@/utility/ObjectTrimmer";
import validator from "validator";
import { validatePhoneNumber } from "@/utility/FieldValidator";
import { MultiSelect } from "@/components/ui/MultiSelect";

interface UserRegistrationRequestData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  isAgent: boolean;
  isUserEmailAvailable: boolean;
  isUserPhoneNumberAvailable: boolean;
}

export const UserRegistrationForm: React.FC = () => {
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedOptions, setSelectedOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [userRegistrationForm, setUserRegistrationForm] =
    useState<UserRegistrationRequestData>({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      isAgent: false,
      isUserEmailAvailable: false,
      isUserPhoneNumberAvailable: false,
    });

  useEffect(() => {
    async function fetchPropertyTypes() {
      try {
        const res = await getAgentPropertyTypes();
        const data: string[] = await res;
        const formatted = data.map((type) => ({
          label: type
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          value: type,
        }));
        setPropertyTypeOptions(formatted);
      } catch (err) {
        console.error("Failed to fetch property types", err);
      }
    }

    fetchPropertyTypes();
  }, []);

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (!validator.isEmail(e.target.value)) {
      return;
    } else {
      const data = await userEmailExists(e.target.value);
      if (data == false) {
        console.log("Email availble");
        setUserRegistrationForm((prev) => {
          return {
            ...prev,
            isUserEmailAvailable: false,
          };
        });
      } else {
        setUserRegistrationForm((prev) => {
          return {
            ...prev,
            isUserEmailAvailable: true,
          };
        });
      }
    }
  };

  const handlePhoneNumberBlur = async (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    if (!validatePhoneNumber(e.target.value)) {
      return;
    } else {
      const data = await userPhoneNumberExists(e.target.value);
      console.log(data);
      if (data == false) {
        console.log("Phone number availble");
        setUserRegistrationForm((prev) => {
          return {
            ...prev,
            isUserPhoneNumberAvailable: false,
          };
        });
      } else {
        console.log("Phone number unavailble");
        setUserRegistrationForm((prev) => {
          return {
            ...prev,
            isUserPhoneNumberAvailable: true,
          };
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserRegistrationForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "email" && value === "" && { isUserEmailAvailable: false }),
      ...(name === "phoneNumber" &&
        value === "" && { isUserPhoneNumberAvailable: false }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedForm = trimUserRegistrationFormData(userRegistrationForm);

    try {
      if (
        !validator.isEmail(trimmedForm.email) ||
        userRegistrationForm.isUserEmailAvailable
      ) {
        alert("Invalid email format or email already in use");
        return;
      }
      if (
        !validatePhoneNumber(trimmedForm.phoneNumber) ||
        userRegistrationForm.isUserPhoneNumberAvailable
      ) {
        alert("Invalid phone format or phone number already in use");
        return;
      }
      if (trimmedForm.password === trimmedForm.confirmPassword) {
        const data = await registerUser(trimmedForm);
        console.log("User registered successfully:", data);
      }
    } catch {
      console.error("Error registering user");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-x-6">
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-black text-start font-semibold text-sm">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            required
            value={userRegistrationForm.firstName}
            onChange={handleChange}
            className="border border-black rounded-md p-2 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-black text-start font-semibold text-sm">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            required
            value={userRegistrationForm.lastName}
            onChange={handleChange}
            className="border border-black rounded-md p-2 focus:outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6">
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-black text-start font-semibold text-sm">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={userRegistrationForm.email}
            onBlur={handleEmailBlur}
            onChange={handleChange}
            className="border border-black rounded-md p-2 focus:outline-none"
          />
          {userRegistrationForm.isUserEmailAvailable && (
            <p className="text-left text-red-700 text-xs font-medium">
              Email is already in use
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-black text-start font-semibold text-sm">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            required
            onBlur={handlePhoneNumberBlur}
            value={userRegistrationForm.phoneNumber}
            onChange={handleChange}
            className="border border-black rounded-md p-2 focus:outline-none"
          />
          {userRegistrationForm.isUserPhoneNumberAvailable && (
            <p className="text-left text-red-700 text-xs font-medium">
              Phone number is already in use
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-black text-start font-semibold text-sm">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          value={userRegistrationForm.password}
          onChange={handleChange}
          className="border border-black rounded-md p-2 focus:outline-none"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-black text-start font-semibold text-sm">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          required
          value={userRegistrationForm.confirmPassword}
          onChange={handleChange}
          className="border border-black rounded-md p-2 focus:outline-none"
        />
      </div>
      <div className="flex flex-col items-center mb-4">
        <label className="text-black font-semibold text-sm mb-2">
          Are you an agent?
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="isAgent"
              required
              checked={userRegistrationForm.isAgent === true}
              onChange={() =>
                setUserRegistrationForm((prev) => ({
                  ...prev,
                  isAgent: true,
                }))
              }
              className="border-black"
            />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="isAgent"
              checked={userRegistrationForm.isAgent === false}
              onChange={() =>
                setUserRegistrationForm((prev) => ({
                  ...prev,
                  isAgent: false,
                }))
              }
              className="border-black"
            />
            No
          </label>
        </div>
        {userRegistrationForm.isAgent && (
          <MultiSelect
            options={propertyTypeOptions}
            selected={selectedOptions} // state to hold the selected values
            onChange={(newSelected) => setSelectedOptions(newSelected)} // handler to update the state
            placeholder="Select property types"
          />
        )}
      </div>
      <button
        type="submit"
        className="bg-[#152F3F] text-white font-semibold py-3 px-6 rounded-md w-full hover:bg-[#1b3a4d] transition-colors mb-1"
      >
        Create Account
      </button>
    </form>
  );
};
