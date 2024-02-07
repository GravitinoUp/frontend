import axios from 'axios'
import { getJWTtokens } from './helpers'

const axiosRequest = axios.create({
    baseURL: import.meta.env.VITE_API,
})

const setAuthToken = () => {
    if (typeof window !== 'undefined') {
        const { accessToken } = getJWTtokens()

        if (accessToken) {
            axiosRequest.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        } else {
            delete axiosRequest.defaults.headers.common.Authorization
        }
    }
}

setAuthToken()

export { axiosRequest, setAuthToken }
