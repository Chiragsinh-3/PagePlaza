export interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
}

export const validators = {
  email: (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "Please enter a valid email address";
  },

  password: (password: string): string | null => {
    return password.length >= 6
      ? null
      : "Password must be at least 6 characters";
  },

  name: (name: string): string | null => {
    return name.length >= 2 ? null : "Name must be at least 2 characters";
  },
};

export const validateForm = (
  data: Record<string, string>
): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.entries(data).forEach(([field, value]) => {
    if (field in validators) {
      const error = validators[field as keyof typeof validators](value);
      if (error) errors[field as keyof ValidationErrors] = error;
    }
  });

  return errors;
};
