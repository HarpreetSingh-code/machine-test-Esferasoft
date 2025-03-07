import { PhotoIdentifier } from "@react-native-camera-roll/camera-roll";

export type Photos = {
    ispermissiongranted: boolean
    selectionType: "single" | "multiple"
};
export type SelectedPhotoProps = PhotoIdentifier

export type UploadState = {
    progress: number,
    files: number
}