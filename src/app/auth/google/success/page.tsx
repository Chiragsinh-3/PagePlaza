"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slice/userSlice";

export default function GoogleAuthSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();
  // const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Call your verify-auth endpoint to get user data
        const response = await fetch(
          `http://localhost:8000/api/auth/verify-auth`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const data = await response.json();

        if (data.success) {
          // Update Redux store with user data
          dispatch(setUser(data.data.user));

          router.push("/");
        } else {
          router.push("/auth?error=authentication-failed");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/auth?error=authentication-failed");
      }
    };

    fetchUserData();
  }, [dispatch, router]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>
          Completing authentication...
        </h1>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
      </div>
    </div>
  );
}
