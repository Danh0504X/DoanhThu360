import mongoose from 'mongoose';

const { Schema } = mongoose;

const businessSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    taxCode: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      enum: ['household', 'company', 'store', 'online_shop', 'other'],
      default: 'household',
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    representativeName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

businessSchema.index({ ownerId: 1 });
businessSchema.index({ taxCode: 1 });

const Business = mongoose.model('Business', businessSchema);

export default Business;
