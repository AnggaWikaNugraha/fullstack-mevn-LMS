import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// TypeScript interface — defines the shape of a User document in MongoDB
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor' | 'admin';

  // Account verification status
  isVerified: boolean;

  // OTP fields — used for both account verification and password reset
  otp: string | null;
  otpExpires: Date | null;      // OTP expires after 15 minutes
  otpLastSentAt: Date | null;   // Tracks last sent time to enforce 60s resend cooldown

  // Instance method to verify password on login
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,     // enforce one account per email at DB level
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',   // all new users are students by default
    },
    isVerified: {
      type: Boolean,
      default: false,   // account is inactive until OTP is confirmed
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    otpLastSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,   // auto-adds createdAt & updatedAt fields
  }
);

// Hash password before saving to DB
// Only runs when the password field is modified (not on other updates)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare a plain-text password against the hashed password stored in DB
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Strip sensitive fields before sending user data to the client
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const sanitized = ret as unknown as Record<string, unknown>;
    delete sanitized.password;
    delete sanitized.otp;
    delete sanitized.otpExpires;
    delete sanitized.otpLastSentAt;
    return sanitized;
  },
});

export default mongoose.model<IUser>('User', UserSchema);
