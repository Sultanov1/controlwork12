export interface UserDetails {
  _id: string;
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  avatar: string | null;
  googleID?: string;
}

export interface RegisterResponse {
  user: UserDetails;
  message: string;
}

export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
  avatar: string | null;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}