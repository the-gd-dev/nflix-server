module.exports = {
  validateEmail(email) {
    const pattern = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email) return "Email is required.";
    if (email && !pattern.test(email)) return "Email is invalid";
    return false;
  },
  validatePassword(password) {
    if (!password) return "Password is required.";
    if (password && password.length < 6) return "Atleast 6 characters required.";
    return false;
  },
  validateName(name) {
    if (!name) return "Name is required.";
    if (name.length < 4) return "Name should be greater then 4 characters.";
    if (name.length > 30) return "Name can't be greater then 30 characters.";
    return false;
  },
  validatePhoneNumber(phoneNumber) {
    if (!phoneNumber) return "Phone Number is required.";
    if (!/^[0-9]/.test(phoneNumber)) return "Phone Number is not numeric";
    if (phoneNumber.length !== 10) return "Phone Number is should be 10 digits.";
    return false;
  },
  validateUserData(name, email, password, phoneNumber) {
    const formErrors = {};
    if (this.validateEmail(name)) {
      formErrors.name = this.validateName(name);
    }
    if (this.validateEmail(email)) {
      formErrors.email = this.validateName(email);
    }
    if (this.validatePassword(password)) {
      formErrors.password = this.validatePassword(password);
    }
    if (this.validatePhoneNumber(phoneNumber)) {
      formErrors.phoneNumber = this.validatePhoneNumber(phoneNumber);
    }
    //omit false or null values
    let transformedError = {};
    for (const key in formErrors) {
      if (formErrors[key]) {
        transformedError[key] = formErrors[key];
      }
    }
    return transformedError;
  },
};
