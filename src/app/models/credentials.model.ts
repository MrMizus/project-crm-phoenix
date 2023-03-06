export interface CredentialsResponse {
    readonly data: CredentialsResponseData;
}

export interface CredentialsResponseData {
    readonly accessToken: string;
    readonly emailVerified: string;
    readonly refreshToken: string;
    readonly id: string;
}

export interface CredentialsModel {
    readonly email: string;
    readonly password: string;
}

