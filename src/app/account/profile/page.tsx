"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const [profile, setProfile] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: user?.phone || "(123) 456-7890",
  });

  interface Profile {
    name: string;
    email: string;
    phone: string;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setProfile((prev: Profile) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = () => {
    // Here you would typically save changes to a database
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  return (
    <div className='min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white transition-colors duration-200'>
      <Head>
        <title>Profile Page</title>
        <meta name='description' content='User profile page' />
      </Head>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl'
      >
        <div className='p-8'>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className='uppercase tracking-wide text-sm text-indigo-500 dark:text-indigo-400 font-semibold mb-1'
          >
            Personal Profile
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='text-2xl font-bold text-gray-900 dark:text-white mb-6'
          >
            My Profile
          </motion.h1>

          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                type='text'
                name='name'
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  ${
                    isEditing
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                  }`}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Email
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                type='email'
                name='email'
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  ${
                    isEditing
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                  }`}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Phone Number
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                maxLength={10}
                placeholder=' (123) 456-7890'
                type='tel'
                name='phone'
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  ${
                    isEditing
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                  }`}
              />
            </div>

            <div className='flex justify-end space-x-3 pt-4'>
              {isEditing ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={saveChanges}
                  className='px-4 py-2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                >
                  Save
                </motion.button>
              ) : null}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleEdit}
                className={`px-4 py-2 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isEditing
                    ? "bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600"
                    : "bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600"
                }`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
