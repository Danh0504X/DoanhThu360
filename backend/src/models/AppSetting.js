import mongoose from 'mongoose';

const { Schema } = mongoose;

// Singleton document: the whole app reads/writes the single row in this
// collection (see setting.service.js) rather than keying by an id.
const appSettingSchema = new Schema(
  {
    registrationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const AppSetting = mongoose.model('AppSetting', appSettingSchema);

export default AppSetting;
