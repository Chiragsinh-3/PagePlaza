"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    profilePicture: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    agreeTerms: { type: Boolean, required: false },
    addresses: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Address" }],
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password)
        return next();
    const salt = await bcrypt_1.default.genSalt(10);
    this.password = await bcrypt_1.default.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt_1.default.compare(candidatePassword, this.password);
};
exports.default = mongoose_1.default.model("User", userSchema);
