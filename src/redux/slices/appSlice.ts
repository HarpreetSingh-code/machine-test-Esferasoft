import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './types';
import { SelectedPhotoProps } from '../../screens/ImageSelection/types';

const initialState: AppState = {
    isLoading: false,
    selectedPhotos: [],
};

const appSlice = createSlice({
    name: 'app-slice',
    initialState,
    reducers: {
        startLoader: (state) => { state.isLoading = true },
        setSelectedPhotos: (state, action: PayloadAction<SelectedPhotoProps[]>) => { state.selectedPhotos = action.payload },
    }
});

export const {
    startLoader,
    setSelectedPhotos
} = appSlice.actions;
export default appSlice.reducer;
