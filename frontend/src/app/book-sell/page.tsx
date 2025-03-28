"use client";
import useFileSelection from "@/hooks/useFileSelection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { books, filters } from "@/lib/BookData";
import {
  Book,
  CircleHelp,
  Eye,
  // FileQuestion,
  IndianRupeeIcon,
  ReceiptIndianRupee,
  X,
} from "lucide-react";
import React from "react";
// import DragAndDrop from "../components/DragAndDrop";
// import { FileWithPath } from "";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCreateProductsMutation } from "@/store/api";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const OptionalDetails: { [key: string]: string[] } = {
  BookInformation: ["Author", "Edition (Year)", "Description"],
};

const Page = () => {
  const [addFile, removeFile] = useFileSelection();
  const [noShippingCharge, setNoShippingCharge] = React.useState(false);
  const [paymentMode, setPaymentMode] = React.useState<string>("");
  const router = useRouter();
  const [createProduct] = useCreateProductsMutation();
  const [formData, setFormData] = React.useState({
    title: "",
    category: "",
    condition: "",
    classType: "",
    // subject: "",
    author: "",
    price: "",
    edition: "",
    description: "",
    finalprice: "",
    shippingCharge: "",
    paymentMode: "",
    paymentDetails: {
      upiId: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
    },
    images: [] as File[],
  });
  const user = useSelector((state: RootState) => state.user.user);
  const userid = user?._id;
  if (!user) {
    toast.error("Please login to sell book");
    router.push("/");
  }

  // Add new function to handle image files
  const handleAddFile = (file: File) => {
    addFile(file);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, file],
    }));
  };

  const handleRemoveFile = (file: File) => {
    removeFile(file);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((f) => f !== file),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (
      name === "upiId" ||
      name === "bankName" ||
      name === "accountNumber" ||
      name === "ifscCode"
    ) {
      setFormData((prev) => ({
        ...prev,
        paymentDetails: {
          ...prev.paymentDetails,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();

    // Check for minimum 3 images
    if (formData.images.length < 3) {
      toast("Validation Error", {
        description: "Please upload at least 3 images of your book",
      });
      return;
    }

    // Check for required fields
    if (
      !formData.title ||
      !formData.category ||
      !formData.condition ||
      !formData.classType ||
      // !formData.subject ||
      !formData.price ||
      !formData.finalprice ||
      (!formData.shippingCharge && !noShippingCharge)
    ) {
      console.log(formData);
      toast("Validation Error", {
        description: "Please fill in all required fields",
      });
      return;
    }

    // Validate payment details
    if (!formData.paymentMode) {
      toast("Validation Error", {
        description: "Please select a payment mode",
      });
      return;
    }

    if (paymentMode === "upi" && !formData.paymentDetails?.upiId) {
      toast("Validation Error", {
        description: "Please enter UPI ID",
      });
      return;
    }

    if (
      paymentMode === "bank" &&
      (!formData.paymentDetails?.bankName ||
        !formData.paymentDetails?.accountNumber ||
        !formData.paymentDetails?.ifscCode)
    ) {
      toast("Validation Error", {
        description: "Please enter all bank details",
      });
      return;
    }

    // Append all form fields except images and payment details
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        if (Array.isArray(value)) {
          value.forEach((file: File) => {
            submitData.append("images", file);
          });
        }
      } else if (key === "paymentDetails") {
        // Handle payment details
        if (value) {
          Object.entries(value).forEach(([k, v]) => {
            if (v) {
              submitData.append(`paymentDetails.${k}`, v as string);
            }
          });
        }
      } else if (key === "paymentMode") {
        // Don't append paymentMode here
        // It will be handled separately below
      } else {
        submitData.append(key, value as string);
      }
    });

    // Add paymentMode as a single string value
    submitData.append("paymentMode", formData.paymentMode);
    submitData.append("noShippingCharge", noShippingCharge.toString());

    // Log the FormData (for debugging)
    const formDataEntries = Array.from(submitData.entries());
    console.log("Submitting data:", formDataEntries);

    try {
      const result = await createProduct(submitData).unwrap();
      if (result) {
        router.push("/account/selling-products");
        toast.success("Product created successfully!");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to create product. Please try again.");
    }
  };

  const handleValue = (value: string) => {
    setPaymentMode(value);
    setFormData((prev) => ({
      ...prev,
      paymentMode: value,
    }));
    // Reset payment details based on payment mode
    if (value === "UPI") {
      setFormData((prev) => ({
        ...prev,
        paymentMode: value,
        paymentDetails: {
          upiId: "",
          bankName: "",
          accountNumber: "",
          ifscCode: "",
        },
      }));
    } else if (value === "Bank Account") {
      setFormData((prev) => ({
        ...prev,
        paymentMode: value,
        paymentDetails: {
          upiId: "",
          bankName: "",
          accountNumber: "",
          ifscCode: "",
        },
      }));
    }
  };

  const handlePreviewClick = (
    e: { preventDefault: () => void },
    file: File
  ) => {
    e.preventDefault();
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.right = "0";
    popup.style.bottom = "0";
    popup.style.backgroundColor = "rgba(0,0,0,0.8)";
    popup.style.display = "flex";
    popup.style.alignItems = "center";
    popup.style.justifyContent = "center";
    popup.style.zIndex = "9999";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";
    img.style.objectFit = "contain";
    img.style.transform = "scale(0.5)";
    img.style.opacity = "0";
    img.style.transition = "all 0.3s ease-in-out";

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "20px";
    closeBtn.style.right = "20px";
    closeBtn.style.backgroundColor = "#fff";
    closeBtn.style.color = "#000";
    closeBtn.style.width = "40px";
    closeBtn.style.height = "40px";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.border = "none";
    closeBtn.style.fontSize = "24px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.transition = "all 0.2s ease";

    closeBtn.onmouseover = () => {
      closeBtn.style.backgroundColor = "#f0f0f0";
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.backgroundColor = "#fff";
    };

    const closePopup = () => {
      img.style.transform = "scale(0.5)";
      img.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(popup);
      }, 300);
    };

    popup.onclick = (e) => {
      if (e.target === popup) closePopup();
    };
    closeBtn.onclick = closePopup;

    popup.appendChild(img);
    popup.appendChild(closeBtn);
    document.body.appendChild(popup);

    setTimeout(() => {
      img.style.transform = "scale(1)";
      img.style.opacity = "1";
    });
  };

  return (
    <div className='min-h-screen   py-10'>
      <div className='container mx-auto mb-6 max-w-4xl px-4 space-y-8'>
        <div className='text-center m-8 space-y-4'>
          <h1 className='text-4xl font-black bg-gradient-to-r from-blue-800 to-purple-900 bg-clip-text text-transparent'>
            Sell Your Used Books
          </h1>
          <p className='text-lg text-gray-600 font-medium flex justify-center items-baseline dark:text-gray-300'>
            Turn your old books into cash on{" "}
            <span className='text-sm text-black text-start ml-2.5 flex flex-col bg-slate-50 rounded-lg py-2 px-3'>
              <span>PAGE</span>
              <span>PLAZA</span>
            </span>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Book Details */}
          <div className='space-y-10'>
            <Card className='shadow-xl overflow-hidden border-0 bg-white dark:bg-gray-900'>
              <div className='h-2 bg-gradient-to-r from-blue-900 to-purple-900 rounded-t-lg' />
              <CardHeader className='bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-row items-center space-x-4 space-y-0 pb-6 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700'>
                <Book className='h-6 w-6 text-blue-600' />

                <h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
                  Book Details
                </h1>
              </CardHeader>

              <CardContent className='mt-6 p-8'>
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                    <label
                      htmlFor='title'
                      className='text-gray-700 font-medium dark:text-gray-200'
                    >
                      Book Title<span className='text-red-400'> *</span>
                    </label>
                    <input
                      type='text'
                      name='title'
                      id='title'
                      value={formData.title}
                      onChange={handleChange}
                      placeholder='Enter Book Title'
                      className='border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                      required
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                    <label className='text-gray-700 font-medium dark:text-gray-200'>
                      Book Type<span className='text-red-400'> *</span>
                    </label>
                    <div className='col-span-2'>
                      <Select
                        name='category'
                        required
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger
                          className='w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                          aria-label='Select book type'
                        >
                          <SelectValue placeholder='Please Select Book Type' />
                        </SelectTrigger>
                        <SelectContent
                          className='dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                          position='popper'
                          sideOffset={4}
                          align='start'
                        >
                          {filters.category.map((book) => (
                            <SelectItem
                              key={book}
                              value={book}
                              className='dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                            >
                              {book}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                    <label className='text-gray-700 font-medium dark:text-gray-200'>
                      Book Condition<span className='text-red-400'> *</span>
                    </label>
                    <div className='col-span-2'>
                      <RadioGroup
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, condition: value }))
                        }
                        required
                        className='flex flex-wrap gap-4'
                      >
                        {filters.condition.map((book) => (
                          <div
                            key={book}
                            className='flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-400 transition dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-400'
                          >
                            <RadioGroupItem
                              value={book}
                              id={book}
                              className='dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-400'
                            />
                            <label
                              htmlFor={book}
                              className='text-sm font-medium cursor-pointer h-full dark:text-gray-50'
                            >
                              {book}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                    <label className='text-gray-700 font-medium dark:text-gray-200'>
                      Class Type<span className='text-red-400'> *</span>
                    </label>
                    <div className='col-span-2'>
                      <Select
                        name='classType'
                        required
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, classType: value }))
                        }
                      >
                        <SelectTrigger className='w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'>
                          <SelectValue placeholder='Please Select Class' />
                        </SelectTrigger>
                        <SelectContent className='dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'>
                          {filters.classType.map((book) => (
                            <SelectItem
                              key={book}
                              value={book}
                              className='dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                            >
                              {book}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-start'>
                    <label className='text-gray-700 font-medium pt-2 dark:text-gray-200'>
                      Upload Photos<span className='text-red-400'> *</span>
                    </label>
                    <div className='col-span-2'>
                      <Card className='border-0 shadow-md overflow-hidden dark:bg-gray-800'>
                        <div className='p-4 space-y-4'>
                          <div
                            className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500'
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const files = Array.from(e.dataTransfer.files);
                              files.forEach((file) => handleAddFile(file));
                            }}
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.multiple = true;
                              input.accept = "image/*";
                              input.onchange = (e) => {
                                const files = Array.from(
                                  (e.target as HTMLInputElement).files || []
                                );
                                files.forEach((file) => handleAddFile(file));
                              };
                              input.click();
                            }}
                          >
                            <div className='space-y-2'>
                              <p className='text-gray-600 dark:text-gray-300'>
                                Drag and drop your images here or click to
                                select
                              </p>
                              <p className='text-sm text-gray-400 dark:text-gray-500'>
                                Supports: JPG, PNG, GIF (Max 5MB each)
                              </p>
                            </div>
                          </div>

                          {formData.images.length > 0 && (
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                              {formData.images.map((file, index) => (
                                <div
                                  key={index}
                                  className='relative group animate-fade-in'
                                  style={{
                                    animation: "fadeIn 0.3s ease-in-out",
                                  }}
                                >
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index}`}
                                    className='w-full h-32 object-cover rounded-lg transition-transform duration-300'
                                    loading={index === 0 ? "eager" : "lazy"}
                                    decoding='async'
                                    fetchPriority={
                                      index === 0 ? "high" : "auto"
                                    }
                                  />
                                  <button
                                    onClick={(e) => handlePreviewClick(e, file)}
                                    className='absolute w-6 h-6 top-[10px] right-10 bg-blue-500 text-white p-1 rounded-full '
                                    title='Preview Image'
                                  >
                                    <Eye className='w-4 h-4' />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const element =
                                        e.currentTarget.parentElement;
                                      element?.classList.add(
                                        "animate-fade-out"
                                      );
                                      setTimeout(() => {
                                        handleRemoveFile(file);
                                      }, 300);
                                    }}
                                    className='absolute flex items-center justify-center w-6 h-6 p-1 top-[10px] right-2 bg-red-500 text-white rounded-full '
                                  >
                                    <X className='w-4 h-4' />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optional Details */}
            <Card className='shadow-xl overflow-hidden border-0 bg-white dark:bg-gray-900'>
              <div className='h-2 bg-gradient-to-r from-blue-900 to-purple-900 rounded-t-lg' />
              <CardHeader className='bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col space-x-0 pb-6 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700'>
                <div className='flex space-x-4'>
                  <CircleHelp className='h-6 w-6 text-purple-900' />
                  <h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
                    Optional Details
                  </h1>
                </div>
                <p className='text-zinc-400 dark:text-zinc-500'>
                  (Description, MRP, Author, etc...)
                </p>
              </CardHeader>

              <CardContent className='mt-4 px-8'>
                <Accordion type='multiple' className='w-full'>
                  {Object.entries(OptionalDetails).map(
                    ([key, value]: [string, string[]]) => (
                      <AccordionItem
                        key={key}
                        value={key}
                        className='border-0 dark:border-gray-700'
                      >
                        <AccordionTrigger className='text-primary font-light font-mono text-lg dark:text-gray-200'>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className='space-y-8 mt-4'>
                            {value.map((optionValue: string) => (
                              <div
                                key={optionValue}
                                className='grid grid-cols-1 md:grid-cols-3 gap-4 items-baseline '
                              >
                                <label
                                  htmlFor={optionValue.toLowerCase()}
                                  className='ml-2 text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200'
                                >
                                  {optionValue}
                                </label>
                                {optionValue === "Description" ? (
                                  <textarea
                                    name='description'
                                    id={optionValue
                                      .toLowerCase()
                                      .replace(/[()]/g, "")
                                      .replace(/\s+/g, "")}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder={`Enter ${optionValue}`}
                                    className='border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-1 focus:border-blue-500 outline-none transition resize-y min-h-24 max-h-56 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                                  />
                                ) : (
                                  <input
                                    type='text'
                                    name={
                                      optionValue === "Author"
                                        ? "author"
                                        : optionValue === "Edition (Year)"
                                        ? "edition"
                                        : optionValue.toLowerCase()
                                    }
                                    id={optionValue.toLowerCase()}
                                    value={
                                      optionValue === "Author"
                                        ? formData.author
                                        : optionValue === "Edition (Year)"
                                        ? formData.edition
                                        : ""
                                    }
                                    onChange={handleChange}
                                    placeholder={`Enter ${optionValue}`}
                                    className='border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-1 focus:border-blue-500 outline-none transition dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              </CardContent>
            </Card>

            {/* Pricing Details */}
            <Card className='shadow-xl overflow-hidden border-0 bg-white dark:bg-gray-900'>
              <div className='h-2 bg-gradient-to-r from-blue-900 to-purple-900 rounded-t-lg' />

              <CardHeader className='bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col space-x-0 pb-6 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700'>
                <div className='flex items-center space-x-4'>
                  <IndianRupeeIcon className='h-6 w-6 text-blue-600' />
                  <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>
                    Pricing Details
                  </h1>
                </div>
              </CardHeader>
              <CardContent className='mt-6 p-8'>
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                    <label
                      htmlFor='price'
                      className='text-gray-700 font-medium dark:text-gray-200'
                    >
                      MRP (₹)<span className='text-red-400'> *</span>
                    </label>
                    <input
                      type='number'
                      name='price'
                      id='price'
                      value={formData.price}
                      onChange={handleChange}
                      placeholder='Enter MRP'
                      className='border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                      required
                    />
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                    <label
                      htmlFor='finalprice'
                      className='text-gray-700 font-medium dark:text-gray-200'
                    >
                      Final Price (₹)<span className='text-red-400'> *</span>
                    </label>
                    <input
                      type='number'
                      name='finalprice'
                      id='finalprice'
                      value={formData.finalprice}
                      onChange={handleChange}
                      placeholder='Enter Final Price'
                      className='border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                      required
                    />
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                    <label
                      htmlFor='shippingCharge'
                      className='text-gray-700 font-medium dark:text-gray-200'
                    >
                      Shipping Charges (₹)
                      <span className='text-red-400'> *</span>
                    </label>
                    <div className='flex w-full col-span-2'>
                      <input
                        type='number'
                        name='shippingCharge'
                        id='shippingCharge'
                        value={formData.shippingCharge}
                        onChange={handleChange}
                        placeholder='Enter Shipping Charges'
                        disabled={noShippingCharge}
                        className='border border-gray-300 rounded-lg px-4 py-2 mr-2 col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50 placeholder:text-sm'
                        required
                      />
                      <div className='flex w-full items-center'>
                        or
                        <Checkbox
                          id='noShippingCharge'
                          className='mx-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                          onCheckedChange={(checked) =>
                            setNoShippingCharge(checked === true)
                          }
                          required
                        />
                        <Label
                          htmlFor='noShippingCharge'
                          className='text-gray-700 w-full dark:text-gray-200'
                        >
                          No Shipping Charges
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center '>
                    <div></div>
                    <p className='ml-2 text-sm col-span-2 dark:text-gray-400'>
                      Buyers prefer free shipping or low shipping charges.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Details */}
            <Card className='shadow-xl overflow-hidden border-0 bg-white dark:bg-gray-900'>
              <div className='h-2 bg-gradient-to-r from-blue-900 to-purple-900 rounded-t-lg' />
              <CardHeader className='bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col space-x-0 pb-6 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700'>
                <div className='flex items-center space-x-4'>
                  <ReceiptIndianRupee className='h-6 w-6 text-blue-600' />
                  <h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
                    Bank Details
                  </h1>
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  After your book is sold, in what mode would you like to
                  receive the payment?
                </p>
              </CardHeader>
              <CardContent className='mt-6 px-8 py-5'>
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center pb-4 border-b dark:border-gray-700'>
                    <label className='text-gray-700 font-medium dark:text-gray-200'>
                      Payment Mode<span className='text-red-400'> *</span>
                    </label>
                    <div className='col-span-2'>
                      <RadioGroup
                        onValueChange={handleValue}
                        required
                        className='flex flex-wrap gap-4'
                      >
                        <div className='flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-400 transition dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-400'>
                          <RadioGroupItem
                            value='UPI'
                            id='upi'
                            className='dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-400'
                          />
                          <label
                            htmlFor='upi'
                            className='text-sm font-medium cursor-pointer h-full dark:text-gray-50'
                          >
                            UPI
                          </label>
                        </div>
                        <div className='flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-400 transition dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-400'>
                          <RadioGroupItem
                            value='bank'
                            id='bank'
                            className='dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-400'
                          />
                          <label
                            htmlFor='bank'
                            className='text-sm font-medium cursor-pointer h-full dark:text-gray-50'
                          >
                            Bank Account
                          </label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  {paymentMode === "UPI" && (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                      <label
                        htmlFor='upiId'
                        className='text-gray-700 font-medium dark:text-gray-200'
                      >
                        UPI ID<span className='text-red-400'> *</span>
                      </label>
                      <input
                        type='text'
                        name='upiId'
                        id='upiId'
                        value={formData.paymentDetails.upiId}
                        onChange={handleChange}
                        placeholder='Enter UPI ID'
                        className='border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                        required
                      />
                    </div>
                  )}
                  {paymentMode === "bank" && (
                    <div className='space-y-5'>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                        <label
                          htmlFor='bankName'
                          className='text-gray-700 font-medium dark:text-gray-200'
                        >
                          Bank Name<span className='text-red-400'> *</span>
                        </label>
                        <input
                          type='text'
                          name='bankName'
                          id='bankName'
                          value={formData.paymentDetails.bankName}
                          onChange={handleChange}
                          placeholder='Enter Bank Name'
                          className='border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                          required
                        />
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                        <label
                          htmlFor='accountNumber'
                          className='text-gray-700 font-medium dark:text-gray-200'
                        >
                          Account Number<span className='text-red-400'> *</span>
                        </label>
                        <input
                          type='text'
                          name='accountNumber'
                          id='accountNumber'
                          maxLength={16}
                          value={formData.paymentDetails.accountNumber}
                          onChange={handleChange}
                          placeholder='Enter Account Number'
                          className='border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                          required
                        />
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                        <label
                          htmlFor='ifscCode'
                          className='text-gray-700 font-medium dark:text-gray-200'
                        >
                          IFSC Code<span className='text-red-400'> *</span>
                        </label>
                        <input
                          type='text'
                          name='ifscCode'
                          id='ifscCode'
                          maxLength={11}
                          value={formData.paymentDetails.ifscCode}
                          onChange={handleChange}
                          placeholder='Enter IFSC Code'
                          className='border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50'
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className='flex justify-center'>
              <Button type='submit' className='text-lg font-sans p-8 '>
                Post Your Book{" "}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
