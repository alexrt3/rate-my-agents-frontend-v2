import type { UserLoginRequestData } from "../types/UserLoginRequestData";
import type { UserRegistrationRequestData } from "../types/UserRegistrationRequestData";
import api from "./axios";

export const registerUser = async (formData: UserRegistrationRequestData) => {
  const response = await api.post("/auth/register", formData);
  return response.data;
};
export const loginUser = async (formData: UserLoginRequestData) => {
  const response = await api.post("/auth/login", formData);
  console.log("Login response:", response);
  return response.data;
};

export const fetchUserData = async (token: string) => {
  try {
    const response = await api.get("/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Unable to fetch user data");
  }
}

export const getAgentPropertyTypes = async () => {
  const response = await api.get("/api/enums/property-types");
  return response.data;
};
export const userEmailExists = async (userEmail: String) => {
  const response = await api.get("/user/email", {
    params: { userEmail },
  });
  return response.data;
};

export const userPhoneNumberExists = async (userPhoneNumber: String) => {
  const response = await api.get("/user/phonenumber", {
    params: { userPhoneNumber },
  });
  return response.data;
};
