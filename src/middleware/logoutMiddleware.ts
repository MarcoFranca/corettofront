import { Middleware } from '@reduxjs/toolkit';
import { logout } from '@/store/slices/authSlice';
import { resetClientes } from '@/store/slices/clientesSlice';
import { resetLeads } from '@/store/slices/leadsSlice';
import { resetAgenda } from '@/store/slices/meetingSlice';
import { resetTodos } from '@/store/slices/todoSlice';

const logoutMiddleware: Middleware = ({ dispatch }) => (next) => (action) => {
    if (logout.match(action)) {
        dispatch(resetClientes());
        dispatch(resetLeads());
        dispatch(resetAgenda());
        dispatch(resetTodos());
    }
    return next(action);
};

export default logoutMiddleware;
