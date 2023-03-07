export interface UserResponse {
    readonly data: UserData;
  }
  
  interface UserData {
    user: UserDataUser;
  }
  
  interface UserDataUser {
    readonly id: string;
    readonly context: UserContext;
  }
  
  interface UserContext {
    readonly aud: string;
    readonly auth_time: number;
    readonly email: string;
    readonly email_verified: boolean;
    readonly exp: number;
    readonly iat: number;
    readonly iss: string;
    readonly sub: string;
    readonly uid: string;
    readonly user_id: string;
    readonly firebase: UserFirebase;
  }
  
  interface UserFirebase {
    readonly sign_in_provider: string;
    readonly identities: UserIdentities
  }
  
  interface UserIdentities {
    readonly email: string[];
  }
  