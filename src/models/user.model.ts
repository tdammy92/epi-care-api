import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/hashing";
import {
  baseProfileSchema,
  doctorProfileSchema,
  nurseProfileSchema,
  patientProfileSchema,
  registerSchema,
  UserDocument,
} from "../schema/auth.schema";

// export interface UserDocument extends mongoose.Document {
//   email: string;
//   password: string;
//   verified: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   comparePassword(val: string): Promise<boolean>;
//   omitPassword(): Pick<
//   UserDocument,
//   //@ts-ignore
//     "_id" | "email" | "verified" | "createdAt" | "updatedAt" | "__v"
//   >;
// }

// const userSchema = new mongoose.Schema<UserDocument>(
//   {
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     verified: { type: Boolean, required: true, default: false },
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }

//   this.password = await hashValue(this.password);
//   return next();
// });

// userSchema.methods.comparePassword = async function (val: string) {
//   return compareValue(val, this.password);
// };

// userSchema.methods.omitPassword = function () {
//   const user = this.toObject();
//   delete user.password;
//   return user;
// };

// const UserModel = mongoose.model<UserDocument>("User", userSchema);
// export default UserModel;

// Mongoose schema definition
const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email: string) =>
          registerSchema._def.schema.shape.email.safeParse(email).success,
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (password: string) {
          return registerSchema._def?.schema?.shape.password.safeParse(password)
            .success;
        },
        message:
          "Password must be at least 8 characters with uppercase, lowercase, and number",
      },
    },
    role: {
      type: String,
      required: true,
      enum: [
        "doctor",
        "nurse",
        "social_worker",
        "lab_scientist",
        "patient",
        "admin",
      ],
      validate: {
        validator: (role: string) =>
          registerSchema._def.schema.shape.role.safeParse(role).success,
        message: "Invalid role",
      },
    },
    profile: {
      firstName: {
        type: String,
        required: true,
        validate: {
          validator: (name: string) =>
            baseProfileSchema.shape.firstName.safeParse(name).success,
          message: "First name must be at least 2 characters",
        },
      },
      lastName: {
        type: String,
        required: true,
        validate: {
          validator: (name: string) =>
            baseProfileSchema.shape.lastName.safeParse(name).success,
          message: "Last name must be at least 2 characters",
        },
      },
      dateOfBirth: {
        type: Date,
        required: true,
        validate: {
          validator: function (dob: Date) {
    
            const dateValue = dob instanceof Date ? dob : new Date(dob as string);
             // Check if it's a valid date first
          if (isNaN(dateValue.getTime())) {
            return false;
          }
           return  baseProfileSchema.shape.dateOfBirth.safeParse(dateValue).success;
          },
          message: "Date of birth must be in the past",
        },
      },
      phoneNumber: {
        type: String,
        required: true,
        validate: {
          validator: (phone: string) =>
            baseProfileSchema.shape.phoneNumber.safeParse(phone).success,
          message: "Invalid phone number",
        },
      },
      // Role-specific fields
      specialization: {
        type: String,
        required: function (this: any) {
          return this.role === "doctor";
        },
        validate: {
          validator: function (this: any, spec: string) {
            if (this.role !== "doctor") return true;
            return doctorProfileSchema.shape.specialization.safeParse(spec)
              .success;
          },
          message: "Specialization must be at least 3 characters",
        },
      },
      licenseNumber: {
        type: String,
        unique: true,
        required: function (this: any) {
          return ["doctor", "nurse"].includes(this.role);
        },
        validate: {
          validator: function (this: any, license: string) {
            if (!["doctor", "nurse"].includes(this.role)) return true;
            return this.role === "doctor"
              ? doctorProfileSchema.shape.licenseNumber.safeParse(license)
                  .success
              : nurseProfileSchema.shape.licenseNumber.safeParse(license)
                  .success;
          },
          message: "License number must be at least 6 characters",
        },
      },
      department: { type: String },
      patientId: {
        type: String,
        required: function (this: any) {
          return this.role === "patient";
        },
        validate: {
          validator: function (this: any, id: string) {
            if (this.role !== "patient") return true;
            return patientProfileSchema.shape.patientId.safeParse(id).success;
          },
          message: "Patient ID must be at least 4 characters",
        },
      },
      guardianFullName: {
        type: String,
        required: function (this: any) {
          return this.role === "patient";
        },
      },
      relationShip: {
        type: String,
        required: function (this: any) {
          return this.role === "patient";
        },
      },
      guardianPhone: {
        type: String,
        required: function (this: any) {
          return this.role === "patient";
        },
      },
      bloodType: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },

      allergies: { type: [String] },
      caseLoad: { type: Number },
      certification: { type: String },
      labDepartment: { type: String },
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    verified: {
      type: Boolean,
      required: true,
      default: function (this: any) {
        return this.role === "admin";
      },
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await hashValue(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};
//!! uncomment later
// Add method to validate user data against Zod schema
userSchema.methods.validateUser = function () {
  return registerSchema.safeParse(this.toObject());
};

// Method to omit sensitive fields
userSchema.methods.omitSensitive = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v; // Optional: remove version key
  return user;
};

// Method to get public profile (even more restrictive)
userSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  delete user.isActive;
  delete user.lastLogin;
  delete user.createdAt;
  return user;
};

// Static method to format user for response (alternative approach)
userSchema.statics.formatForResponse = function (user: any) {
  const { password, __v, ...userData } = user.toObject ? user.toObject() : user;
  return userData;
};

// Method to validate user data against Zod schema (updated to omit password)
userSchema.methods.validateUser = function () {
  const userData = this.omitSensitive();
  return registerSchema.safeParse(userData);
};


// Static method for Zod validation before saving
userSchema.statics.zodValidate = function (data: any) {
  return registerSchema.safeParse(data);
};

// userSchema.methods.omitPassword = function () {
//     const user = this.toObject();
//     delete user.password;
//     return user;
//   };

// Create the model
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
