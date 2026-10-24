export type PasswordRequirement = {
  label: string;
  isMet: boolean;
};

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { label: "At least 10 characters", isMet: password.length >= 10 },
    { label: "At least 1 uppercase letter (A-Z)", isMet: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter (a-z)", isMet: /[a-z]/.test(password) },
    { label: "At least 1 digit (0-9)", isMet: /[0-9]/.test(password) },
    { label: "At least 1 special character", isMet: /[^A-Za-z0-9\s]/.test(password) },
  ];
}

export function isPasswordValid(password: string): boolean {
  return getPasswordRequirements(password).every((requirement) => requirement.isMet);
}
