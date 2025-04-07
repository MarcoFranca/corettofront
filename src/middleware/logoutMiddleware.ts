import { Middleware } from '@reduxjs/toolkit';
import { logout } from '@/store/slices/authSlice';
import { resetClientes } from '@/store/slices/clientesSlice';
import { resetAgenda } from '@/store/slices/meetingSlice';

const logoutMiddleware: Middleware = ({ dispatch }) => (next) => (action) => {
    if (logout.match(action)) {
        dispatch(resetClientes());
        dispatch(resetAgenda());
    }
    return next(action);
};

export default logoutMiddleware;
