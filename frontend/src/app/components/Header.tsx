"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Toggle } from "@/components/ui/toggle";
import AuthPage from "./AuthPage";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  // SheetDescription,
} from "@/components/ui/sheet";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookLock,
  ChevronRight,
  FileTerminal,
  Heart,
  // HelpCircle,
  Lock,
  Moon,
  Package,
  PiggyBank,
  ShoppingCart,
  Sun,
  User,
  User2,
  // XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { useCartByUserIdQuery, useLogoutMutation } from "@/store/api";
import Image from "next/image";

const Header = () => {
  // Move ALL hooks to the top, before any conditional logic
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLoginDialogOpen
  );
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?._id;
  const { data: cartData } = useCartByUserIdQuery(userId);
  const [logout] = useLogoutMutation();

  // Effect for handling mounting
  useEffect(() => {
    setMounted(true);
  }, []);

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
  };

  // Instead of returning null, render a placeholder or empty header
  if (!mounted) {
    return (
      <header className='sticky top-0 z-50 py-4 w-full border-b bg-slate-100/45 text-black dark:text-white dark:border-[rgb(28,18,43)] dark:bg-black/45 backdrop-blur-md'>
        <div className='container mx-auto flex h-[5vh] max-w-6xl items-center justify-center md:px-6'>
          {/* Render minimal content to match structure */}
          <div className='container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6'>
            <Link href='/' className='flex items-center gap-2'>
              <p className='sm:font-semibold mr-2 text-xs sm:text-sm font-light'>
                PAGE PLAZA
              </p>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  const userPlaceholder = user?.name?.[0] || <User />;
  const menuItems = [
    ...(user
      ? [
          {
            href: "account/profile",
            content: (
              <div className='flex space-x-4 items-center p-2'>
                {user?.profilePicture ? (
                  <Image
                    width={50}
                    height={50}
                    className='w-12 h-12 -ml-2 rounded-full'
                    alt='user_image'
                    src={user.profilePicture}
                  />
                ) : (
                  <User className='w-12 h-12 -ml-2' />
                )}
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
              } px-4 py-3 text-sm rounded-lg  hover:bg-gray-200 hover:dark:bg-[rgb(28,18,43)]`}
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
              className='flex w-full items-center gap-4 px-4 py-3 text-sm rounded-lg hover:bg-gray-200 hover:dark:bg-[rgb(28,18,43)]'
              onClick={item.onClick}
            >
              {/* "bg-gradient-to-b from-[rgb(252,247,255)]  to-white dark:bg-gradient-to-b dark:from-[rgb(28,18,43)] dark:via-[rgb(10,6,15)] dark:to-black" */}
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
    <header className='sticky top-0 z-50 py-4 w-full border-b bg-slate-100/45 text-black dark:text-white dark:border-[rgb(28,18,43)] dark:bg-black/45 backdrop-blur-md'>
      <div className='container mx-auto flex h-[5vh] max-w-6xl items-center justify-center md:px-6'>
        <AuthPage
          isLoginOpen={isLoginOpen}
          setIsLoginOpen={() => dispatch(toggleLoginDialog())}
        />

        <div className='container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6'>
          <Link href='/' className='flex items-center gap-2 '>
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
            <div className='hidden  items-center gap-6 text-sm font-medium md:flex'>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='lg:flex hidden'>
                    {user?.profilePicture ? (
                      <Image
                        width={50}
                        height={50}
                        className='w-6 h-6 rounded-full ml-1'
                        alt='user_image'
                        src={user.profilePicture}
                      />
                    ) : (
                      <User className='' />
                    )}
                    <span className='hidden mr-1 lg:block'>My Account</span>
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
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
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
                className='rounded-full lg:hidden' // Changed from md:hidden to lg:hidden
              >
                <MenuIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                <span className='sr-only'>Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side='left'
              className='w-[280px] sm:w-[350px] p-0' // Remove default padding and set consistent width
            >
              <div className='flex flex-col h-full'>
                {/* Header section */}
                <div className='flex items-center justify-between p-4 border-b dark:border-gray-800'>
                  <Link
                    href='/'
                    className='flex items-center gap-2'
                    prefetch={false}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <p className='text-lg font-semibold'>PAGE PLAZA</p>
                  </Link>
                </div>

                {/* Search section for mobile */}
                <div className='p-4 border-b dark:border-gray-800'>
                  <div className='relative'>
                    <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
                    <Input
                      type='search'
                      placeholder='Book Name / Author / Subject / Publisher'
                      className='pl-8 w-full'
                    />
                  </div>
                </div>

                {/* Menu items scrollable section */}
                <div className='flex-grow overflow-y-auto'>
                  <MenuItems classname='py-2' />
                </div>

                {/* Bottom section for Sell Used Books */}
                <div className='p-4 border-t dark:border-gray-800'>
                  <Link href='/book-sell' className='w-full'>
                    <Button
                      variant='outline'
                      className='w-full bg-slate-400/5 text-sm'
                    >
                      Sell Used Books
                    </Button>
                  </Link>
                </div>
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
