import type {Request, Response, NextFunction} from "express"

export const hello = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({message: "Working!!!"})
}