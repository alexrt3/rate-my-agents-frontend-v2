export interface UserRegistrationRequestData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    isAgent: boolean;
}