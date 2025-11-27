import Cookies from "js-cookie";

const TOKEN_COOKIE = "token";
const ROLE_COOKIE = "role";
const COOKIE_OPTIONS = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!Cookies.get(TOKEN_COOKIE);
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return Cookies.get(TOKEN_COOKIE) || null;
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  Cookies.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
};

export const getRole = (): string | null => {
  if (typeof window === "undefined") return null;
  return Cookies.get(ROLE_COOKIE) || null;
};

export const setRole = (role: string): void => {
  if (typeof window === "undefined") return;
  Cookies.set(ROLE_COOKIE, role, COOKIE_OPTIONS);
};

export const clearAuth = (): void => {
  if (typeof window === "undefined") return;
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(ROLE_COOKIE);
};

export const isAdmin = (): boolean => {
  return getRole() === "admin";
};

export const isUser = (): boolean => {
  return getRole() === "user";
};
