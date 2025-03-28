import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";

export const createOrUpdateAddressByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.id;
    const {
      addressLine1,
      addressLine2,
      phoneNumber,
      city,
      state,
      pincode,
      addressId,
    } = req.body;

    if (!addressLine1 || !phoneNumber || !city || !state || !pincode) {
      return response(res, 400, "Please provide all required address fields");
    }

    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      return response(res, 400, "Please provide a valid 10-digit phone number");
    }

    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      return response(res, 400, "Please provide a valid 6-digit pincode");
    }

    if (addressId) {
      const existingAddress = await Address.findById(addressId);
      if (!existingAddress) {
        return response(res, 400, "Address not found");
      }
      existingAddress.addressLine1 = addressLine1;
      existingAddress.addressLine2 = addressLine2;
      existingAddress.phoneNumber = phoneNumber;
      existingAddress.city = city;
      existingAddress.state = state;
      existingAddress.pincode = pincode;
      await existingAddress.save();
      return response(
        res,
        200,
        "Address updated successfully",
        existingAddress
      );
    } else {
      const newAddress = new Address({
        addressLine1,
        addressLine2,
        phoneNumber,
        city,
        state,
        pincode,
        user: userId,
      });
      await newAddress.save();
      await User.findByIdAndUpdate(
        userId,
        { $push: { addresses: newAddress._id } },
        { new: true }
      );
      return response(res, 200, "Address created successfully", newAddress);
    }
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

export const getAddressByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const user = User.findById(userId).populate("addresses");
    if (!user) {
      return response(res, 404, "User not found");
    }
    return response(res, 200, "Addresses fetched successfully", user.addresses);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};
