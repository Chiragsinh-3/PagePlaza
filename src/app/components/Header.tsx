"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import AuthPage from "./AuthPage";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useTheme } from "../../context/ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookLock,
  ChevronRight,
  FileTerminal,
  Heart,
  HelpCircle,
  Lock,
  Moon,
  Package,
  PiggyBank,
  ShoppingCart,
  Sun,
  User,
  User2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { useCartByUserIdQuery, useLogoutMutation } from "@/store/api";

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLoginDialogOpen
  );
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user._id;

  const { data: cartData } = useCartByUserIdQuery(userId);
  // const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const userPlaceholder = user?.name?.[0] || "?"; // Show first letter of name or "?" as fallback
  const [logout] = useLogoutMutation();
  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };

  const handleProtectionNavigation = (href: string) => {
    if (user) {
      router.push(href);
      setIsDropdownOpen(false);
    } else {
      dispatch(toggleLoginDialog());
      setIsDropdownOpen(false);
    }
  };
  const handleLogout = () => {
    logout({}).unwrap();
    dispatch({ type: "user/logout" });
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
    router.push("/");

    console.log("Logout clicked");
  };
  const menuItems = [
    ...(user
      ? [
          {
            href: "account/profile",
            content: (
              <div className='flex space-x-4 items-center p-2 '>
                <Avatar className='w-12 h-12 -ml-2 rounded-full'>
                  {user?.profile ? (
                    <AvatarImage alt='user_image' />
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
                <div className='flex flex-col'>
                  <span className='font-semibold text-md'>{user.name}</span>
                  <span className='text-gray-500 text-xs'>{user.email}</span>
                </div>
              </div>
            ),
          },
        ]
      : [
          {
            icon: <Lock className='h-5 w-5 text-gray-500 dark:text-gray-400' />,
            label: "Login/Sign Up",
            onClick: handleLoginClick,
          },
        ]),

    // Protected menu items only shown when user exists
    ...(user
      ? [
          {
            icon: <User className='h-5 w-5 text-gray-500 dark:text-gray-400' />,
            label: "My Profile",
            onClick: () => handleProtectionNavigation("/account/profile"),
          },
          {
            icon: (
              <Package className='h-5 w-5 text-gray-500 dark:text-gray-400' />
            ),
            label: "My Orders",
            onClick: () => handleProtectionNavigation("/account/orders"),
          },
          {
            icon: (
              <PiggyBank className='h-5 w-5 text-gray-500 dark:text-gray-400' />
            ),
            label: "My Selling Orders",
            onClick: () =>
              handleProtectionNavigation("/account/selling-products"),
          },
          {
            icon: (
              <ShoppingCart className='h-5 w-5 text-gray-500 dark:text-gray-400' />
            ),
            label: "Cart",
            onClick: () => handleProtectionNavigation("/account/cart"),
          },
          {
            icon: (
              <Heart className='h-5 w-5 text-gray-500 dark:text-gray-400' />
            ),
            label: "My Wishlist",
            onClick: () => handleProtectionNavigation("/account/wishlist"),
          },
        ]
      : []),

    // Public menu items always shown
    {
      icon: <User2 className='h-5 w-5 text-gray-500 dark:text-gray-400' />,
      label: "About Us",
      href: "/about-us",
    },
    {
      icon: (
        <FileTerminal className='h-5 w-5 text-gray-500 dark:text-gray-400' />
      ),
      label: "Terms & use",
      href: "/terms-of-use",
    },
    {
      icon: <BookLock className='h-5 w-5 text-gray-500 dark:text-gray-400' />,
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      icon: <HelpCircle className='h-5 w-5 text-gray-500 dark:text-gray-400' />,
      label: "Help",
      href: "/how-it-works",
    },

    // Logout option only shown when user exists
    ...(user
      ? [
          {
            icon: (
              <User2 className='h-5 w-5 text-gray-500 dark:text-gray-400' />
            ),
            label: "Logout",
            onClick: handleLogout,
          },
        ]
      : []),
  ];

  const MenuItems = ({ classname = "" }) => {
    return (
      <div className={classname}>
        {menuItems?.map((item, index) =>
          item?.href ? (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center ${
                item.content ? "gap-0 border-b py-1 mb-4" : "gap-4"
              } px-4 py-3 text-sm rounded-lg  hover:bg-gray-200 hover:dark:bg-gray-800`}
              prefetch={false}
              onClick={() => {
                setIsDropdownOpen(false);
              }}
            >
              {item.icon && item.icon}
              <span>{item.label}</span>
              {item.content && <div className='mt-1'>{item.content}</div>}
              <ChevronRight className='w-4 h-4 ml-auto' />
            </Link>
          ) : (
            <button
              key={index}
              className='flex w-full items-center gap-4 px-4 py-3 text-sm rounded-lg hover:bg-gray-200 hover:dark:bg-gray-800'
              onClick={item.onClick}
            >
              {item.icon && item.icon}
              <span>{item.label}</span>
              <ChevronRight className='w-4 h-4 ml-auto' />
            </button>
          )
        )}
      </div>
    );
  };

  return (
    <header className='sticky top-0 z-50 py-4 w-full border-b bg-slate-100/45 text-black dark:text-white dark:border-gray-800 dark:bg-black/45 backdrop-blur-md'>
      <div className='container mx-auto flex h-[5vh] max-w-6xl items-center justify-center md:px-6'>
        <AuthPage
          isLoginOpen={isLoginOpen}
          setIsLoginOpen={() => dispatch(toggleLoginDialog())}
        />

        <div className='container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6'>
          <Link href='/' className='flex items-center gap-2 ' prefetch={false}>
            <p className='sm:font-semibold mr-2 text-xs sm:text-sm font-light'>
              PAGE PLAZA
            </p>
          </Link>
          {/* <nav className='hidden items-center gap-8 text-sm mr-8 font-medium md:flex'>
            <Link
              href='/'
              className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href='/about'
              className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
              prefetch={false}
            >
              About
            </Link>
          </nav> */}

          {/* Search dropdown */}
          <div className='flex items-center w-full gap-6 md:gap-2 '>
            {/* Search Input Dropdown */}

            <div className='sm:flex hidden relative  w-full'>
              <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
              <Input
                type='search'
                placeholder='Book Name / Author / Subject / Publisher'
                className='pl-8 full'
              />
            </div>
            <div className='sm:hidden flex  relative  w-full'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='rounded-full'>
                    <SearchIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                    <span className='sr-only'>Search</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-[300px] p-4'>
                  <div className='relative'>
                    <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
                    <Input
                      type='search'
                      placeholder='Search...'
                      className='pl-8 w-full'
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Sell used books button */}
            <div className=' items-center gap-6   font-medium md:flex'>
              <Link href='/book-sell'>
                <Button
                  variant='ghost'
                  className='bg-slate-400/5 text-[10px] sm:text-[12px]'
                >
                  Sell Used Books
                </Button>
              </Link>
            </div>

            {/* Profile DropdownMenu */}
            <div className='hidden items-center gap-6 text-sm font-medium md:flex'>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost'>
                    <Avatar className='w-8 h-8 rounded-full'>
                      {user?.profile ? (
                        <AvatarImage alt='user_image' />
                      ) : userPlaceholder ? (
                        <AvatarFallback className=''>
                          {userPlaceholder}
                        </AvatarFallback>
                      ) : (
                        <User className='ml-2 mt-2' />
                      )}
                    </Avatar>

                    <span className='hidden lg:block'>My Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-[300px] p-4'>
                  <MenuItems classname='' />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Cart */}
            <div className='hidden items-center gap-6 text-sm font-medium md:flex'>
              <Link href='/account/cart'>
                <div className='relative'>
                  <Button variant='ghost' className='relative'>
                    <ShoppingCart className='h-5 w-5 mr-2 lg:mr-0 text-gray-500 dark:text-gray-400' />
                    <span className='hidden lg:block'>Cart</span>
                  </Button>
                  {user && (
                    <span className='absolute top-2 left-5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-3 h-3 text-[10px] flex items-center justify-center'>
                      {cartData?.data?.cart?.items?.length}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Dark mode toggle */}
        <div className='flex items-center gap-4'>
          <button
            className='rounded-full dark:bg-black bg-white p-2 hover:bg-secondary dark:hover:bg-secondary'
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <Sun className='h-5 w-5' />
            ) : (
              <Moon className='h-5 w-5' />
            )}
          </button>

          {/* Small device nav slide menu */}
          <Sheet>
            <SheetTitle className='sr-only'>Menu bar</SheetTitle>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full md:hidden'
              >
                <MenuIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                <span className='sr-only'>Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='md:hidden'>
              <SheetDescription className='sr-only'>
                Description goes here
              </SheetDescription>

              <div className='grid gap-4 p-4'>
                <Link
                  href='/'
                  className='flex items-center gap-2 ml-4'
                  prefetch={false}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <p className='font-semibold mr-2 sm:text-base sm:font-normal'>
                    PAGE PLAZA
                  </p>
                </Link>
                <MenuItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='4' x2='20' y1='12' y2='12' />
      <line x1='4' x2='20' y1='6' y2='6' />
      <line x1='4' x2='20' y1='18' y2='18' />
    </svg>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='11' cy='11' r='8' />
      <path d='m21 21-4.3-4.3' />
    </svg>
  );
}
export default Header;
