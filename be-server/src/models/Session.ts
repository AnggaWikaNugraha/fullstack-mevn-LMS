import mongoose, { Document, Schema } from 'mongoose';

// Each session represents one active login on one device
export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string;         // unique identifier per device (UUID on web, native ID on mobile)
  refreshToken: string;     // hashed refresh token stored here, not the raw token
  refreshExpiredAt: Date;   // fixed 1-day expiry from login time
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    // Store hashed refresh token — if DB is breached, raw tokens are not exposed
    refreshToken: {
      type: String,
      required: true,
    },
    refreshExpiredAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index — one user can only have one active session per device
SessionSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

// TTL index — MongoDB automatically deletes the session document after it expires
// This handles the "auto-clear expired session" behavior
SessionSchema.index({ refreshExpiredAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ISession>('Session', SessionSchema);
