import type { UserLoginRequestData } from "../types/UserLoginRequestData";
import type { UserRegistrationRequestData } from "../types/UserRegistrationRequestData";

export function trimUserRegistrationFormData(
  data: UserRegistrationRequestData
): UserRegistrationRequestData {
  return {
    ...data,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    phoneNumber: data.phoneNumber.trim(),
  };
}
export function trimUserLoginFormData(
  data: UserLoginRequestData
): UserLoginRequestData {
  return {
    ...data,
    email: data.email.trim(),
    password: data.password.trim(),
  };
}