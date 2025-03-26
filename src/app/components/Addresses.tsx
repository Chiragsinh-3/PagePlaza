import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useAddressByUserIdQuery,
  useCreateOrUpdateAddressMutation,
  useCreateOrUpdateOrderMutation,
  useGetOrderByUserQuery,
} from "@/store/api";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import RazorpayPayment from "@/components/RazorpayPayment";

interface Address {
  addressLine1: string;
  addressLine2?: string;
  phoneNumber: string;
  city: string;
  state: string;
  pincode: string;
  addressId: string;
}

interface AddressesProps {
  isCheckOutClicked: boolean;
  changeCheckOutClicked: (open: boolean) => void;
  amount?: number;
  cartItems: any[]; // Add cart items prop
}

const Addresses = ({
  isCheckOutClicked,
  changeCheckOutClicked,
  amount = 0,
  cartItems,
}: AddressesProps) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user?.user);
  const id = user._id;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    addressLine1: "",
    addressLine2: "",
    phoneNumber: "",
    city: "",
    state: "",
    pincode: "",
    addressId: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [orderId, setOrderId] = useState<string | null>(null);
  const { data: existingOrders } = useGetOrderByUserQuery(id, {
    pollingInterval: 0,
    refetchOnMountOrArgChange: true,
  });
  console.log(existingOrders);
  const { data: userAddresses } = useAddressByUserIdQuery(id);
  const [createOrUpdateAddress] = useCreateOrUpdateAddressMutation();
  const [createOrder] = useCreateOrUpdateOrderMutation();
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  // console.log(isSuccess);
  const findExistingPendingOrder = useCallback(() => {
    if (!existingOrders?.data) return null;

    return existingOrders.data.find((order: any) => {
      // Normalize the order items for comparison
      const orderItems = order.items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
      }));

      const currentCartItems = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      return (
        order.payment_status === "pending" &&
        order.status === "pending" && // Changed from "processing" to match your data
        order.totalAmount === amount &&
        JSON.stringify(orderItems) === JSON.stringify(currentCartItems)
      );
    });
  }, [existingOrders, amount, cartItems]);
  console.log(findExistingPendingOrder());
  useEffect(() => {
    if (userAddresses) {
      // add _id as addressId for each address
      const updatedAddresses = userAddresses.data.map((address: any) => ({
        ...address,
        addressId: address._id,
      }));
      setAddresses(updatedAddresses);
    }
  }, [userAddresses]);

  useEffect(() => {
    if (isCheckOutClicked) {
      changeCheckOutClicked(false);
      setIsManageDialogOpen(true);
    }
  }, [isCheckOutClicked, changeCheckOutClicked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrUpdateAddress(newAddress).unwrap();

      if (isEditMode && editIndex !== null) {
        const updatedAddresses = [...addresses];
        updatedAddresses[editIndex] = newAddress;
        setAddresses(updatedAddresses);
        toast.success("Address updated successfully");
      } else {
        setAddresses([...addresses, newAddress]);
        toast.success("Address added successfully");
      }

      resetForm();
    } catch (error) {
      console.log("Error managing address:", error);
      toast.error("Failed to save address");
    }
  };

  const resetForm = () => {
    setIsAddDialogOpen(false);
    setIsEditMode(false);
    setEditIndex(null);
    setNewAddress({
      addressLine1: "",
      addressLine2: "",
      phoneNumber: "",
      city: "",
      state: "",
      pincode: "",
      addressId: "",
    });
  };

  const handleEditAddress = (index: number) => {
    // edit address not create new
    setIsEditMode(true);
    setEditIndex(index);
    setNewAddress(addresses[index]);
    setIsAddDialogOpen(true);
    setIsManageDialogOpen(false);
  };

  const openAddAddressDialog = () => {
    resetForm();
    setIsManageDialogOpen(false);
    setIsAddDialogOpen(true);
  };

  const handleAddressSelect = async (address: Address) => {
    try {
      setSelectedAddressId(address.addressId);

      if (!id || !address.addressId || !amount || !cartItems?.length) {
        toast.error("Missing required order information");
        return;
      }
      const existingOrder = await findExistingPendingOrder();
      // Wait for orders to load
      // if (!isSuccess) {
      //   toast.error("Loading existing orders...");
      //   return;
      // }
      console.log(existingOrder);
      const formattedItems = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      // Find existing pending order

      const orderData = {
        orderId: existingOrder?._id,
        shippingAddress: address.addressId,
        payment_method: "RAZORPAY",
        totalAmount: amount,
        items: formattedItems,
      };

      const response = await createOrder(orderData).unwrap();

      if (response.data?._id) {
        setOrderId(response.data._id);
        toast.success(
          existingOrder
            ? "Order updated successfully"
            : "Order created successfully"
        );
      } else {
        throw new Error("No order ID received");
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error(error?.data?.message || "Failed to create order");
      setSelectedAddressId(null);
      setOrderId(null);
    }
  };

  return (
    <div>
      {/* Manage Addresses Dialog */}
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className='max-w-[25rem] sm:max-w-[30rem]'>
          <DialogHeader>
            <DialogTitle>Select Delivery Address</DialogTitle>
          </DialogHeader>

          {addresses.length > 0 ? (
            <div className='max-h-96 font-sans flex flex-wrap gap-2 justify-between overflow-y-auto'>
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className={`flex border sm:w-52 text-sm rounded-md w-full cursor-pointer hover:bg-gray-900/40 ${
                    selectedAddressId === address.addressId
                      ? "border-indigo-600 bg-gray-900/40"
                      : ""
                  }`}
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className='p-4 flex-1'>
                    <div>
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p>{address.phoneNumber}</p>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(index);
                    }}
                    className='rounded-full mr-2 mt-2 h-fit w-fit p-2'
                  >
                    <Pencil className='w-4 h-4' />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center py-4 text-gray-500'>
              No addresses added yet.
            </p>
          )}

          <DialogFooter className='flex flex-col gap-2'>
            <Button onClick={openAddAddressDialog} className='w-full'>
              <Plus className='w-4 h-4 mr-2' /> Add New Address
            </Button>
            {selectedAddressId && orderId && (
              <RazorpayPayment
                orderId={orderId}
                amount={amount}
                setIsManageDialogOpen={setIsManageDialogOpen}
                onSuccess={() => {
                  setIsManageDialogOpen(false);
                  router.push(`/order-confirmation/${orderId}`);
                }}
                onFailure={() => {
                  setSelectedAddressId(null);
                  setOrderId(null);
                }}
              />
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Address Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open && !isManageDialogOpen) {
            setIsManageDialogOpen(true);
          }
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              placeholder='Address Line 1'
              value={newAddress.addressLine1}
              onChange={(e) =>
                setNewAddress({ ...newAddress, addressLine1: e.target.value })
              }
              required
            />
            <Input
              placeholder='Address Line 2 (Optional)'
              value={newAddress.addressLine2}
              onChange={(e) =>
                setNewAddress({ ...newAddress, addressLine2: e.target.value })
              }
            />
            <Input
              placeholder='Phone Number'
              value={newAddress.phoneNumber}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phoneNumber: e.target.value })
              }
              maxLength={10}
              required
            />
            <div className='grid grid-cols-2 gap-4'>
              <Input
                placeholder='City'
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                required
              />
              <Input
                placeholder='State'
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                required
              />
            </div>
            <Input
              placeholder='Pincode'
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
              maxLength={6}
              required
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setIsManageDialogOpen(true);
                }}
              >
                Cancel
              </Button>
              <Button type='submit'>
                {isEditMode ? "Update Address" : "Add Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Addresses;
