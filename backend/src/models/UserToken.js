import mongoose from 'mongoose';

const { Schema } = mongoose;

const userTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['email_verification', 'password_reset'],
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const UserToken = mongoose.model('UserToken', userTokenSchema);

export default UserToken;
