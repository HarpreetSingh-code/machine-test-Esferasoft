import { StyleSheet } from "react-native";
import colors from "../../utils/colors";
import { deviceWidth } from "../../utils/helpers";

export default StyleSheet.create({
    container: {
        flex: 1
    },
    // header
    headerContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBlockColor: colors.gray,
        borderBottomWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    headerTitle: {
        color: colors.black,
        fontSize: 18,
        fontWeight: "bold"
    },
    rightLabel: {
        color: colors.black,
        textTransform: "capitalize"
    },

    // no premissions
    noPermissionsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noPermissionLabel: {
        color: colors.red,
        textAlign: "center",
        paddingHorizontal: 20
    },

    // images list
    contentContainerStyle: {
        paddingBottom: 30 // to prevent hiding the upload button
    },
    imageContainer: {
        borderWidth: 1,
        borderColor: colors.white
    },
    imageSelectedContainer: {
        borderColor: colors.red
    },
    image: {
        width: deviceWidth * 0.30,
        aspectRatio: 1,
        margin: 5
    },

    // upload button
    uploadImageBtn: {
        position: "absolute",
        bottom: 20,
        right: 20,
        left: 20,
        backgroundColor: colors.red,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    uploadImageBtnText: {
        color: colors.white
    }
})