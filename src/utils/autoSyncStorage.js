import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_HANDLED_PHOTO_KEY = 'LAST_HANDLED_PHOTO_TIMESTAMP';

export const getLastHandledPhotoTimestamp = async () => {
  const value = await AsyncStorage.getItem(LAST_HANDLED_PHOTO_KEY);
  return value ? Number(value) : 0;
};

export const setLastHandledPhotoTimestamp = async (timestamp) => {
  await AsyncStorage.setItem(
    LAST_HANDLED_PHOTO_KEY,
    String(timestamp)
  );
};
