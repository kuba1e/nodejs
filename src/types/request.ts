import { Request } from "express";
import { Query, ParamsDictionary } from "express-serve-static-core";

export interface TypedRequest<
  U,
  T extends Query = undefined,
  // P extends ParamsDictionary = undefined,
> extends Request {
  body: U;
  query: T;
  // params: P;
}
