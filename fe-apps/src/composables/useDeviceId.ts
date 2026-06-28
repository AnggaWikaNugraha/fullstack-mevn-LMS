import { v4 as uuidv4 } from 'uuid';

// Generates a UUID on first visit and persists it in localStorage.
// Acts as a stable device identifier for single-device session enforcement.
export const useDeviceId = () => {
  const KEY = 'deviceId';

  const getDeviceId = (): string => {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = uuidv4();
      localStorage.setItem(KEY, id);
    }
    return id;
  };

  return { getDeviceId };
};
