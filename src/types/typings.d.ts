import { TokenPayload } from "./token";

export {};

declare global {
  namespace Express {
    interface Response {
      badRequest: (message?: string) => void;
      unauthorized: (message?: string) => void;
      forbidden: (message?: string) => void;
      notFound: (message?: string) => void;
      serverError: (message?: string) => void;
      success: ({ data, message }: { data?: any; message?: string }) => void;
      successWithToken: ({
        data,
        accessToken,
        message,
      }: {
        data?: any;
        accessToken?: string;
        message?: string;
      }) => void;
    }
    interface Request {
      auth: TokenPayload;
    }
  }
}
