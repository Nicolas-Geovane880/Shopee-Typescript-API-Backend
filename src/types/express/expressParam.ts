import type {Request, Response, NextFunction} from "express";

export type ExpressParam = (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown;