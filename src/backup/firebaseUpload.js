import { Platform } from "react-native";
import storage from "@react-native-firebase/storage";
import RNFS from "react-native-fs";

export const uploadImageToFirebase = async (photo, userId, hiveId) => {
  let tempFilePath = null;

  try {
    let uri = photo?.uri || (photo?.path ? `file://${photo.path}` : photo);

    const lowerUri = uri.toLowerCase();

    const isVideo =
      lowerUri.endsWith(".mp4") ||
      lowerUri.endsWith(".mov") ||
      lowerUri.endsWith(".m4v") ||
      lowerUri.includes("/video");

    console.log("🟡 Video:", isVideo);
    console.log("🟡 URI:", uri);

    // ANDROID content://
    if (Platform.OS === "android" && uri.startsWith("content://")) {
      const dest = `${RNFS.CachesDirectoryPath}/${Date.now()}.${
        isVideo ? "mp4" : "jpg"
      }`;

      await RNFS.copyFile(uri, dest);
      uri = `file://${dest}`;
      tempFilePath = dest;
    }

    // IOS ph://
    if (Platform.OS === "ios" && uri.startsWith("ph://")) {
      const dest = `${RNFS.TemporaryDirectoryPath}/${Date.now()}.${
        isVideo ? "mp4" : "jpg"
      }`;

      await RNFS.copyAssetsFileIOS(uri, dest, 0, 0);
      uri = `file://${dest}`;
      tempFilePath = dest;
    }

    if (!uri.startsWith("file://")) {
      throw new Error(`Invalid file URI: ${uri}`);
    }

    const uniqueId = `${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const ext = isVideo ? "mp4" : "jpg";
    const filename = `hives/${userId}/${hiveId}/${uniqueId}.${ext}`;

    const ref = storage().ref(filename);

    await ref.putFile(uri);
    const downloadURL = await ref.getDownloadURL();

    console.log("✅ Uploaded:", downloadURL);

    if (tempFilePath) {
      await RNFS.unlink(tempFilePath).catch(() => {});
    }

    // 🔥 RETURN BOTH URL + VIDEO FLAG
return downloadURL;
  } catch (e) {
    console.error("uploadImageToFirebase error:", e);
    throw e;
  }
};
