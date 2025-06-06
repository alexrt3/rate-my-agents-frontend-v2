import validator from "validator";

export function validatePhoneNumber (phoneNumber:string) {
    if (!validator.isMobilePhone(phoneNumber, 'en-US')) {
        return false;
      }
    return true;
};