import { Dimensions, PermissionsAndroid, Platform } from "react-native";


export const isAndroid = Platform.OS == "android"

export const deviceWidth = Dimensions.get("window").width

export const hasCameraRollPermission = async () => {
    if (isAndroid) {
        const getCheckPermissionPromise = () => {
            if (Platform.Version as number >= 33) {
                return Promise.all([
                    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
                    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
                ]).then(
                    ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
                        hasReadMediaImagesPermission && hasReadMediaVideoPermission,
                );
            } else {
                return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            }
        };
        const hasPermission = await getCheckPermissionPromise();

        if (hasPermission) {
            return true;
        } else {
            const getRequestPermissionPromise = () => {
                if (Platform.Version as number >= 33) {
                    return PermissionsAndroid.requestMultiple([
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
                    ]).then(
                        (statuses) =>
                            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
                            PermissionsAndroid.RESULTS.GRANTED &&
                            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
                            PermissionsAndroid.RESULTS.GRANTED,
                    );
                } else {
                    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
                }
            };

            return await getRequestPermissionPromise();
        }
    }
}