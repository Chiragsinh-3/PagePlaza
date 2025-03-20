import React, { useEffect, useState } from "react";
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
} from "@/store/api";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
}

const Addresses = ({
  isCheckOutClicked,
  changeCheckOutClicked,
}: AddressesProps) => {
  const user = useSelector((state: RootState) => state.user.user);
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
  const { data: userAddresses } = useAddressByUserIdQuery(id);
  const [createOrUpdateAddress] = useCreateOrUpdateAddressMutation();

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

  return (
    <div>
      {/* Manage Addresses Dialog */}
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className='max-w-[25rem] sm:max-w-[30rem]'>
          <DialogHeader>
            <DialogTitle>Manage Addresses</DialogTitle>
          </DialogHeader>

          {addresses.length > 0 ? (
            <div className=' max-h-96 font-sans flex flex-wrap gap-2 justify-between overflow-y-auto'>
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className='p-4 border sm:w-52 text-sm rounded-md w-full cursor-pointer hover:bg-gray-900/40'
                  onClick={() => handleEditAddress(index)}
                >
                  <p className=''>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p>{address.phoneNumber}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center py-4 text-gray-500'>
              No addresses added yet.
            </p>
          )}

          <DialogFooter className='sm:justify-center'>
            <Button onClick={openAddAddressDialog} className='w-full'>
              <Plus className='w-4 h-4 mr-2' /> Add New Address
            </Button>
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
