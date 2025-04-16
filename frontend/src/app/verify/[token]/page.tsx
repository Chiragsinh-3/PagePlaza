"use client";

import { useVerifyEmailMutation } from "@/store/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slice/userSlice";

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [verifyEmail] = useVerifyEmailMutation();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await verifyEmail(params.token).unwrap();
        if (result.success) {
          // Update user state if needed
          if (result.data?.user) {
            dispatch(setUser(result.data.user));
          }
          setVerificationStatus("success");
          // Redirect to home after 2 seconds
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      } catch (error: any) {
        setVerificationStatus("error");
        setErrorMessage(error.data?.message || "Verification failed");
      }
    };

    if (params.token) {
      verifyToken();
    }
  }, [params.token, verifyEmail, router, dispatch]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className='flex flex-col items-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='mt-4 text-lg'>Verifying your email...</p>
          </div>
        );

      case "success":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='flex flex-col items-center'
          >
            <CheckCircle2 className='h-16 w-16 text-green-500' />
            <h2 className='mt-4 text-2xl font-semibold'>Email Verified!</h2>
            <p className='mt-2 text-gray-600 dark:text-gray-300'>
              Redirecting to home page...
            </p>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='flex flex-col items-center'
          >
            <XCircle className='h-16 w-16 text-red-500' />
            <h2 className='mt-4 text-2xl font-semibold'>Verification Failed</h2>
            <p className='mt-2 text-red-600 dark:text-red-400'>
              {errorMessage}
            </p>
            <button
              onClick={() => router.push("/auth")}
              className='mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'
            >
              Back to Login
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full'
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}
