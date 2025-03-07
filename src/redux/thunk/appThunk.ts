import { createAsyncThunk } from "@reduxjs/toolkit";
import endpoint from "../../api/endpoint";
import { AxiosResponse } from "axios";
import api from "../../api/api";


export const getStripePublishableKeyThunk = createAsyncThunk(    //# Get Stripe Publishable Key 
    'auth/getStripePublishableKeyThunk',
    async (data: any, { fulfillWithValue, rejectWithValue }) => {
        const url = endpoint.getStripePublishableKey
        try {
            const response: AxiosResponse<any> = await api.get(url);
            return fulfillWithValue(response.data?.data);
        } catch (error) {
            return rejectWithValue(error);
        } finally {
            // do something...
        }
    },
);