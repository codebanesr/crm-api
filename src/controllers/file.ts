import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const uploadFile = (req: Request, res: Response) => {
    console.log(req.file);
    res.send("Home api");
};
