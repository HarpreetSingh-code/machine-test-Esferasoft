import { View, Text, SafeAreaView, Alert, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './styles'
import locale from '../../utils/locale'
import { Photos, SelectedPhotoProps, UploadState } from './types'
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { hasCameraRollPermission } from '../../utils/helpers'
import { useAppDispatch, useAppSelector } from '../../redux/redux-hooks'
import { setSelectedPhotos } from '../../redux/slices/appSlice'
import storage from '@react-native-firebase/storage';

const ImageSelection = () => {
    // hooks
    const { selectedPhotos } = useAppSelector((state) => state.appSlice);
    const dispatch = useAppDispatch();
    // states
    const [devicePhotos, setDevicePhotos] = useState<Array<SelectedPhotoProps>>([])
    const [photos, setPhotos] = useState<Photos>({
        ispermissiongranted: false,
        selectionType: "single"
    })
    const [upload, setUpload] = useState<UploadState>({
        progress: 0,
        files: 0
    })

    // useEffect
    useEffect(() => {
        hasCameraRollPermission()
            ?.then(async (status) => {
                getDevicePhotos().then((photos) => { setDevicePhotos(photos as Array<SelectedPhotoProps>) })
                setPhotos((prev: any) => { return { ...prev, ispermissiongranted: status, } })
            })
            .catch((error) => { Alert.alert(locale.permissionError, locale.problemInCameraRollPermissions) })


    }, [])

    // methods
    const handleImagePress = (image: SelectedPhotoProps) => {
        const isSelected = selectedPhotos?.includes(image)
        if (photos.selectionType == "single") {
            dispatch(setSelectedPhotos(isSelected ? [] : [image]))
        } else {
            if (isSelected) {
                const newSelected = selectedPhotos?.filter((selectedImage) => selectedImage != image)
                dispatch(setSelectedPhotos(newSelected))
            } else {
                const newSelected = [...selectedPhotos, image]
                dispatch(setSelectedPhotos(newSelected))
            }
        }
    }
    const toggleSelectionType = () => {
        dispatch(setSelectedPhotos([])) // reset
        setPhotos((prev: any) => { return { ...prev, selectionType: photos.selectionType == "multiple" ? "single" : "multiple" } })
    }
    const getDevicePhotos = async () => {
        return new Promise((resolve, reject) => {
            CameraRoll.getPhotos({ first: 20, assetType: "Photos" })
                .then((r) => {
                    const images: Array<SelectedPhotoProps> = r.edges
                    return resolve(images)
                })
                .catch((e) => { Alert.alert(locale.oops, locale.permissionError) })
        })

    }
    const uploadToFirebase = () => {
        const imagesUris = selectedPhotos?.map((photo) => photo.node?.image?.uri)
        setUpload({ progress: 0, files: imagesUris?.length })
        imagesUris.forEach(async (imageUri) => {
            const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
            const ref = storage().ref(`uploads/${filename}`);
            const task = ref.putFile(imageUri);

            task.on('state_changed', snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUpload((prev) => { return { ...prev, progress } })
            });

            try {
                await task;
                setUpload((prev) => { return { ...prev, files: prev.files - 1 } })
            } catch (error) {
                Alert.alert(locale.failed, locale.errorWhileUploadingPhotos)
            }
        });

    }
    // constants
    const isReadyToUpload = !!selectedPhotos?.length
    return (
        <SafeAreaView style={styles.container}>
            {
                photos.ispermissiongranted
                    ? <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>{locale.selectPhotos}</Text>
                            <Text onPress={toggleSelectionType} style={styles.rightLabel}>{photos.selectionType}</Text>
                        </View>

                        {/* Images List */}
                        <FlatList
                            data={devicePhotos}
                            numColumns={3}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.contentContainerStyle}
                            renderItem={({ item }) => {
                                const isSelected = selectedPhotos?.includes(item)
                                return (
                                    <TouchableOpacity style={[styles.imageContainer, isSelected && styles.imageSelectedContainer]} onPress={() => handleImagePress(item)}>
                                        <Image source={{ uri: item.node?.image?.uri }} style={styles.image} />
                                    </TouchableOpacity>
                                )
                            }}
                        />

                        {/* Upload button */}
                        {isReadyToUpload && <TouchableOpacity disabled={upload.files > 0} style={styles.uploadImageBtn} onPress={uploadToFirebase}>
                            <Text style={styles.uploadImageBtnText}>{upload?.files > 0 ? `Uploading (${upload?.files} files - ${upload.progress}%)` : locale.upload}</Text>
                        </TouchableOpacity>}
                    </View>
                    : <View style={styles.noPermissionsContainer}>
                        <Text>{locale.problemInCameraRollPermissions}</Text>
                    </View>
            }
        </SafeAreaView>
    )
}

export default ImageSelection