import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      select: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Other',
    },

    dob: {
      type: Date,
    },

    avatarId: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'banned'],
      default: 'active',
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    lastLoginMeta: {
      userAgent: { type: String, default: null },
      platform: { type: String, default: null },
      browser: { type: String, default: null },
      ipAddress: { type: String, default: null },
    },

    lastActiveAt: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    lastPasswordResetAt: {
      type: Date,
      default: null,
    },

    preferences: {
      type: Schema.Types.Mixed,
      default: {
        language: 'vi',
        currency: 'VND',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light',
        fontSize: 'normal',
      },
    },
  },
  {
    timestamps: true,
  },
);

// Dùng cho trang admin sau này: lọc user theo trạng thái và vai trò
userSchema.index({ status: 1, role: 1 });

const User = mongoose.model('User', userSchema);

export default User;