export interface FieldErrors {
  [field: string]: string | undefined;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name: string): string | undefined {
  if (!name.trim()) return "Name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_RE.test(email)) return "Enter a valid email address.";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must contain an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return undefined;
}

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function validateSignUpForm(values: SignUpFormValues): FieldErrors {
  return {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: validateConfirmPassword(
      values.password,
      values.confirmPassword,
    ),
  };
}

export interface LogInFormValues {
  email: string;
  password: string;
}

export function validateLogInForm(values: LogInFormValues): FieldErrors {
  return {
    email: validateEmail(values.email),
    password: !values.password ? "Password is required." : undefined,
  };
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}
