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
  DialogClose,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface AuthPageProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ isLoginOpen, setIsLoginOpen }) => {
  const [currentTab, setCurrentTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "login" | "signup");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoginLoading(false);
      // Handle successful login
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSignupLoading(false);
      // Handle successful signup
    }, 1500);
  };

  const handleForgotPassword = () => {
    // Simulate forgot password flow
    setTimeout(() => {
      setForgotPasswordSuccess(true);
    }, 1000);
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DialogContent className='max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-none'>
          <DialogHeader>
            <DialogTitle className='text-center text-3xl font-extrabold text-gray-900 dark:text-white'>
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
            className='w-full mt-4'
          >
            <TabsList className='bg-zinc-100 grid w-full grid-cols-2 mb-8 transition-all'>
              <TabsTrigger value='login'>Login</TabsTrigger>
              <TabsTrigger value='signup' className=''>
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value='login' className='transition-all duration-300'>
              <form onSubmit={handleLogin} className='space-y-6'>
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
                      className='pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500'
                    />
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
                  </div>
                </div>
                {forgotPasswordSuccess && (
                  <div className='p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg'>
                    Password reset link has been sent to your email.
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

            <TabsContent value='signup' className='transition-all duration-300'>
              <form onSubmit={handleSignup} className='space-y-6'>
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
                      className='pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500'
                    />
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
                      className='pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500'
                    />
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

          <div className='mt-6 text-center text-sm'>
            <p className='text-gray-600 dark:text-gray-400'>
              {currentTab === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400'
                onClick={() =>
                  setCurrentTab(currentTab === "login" ? "signup" : "login")
                }
              >
                {currentTab === "login" ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default AuthPage;
