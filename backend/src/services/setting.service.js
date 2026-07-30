import AppSetting from '../models/AppSetting.js';

// Fields an admin is allowed to change via updateAppSettings.
const SETTING_UPDATE_FIELDS = ['registrationEnabled'];

// The app has exactly one settings document. Creates it with defaults on
// first read/write so callers never have to think about bootstrapping.
export const getAppSettings = async () =>
  AppSetting.findOneAndUpdate(
    {},
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

export const updateAppSettings = async (payload = {}) => {
  const safePayload = Object.fromEntries(
    Object.entries(payload).filter(([key]) => SETTING_UPDATE_FIELDS.includes(key)),
  );

  return AppSetting.findOneAndUpdate({}, safePayload, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  });
};
