export const generateChatId = (hiveId, uid1, uid2) => {
  const sorted = [uid1, uid2].sort();
  return `${hiveId}_${sorted[0]}_${sorted[1]}`;
};
