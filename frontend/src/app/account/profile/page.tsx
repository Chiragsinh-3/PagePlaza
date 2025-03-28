"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import { User, UserEdit } from "@/types/user";
import { Edit, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const user = useSelector((state: RootState) => state.user.user) as any;
  const router = useRouter();
  if (!user) {
    toast.error("Please login to view profile");
    router.push("/");
  }
  console.log(user.profilePicture);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setProfile((prev) => ({
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
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8'>
      <Head>
        <title>User Profile | {user.name}</title>
        <meta name='description' content={`Profile page for ${user.name}`} />
      </Head>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className='max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden'
      >
        {/* Profile Header */}
        <div className='relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6'>
          <div className='flex items-center space-x-4'>
            <img
              src={user.profilePicture || "/default-avatar.png"}
              alt={`${user.name}'s profile`}
              className='w-20 h-20 rounded-full border-4 border-white dark:border-gray-700 object-cover'
            />
            <div>
              <h1 className='text-2xl font-bold text-white'>{user.name}</h1>
              <p className='text-indigo-100 text-sm'>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className='p-6 space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Full Name
              </label>
              <motion.input
                whileTap={{ scale: 0.9 }}
                type='text'
                name='name'
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg transition-all duration-100 
                  ${
                    isEditing
                      ? "bg-white dark:bg-gray-700 border-indigo-300"
                      : "bg-gray-100 dark:bg-gray-900 border-transparent"
                  } 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Email Address
              </label>
              <motion.input
                whileTap={{ scale: 0.9 }}
                type='email'
                name='email'
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg transition-all duration-100 
                  ${
                    isEditing
                      ? "bg-white dark:bg-gray-700 border-indigo-300"
                      : "bg-gray-100 dark:bg-gray-900 border-transparent"
                  } 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Phone Number
            </label>
            <motion.input
              whileTap={{ scale: 0.9 }}
              maxLength={10}
              type='tel'
              name='phoneNumber'
              placeholder='Add your phone number'
              value={profile.phoneNumber || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 rounded-lg transition-all duration-100 
                ${
                  isEditing
                    ? "bg-white dark:bg-gray-700 border-indigo-300"
                    : "bg-gray-100 dark:bg-gray-900 border-transparent"
                } 
                focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Account Details */}
          <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
            <h3 className='text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'>
              Account Information
            </h3>
            <div className='space-y-2 text-sm'>
              <p>
                <span className='font-medium text-gray-500 dark:text-gray-400'>
                  Joined:
                </span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className='font-medium text-gray-500 dark:text-gray-400'>
                  Account Status:
                </span>{" "}
                <span
                  className={
                    user.isVerified ? "text-green-600" : "text-yellow-600"
                  }
                >
                  {user.isVerified ? "Verified" : "Unverified"}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end space-x-3 pt-4'>
            {isEditing ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleEdit}
                  className='px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg flex items-center space-x-2'
                >
                  <X size={18} />
                  <span>Cancel</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={saveChanges}
                  className='px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg flex items-center space-x-2'
                >
                  <Save size={18} />
                  <span>Save</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleEdit}
                className='px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg flex items-center space-x-2'
              >
                <Edit size={18} />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
