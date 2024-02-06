import { JwtPayload } from "jwt-decode";
import { UserInterface } from "./user";

export interface IAuthentication {
    isLogin: boolean;
    user: UserInterface| null;
    token: IToken | null;
    status: string | null;
    error: string | null;
}

export interface IToken {
    refreshToken: string | null;
    accessToken: string | null;
}

export interface IAuthPayload {
    email: string;
    password: string;
}

export interface JWT extends JwtPayload {
    user_id: number;
    email: string;
}
