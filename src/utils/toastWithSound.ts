// utils/toastWithSound.ts
import { toast, ToastOptions } from "react-toastify";
import store from "@/store";
import { playSound } from "@/store/slices/soundSlice";
import { ReactNode } from "react";

export const toastSuccess = (message: string | ReactNode, options?: ToastOptions) => {
    store.dispatch(playSound("success"));
    toast.success(message, options);
};

export const toastError = (message: string | ReactNode, options?: ToastOptions) => {
    store.dispatch(playSound("error"));
    toast.error(message, options);
};

export const toastWarning = (message: string | ReactNode, options?: ToastOptions) => {
    store.dispatch(playSound("error"));
    toast.warning(message, options);
};
