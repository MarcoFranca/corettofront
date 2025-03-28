import { toast } from 'react-toastify';
import { playSound } from '@/store/slices/soundSlice';
import store from '@/store';

type ToastType = 'success' | 'error';

export function showToastWithSound({ type, message }: { type: ToastType, message: string }) {
    if (type === 'success') {
        toast.success(message);
        store.dispatch(playSound('success'));
    } else if (type === 'error') {
        toast.error(message);
        store.dispatch(playSound('error'));
    }
}
