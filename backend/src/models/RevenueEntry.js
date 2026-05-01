import mongoose from 'mongoose';

const { Schema } = mongoose;

const revenueEntrySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    revenueDate: {
      type: Date,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    cashAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    bankAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['draft', 'confirmed'],
      default: 'confirmed',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

revenueEntrySchema.index({ businessId: 1, revenueDate: 1, isDeleted: 1 });
revenueEntrySchema.index({ userId: 1, revenueDate: 1, isDeleted: 1 });

const RevenueEntry = mongoose.model('RevenueEntry', revenueEntrySchema);

export default RevenueEntry;
