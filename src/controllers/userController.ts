import { RequestHandler } from "express";
import { registerUser, loginUser } from "../services/userService";
import { ResponseError } from "../error/responseError";
import bcrypt from "bcrypt";

export const register: RequestHandler = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const data = await registerUser(name, email, password);

        res.status(201).json({
            message: "User registered successfully",
            data: data
        });
    } catch (error) {
        if (error instanceof ResponseError) {
            next(error);
        } else ((error as Error).message === "Email Already Exist"); {
            next(new ResponseError(500, "Email Already Exist"));
        } 
    }
};

export const login: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return 
        }

        const { accessToken, refreshToken } = await loginUser(email, password);

        if (!refreshToken) {
            throw new ResponseError(400, "Refresh token is missing");
        }

        res.status(200).json({
            message: "Login successful",
            data: { accessToken, refreshToken },  // Mengembalikan refresh token yang asli
        });
    } catch (error) {
        next(error);
    }
};


export const getUsers: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        res.status(200).json({ message: "User data retrieved successfully" });
    } catch (error) {
        next(error);
    }
};

export const getUserById: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        res.status(200).json({ message: "User data retrieved successfully" });
    } catch (error) {
        next(error);
    }
}
