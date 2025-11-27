"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import { loginSchema, registerSchema } from "../../../lib/validation";
import type { LoginFormData, RegisterFormData } from "../../../types/user";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../../services/authService";
import { handleApiError } from "../../../lib/handleApiError";
import { setToken, setRole } from "../../../lib/auth";

type FormData = LoginFormData & Partial<Pick<RegisterFormData, "name">>;

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const isLoading = isLogin ? isLoginLoading : isRegisterLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setTouched({});

    try {
      const schema = isLogin ? loginSchema : registerSchema;
      await schema.validate(formData, { abortEarly: false });

      if (isLogin) {
        const { email, password } = formData;
        const result = await login({ email, password }).unwrap();

        if (result.success && result.data?.token) {
          setToken(result.data.token);
          if (result.data.user?.role) {
            setRole(result.data.user.role);
          }
          toast.success(result.message || "Login successful!");

          const userRole = result.data.user?.role;
          if (userRole === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }
      } else {
        const { name, email, password } = formData;
        if (!name) {
          toast.error("Name is required");
          return;
        }
        const result = await register({ name, email, password }).unwrap();

        if (result.success) {
          toast.success(result.message || "Registration successful!");
          setIsLogin(true);
          setFormData({ email: formData.email, password: "", name: "" });
        }
      }
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
        const touchedFields: Record<string, boolean> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            touchedFields[error.path] = true;
          }
        });
        setTouched(touchedFields);
      } else {
        handleApiError(err, "Failed to process your request");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched({
      ...touched,
      [fieldName]: true,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            {isLogin
              ? "Sign in to continue to your account"
              : "Sign up to start booking amazing rooms"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex gap-2 mb-4 md:mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-3 md:px-4 rounded-md font-semibold text-sm md:text-base transition-all cursor-pointer ${
                isLogin
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-3 md:px-4 rounded-md font-semibold text-sm md:text-base transition-all cursor-pointer ${
                !isLogin
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {!isLogin && (
              <Input
                label="Full Name"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                placeholder="John Doe"
                error={touched.name ? errors.name : ""}
              />
            )}

            <Input
              label="Email Address"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              placeholder="you@example.com"
              error={touched.email ? errors.email : ""}
            />

            <Input
              label="Password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              placeholder="••••••••"
              error={touched.password ? errors.password : ""}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading
                ? isLogin
                  ? "Signing In..."
                  : "Creating Account..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setTouched({});
                setFormData({ email: "", password: "", name: "" });
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
