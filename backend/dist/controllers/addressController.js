"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressByUserId = exports.createOrUpdateAddressByUserId = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const Address_1 = __importDefault(require("../models/Address"));
const User_1 = __importDefault(require("../models/User"));
const createOrUpdateAddressByUserId = async (req, res) => {
    try {
        const userId = req.id;
        const { addressLine1, addressLine2, phoneNumber, city, state, pincode, addressId, } = req.body;
        if (!addressLine1 || !phoneNumber || !city || !state || !pincode) {
            return (0, responseHandler_1.response)(res, 400, "Please provide all required address fields");
        }
        if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
            return (0, responseHandler_1.response)(res, 400, "Please provide a valid 10-digit phone number");
        }
        if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
            return (0, responseHandler_1.response)(res, 400, "Please provide a valid 6-digit pincode");
        }
        if (addressId) {
            const existingAddress = await Address_1.default.findById(addressId);
            if (!existingAddress) {
                return (0, responseHandler_1.response)(res, 400, "Address not found");
            }
            existingAddress.addressLine1 = addressLine1;
            existingAddress.addressLine2 = addressLine2;
            existingAddress.phoneNumber = phoneNumber;
            existingAddress.city = city;
            existingAddress.state = state;
            existingAddress.pincode = pincode;
            await existingAddress.save();
            return (0, responseHandler_1.response)(res, 200, "Address updated successfully", existingAddress);
        }
        else {
            const newAddress = new Address_1.default({
                addressLine1,
                addressLine2,
                phoneNumber,
                city,
                state,
                pincode,
                user: userId,
            });
            await newAddress.save();
            await User_1.default.findByIdAndUpdate(userId, { $push: { addresses: newAddress._id } }, { new: true });
            return (0, responseHandler_1.response)(res, 200, "Address created successfully", newAddress);
        }
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
};
exports.createOrUpdateAddressByUserId = createOrUpdateAddressByUserId;
const getAddressByUserId = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User_1.default.findById(userId).populate("addresses");
        if (!user) {
            return (0, responseHandler_1.response)(res, 404, "User not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Addresses fetched successfully", user.addresses);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
};
exports.getAddressByUserId = getAddressByUserId;
