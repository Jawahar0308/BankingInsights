import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface User {
    email: string;
    isNewUser?: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isNewUser: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isNewUser: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isNewUser = action.payload.isNewUser || false;
        },
        logout(state) {
            localStorage.removeItem('isNewUser');
            state.user = null;
            state.isAuthenticated = false;
            state.isNewUser = false;
        },
        markAsExistingUser(state) {
            state.isNewUser = false;
        },
    },
});

export const { login, logout, markAsExistingUser } = authSlice.actions;

// // Thunk for handling complete logout
// export const completeLogout = (): AppThunk<void> => (dispatch) => {
//     dispatch(logout());
// };

export type { User, AuthState };
export default authSlice.reducer;
