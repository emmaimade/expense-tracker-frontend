// Password rules for new passwords. They cover everything the API requires
// (validatePassword: lower, upper, number, 6+ characters) with a stricter
// 8-character minimum, so a password that passes here never fails on the server.
export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { id: 'uppercase', label: 'An uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { id: 'lowercase', label: 'A lowercase letter', test: (value) => /[a-z]/.test(value) },
  { id: 'number', label: 'A number', test: (value) => /\d/.test(value) },
];

export const meetsPasswordRules = (value = '') => PASSWORD_RULES.every((rule) => rule.test(value));

export default meetsPasswordRules;
