import mongoose from 'mongoose';

const { Schema } = mongoose;

const businessSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
      unique: true,
      sparse: true,

    },
    businessType: {
      type: String,
      enum: ['bán lẻ', 'dịch vụ', 'khác'],
      default: 'bán lẻ',
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

const Business = mongoose.model('Business', businessSchema);

export default Business;
