import { JwtPayload } from 'jwt-decode'
import { UserInterface } from './user'

export interface AuthInterface {
    isLogin: boolean
    user: UserInterface | null
}

export interface TokenInterface {
    refreshToken: string | null
    accessToken: string | null
}

export interface AuthPayloadInterface {
    email: string
    password: string
}

export interface RefreshPayloadInterface {
    refresh_token: string
}

export interface JWT extends JwtPayload {
    user_id: number
    email: string
}
