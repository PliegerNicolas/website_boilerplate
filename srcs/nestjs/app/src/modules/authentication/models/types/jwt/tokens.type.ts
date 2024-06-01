import { JwtTokenEnum } from "../../enums/jwt-tokens.enum";

export type JwtTokensParams = {

    readonly accessToken: JwtTokenParams | undefined;
    readonly refreshToken: JwtTokenParams | undefined;

}

export type JwtTokenParams = {

    readonly name: JwtTokenEnum;
    readonly value: string;

}