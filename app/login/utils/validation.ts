export interface FormErrors {
  email?: string;
  password?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// Validate email format
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password (minimum 6 characters)
export const validatePassword = (password: string) => {
  return password.length >= 6;
};

// Validate form before submission
export const validateForm = (formData: LoginFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (!validatePassword(formData.password)) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};
