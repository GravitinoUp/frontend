import { createSlice } from '@reduxjs/toolkit'
import { AuthInterface } from '@/types/interface/auth'

const initialState: AuthInterface = {
    isLogin: false,
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (_, action) => {
            document.cookie = `accessToken=${action.payload}; Max-Age=43200`
        },
        setRefreshToken: (_, action) => {
            document.cookie = `refreshToken=${action.payload}`
        },
    },
})

export const { setAccessToken, setRefreshToken } = authSlice.actions
export default authSlice.reducer
