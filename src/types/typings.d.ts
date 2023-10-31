import { User } from "../entity";

export {};

declare global {
  namespace Express {
    interface Response {
      badRequest: (message?: string) => void;
      unauthorized: (message?: string) => void;
      notFound: (message?: string) => void;
      serverError: (message?: string) => void;
      success: ({ data, message }: { data?: any; message?: string }) => void;
      successWithToken: ({
        data,
        refreshToken,
        message,
      }: {
        data?: any;
        refreshToken?: string;
        message?: string;
      }) => void;
    }
    interface Request {
      userData: Partial<User>;
    }
  }
}
