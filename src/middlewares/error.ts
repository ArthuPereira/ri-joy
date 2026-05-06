import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/domain";

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
    }));

    res.status(422).json({
        error: "Validation Error",
        errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  console.error("Erro desconhecido: ", err);
  res.status(500).json({ error: "Erro interno do servidor" });
}