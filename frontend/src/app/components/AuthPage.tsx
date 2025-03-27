import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogClose,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/api";
import { useDispatch } from "react-redux";
import { setUser, authStatus } from "@/store/slice/userSlice";
import { toast } from "sonner";
import { validateForm, ValidationErrors } from "@/utils/validation";

import Cookies from "js-cookie";

interface AuthPageProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
}

interface FormState {
  email: string;
  password: string;
  name?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ isLoginOpen, setIsLoginOpen }) => {
  const [currentTab, setCurrentTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  // const [googleLogin] = useGoogleLoginMutation();
  // const [googleCallback] = useGoogleCallbackMutation();
  const dispatch = useDispatch();

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "login" | "signup");
  };

  const [loginForm, setLoginForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });

  const handleLoginInput = (field: keyof FormState, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
    setForgotPasswordMessage("");

    // Clear error for the field if it exists
    if (errors.login[field]) {
      setErrors((prev) => ({
        ...prev,
        login: {
          ...prev.login,
          [field]: undefined,
        },
        forgotPassword: {
          ...prev.login,
          [field]: undefined,
        },
      }));
    }
  };

  const handleSignupInput = (field: keyof FormState, value: string) => {
    setSignupForm((prev) => ({ ...prev, [field]: value }));
    setForgotPasswordMessage("");

    // Clear error for the field if it exists
    if (errors.signup[field]) {
      setErrors((prev) => ({
        ...prev,
        signup: {
          ...prev.signup,
          [field]: undefined,
        },
        forgotPassword: {
          ...prev.login,
          [field]: undefined,
        },
      }));
    }
  };

  const [errors, setErrors] = useState<{
    login: ValidationErrors;
    signup: ValidationErrors;
    forgotPassword: ValidationErrors;
  }>({
    login: {},
    signup: {},
    forgotPassword: {},
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    const validationErrors = validateForm({ ...loginForm } as Record<
      string,
      string
    >);
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, login: validationErrors }));
      setLoginLoading(false);
      return;
    }

    try {
      const result = await login(loginForm).unwrap();
      if (result.success) {
        toast.success("Login successful!");
      }
      dispatch(setUser(result.data.user));
      dispatch(authStatus());
      setIsLoginOpen(false);
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        login: { email: error.data?.message || "Invalid email or password" },
      }));
    }
    setLoginLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);

    const validationErrors = validateForm({ ...signupForm } as Record<
      string,
      string
    >);
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, signup: validationErrors }));
      setSignupLoading(false);
      return;
    }

    try {
      const result = await register(signupForm).unwrap();
      if (result.success) {
        toast.success("Signup successful! Please verify your email.");
      }
      setIsLoginOpen(false);

      setSignupForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        signup: { email: error.data?.message || "Email already exists" },
      }));
    }
    setSignupLoading(false);
  };

  const handleForgotPassword = async () => {
    setForgotPasswordMessage("");
    if (!loginForm.email) {
      setErrors((prev) => ({
        ...prev,
        login: { ...prev.login, email: "Please enter your email address" },
      }));
      return;
    }
    try {
      await forgotPassword({ email: loginForm.email }).unwrap();
      setForgotPasswordMessage(
        "Password reset link has been sent to your email"
      );
      setErrors((prev) => ({ ...prev, forgotPassword: {} }));
    } catch (error: any) {
      setForgotPasswordMessage("");
      setErrors((prev) => ({
        ...prev,
        forgotPassword: {
          email: error.data?.message || "Failed to send reset link",
        },
      }));
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <motion.div
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DialogContent className='max-w-md p-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl dark:bg-gray-900/95 dark:shadow-none'>
          <DialogHeader>
            <DialogTitle className='text-center text-2xl font-bold text-gray-800 dark:text-gray-100'>
              Welcome
            </DialogTitle>
            <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
              Please sign in to your account or create a new one
            </p>
          </DialogHeader>

          <Tabs
            defaultValue='login'
            value={currentTab}
            onValueChange={handleTabChange}
            className='w-full mt-1'
          >
            <TabsList className='grid w-full grid-cols-2 mb-6 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-1'>
              <TabsTrigger
                value='login'
                className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary'
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value='signup'
                className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary'
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Content */}
            <TabsContent value='login' className='transition-all duration-300'>
              <div className='mb-4'>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className='w-full flex items-center justify-center gap-2 border-2 py-2 rounded-lg text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50'
                  onClick={() => {
                    handleGoogleLogin();
                  }}
                >
                  <svg className='w-5 h-5' viewBox='0 0 24 24'>
                    <path
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                      fill='#4285F4'
                    />
                    <path
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                      fill='#34A853'
                    />
                    <path
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                      fill='#FBBC05'
                    />
                    <path
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                      fill='#EA4335'
                    />
                  </svg>
                  Continue with Google
                </motion.button>
              </div>

              <div className='relative mb-4'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-gray-300 dark:border-gray-700'></span>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 text-gray-500 bg-[rgb(245,245,246)] dark:bg-gray-900'>
                    Or continue with
                  </span>
                </div>
              </div>

              <form onSubmit={handleLogin} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email' className='dark:text-gray-100'>
                    Email
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600' />
                    <Input
                      id='email'
                      placeholder='Enter your email'
                      type='email'
                      required
                      value={loginForm.email}
                      onChange={(e) =>
                        handleLoginInput("email", e.target.value)
                      }
                      className='pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500'
                    />
                    {errors.login.email && (
                      <p className='text-sm text-red-500'>
                        {errors.login.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <Label htmlFor='password' className='dark:text-gray-100'>
                      Password
                    </Label>
                    <button
                      type='button'
                      onClick={handleForgotPassword}
                      className='text-sm text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400'
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600' />
                    <Input
                      id='password'
                      type={showPassword ? "text" : "password"}
                      placeholder='Enter your password'
                      required
                      value={loginForm.password}
                      onChange={(e) =>
                        handleLoginInput("password", e.target.value)
                      }
                      className='pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-3'
                    >
                      {showPassword ? (
                        <EyeOff className='h-5 w-5 text-gray-400 dark:text-gray-600' />
                      ) : (
                        <Eye className='h-5 w-5 text-gray-400 dark:text-gray-600' />
                      )}
                    </button>
                    {errors.login.password && (
                      <p className='text-sm text-red-500'>
                        {errors.login.password}
                      </p>
                    )}
                  </div>
                </div>
                {forgotPasswordMessage && (
                  <div className='p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg'>
                    {forgotPasswordMessage}
                  </div>
                )}
                {errors.forgotPassword?.email && (
                  <div className='p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg'>
                    {errors.forgotPassword.email}
                  </div>
                )}
                <Button
                  type='submit'
                  className='w-full dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white'
                  disabled={loginLoading}
                >
                  {loginLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Content */}
            <TabsContent value='signup' className='transition-all duration-300'>
              <div className='mb-4'>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full flex items-center justify-center gap-2 border-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50'
                  onClick={() => {
                    handleGoogleLogin();
                  }}
                >
                  <svg className='w-5 h-5' viewBox='0 0 24 24'>
                    <path
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                      fill='#4285F4'
                    />
                    <path
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                      fill='#34A853'
                    />
                    <path
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                      fill='#FBBC05'
                    />
                    <path
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                      fill='#EA4335'
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </div>

              <div className='relative mb-4'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-gray-300 dark:border-gray-700'></span>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 text-gray-500 bg-[rgb(245,245,246)] dark:bg-gray-900'>
                    Or sign up with
                  </span>
                </div>
              </div>

              <form onSubmit={handleSignup} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name' className='dark:text-gray-100'>
                    Full Name
                  </Label>
                  <div className='relative'>
                    <User className='absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600' />
                    <Input
                      id='name'
                      placeholder='Enter your full name'
                      required
                      value={signupForm.name}
                      onChange={(e) =>
                        handleSignupInput("name", e.target.value)
                      }
                      className='pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500'
                    />
                    {errors.signup.name && (
                      <p className='text-sm text-red-500'>
                        {errors.signup.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='signup-email' className='dark:text-gray-100'>
                    Email
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600' />
                    <Input
                      id='signup-email'
                      placeholder='Enter your email'
                      type='email'
                      required
                      value={signupForm.email}
                      onChange={(e) =>
                        handleSignupInput("email", e.target.value)
                      }
                      className='pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500'
                    />
                    {errors.signup.email && (
                      <p className='text-sm text-red-500'>
                        {errors.signup.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='signup-password'
                    className='dark:text-gray-100'
                  >
                    Password
                  </Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600' />
                    <Input
                      id='signup-password'
                      type={showPassword ? "text" : "password"}
                      placeholder='Create a password'
                      required
                      value={signupForm.password}
                      onChange={(e) =>
                        handleSignupInput("password", e.target.value)
                      }
                      className='pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-3'
                    >
                      {showPassword ? (
                        <EyeOff className='h-5 w-5 text-gray-400 dark:text-gray-600' />
                      ) : (
                        <Eye className='h-5 w-5 text-gray-400 dark:text-gray-600' />
                      )}
                    </button>
                    {errors.signup.password && (
                      <p className='text-sm text-red-500'>
                        {errors.signup.password}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white'
                  disabled={signupLoading}
                >
                  {signupLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default AuthPage;
