const validateUsername = (username: string): string | null => {
  if (!username) return "Kullanıcı adı boş olamaz";
  if (username.length < 3) return "Kullanıcı adı en az 3 karakter olmalı";
  if (username.length > 50) return "Kullanıcı adı en fazla 50 karakter olabilir";
  return null;
};

const validatePassword = (password: string): string | null => {
  return password.length >= 8 ? null : "Şifre en az 8 karakter olmalı";
};

const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  return password === confirmPassword ? null : "Şifreler eşleşmiyor";
};

export const validateRegistration = (form: {
  username: string;
  password: string;
  confirmPassword: string;
}) => {
  return {
    username: validateUsername(form.username),
    password: validatePassword(form.password),
    confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
  };
};