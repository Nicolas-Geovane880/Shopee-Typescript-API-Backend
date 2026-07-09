import { saveUser, findByEmail } from "./userService.js";
import { generateTokens } from "./tokenService.js";
import type { UserCreateSchema } from "../types/userSchema.js";
import type { LoginSchema } from "../types/authSchema.js";
import bcrypt from "bcryptjs";

export const signup = async (dto: UserCreateSchema) => {
    return await saveUser (dto);
}

export const login = async (dto: LoginSchema) => {
    const found = await findByEmail (dto.email);

    if (!found) throw new Error ();
    
    const isPasswordValid = await bcrypt.compare (dto.password, found.passwordHash);

    if (!isPasswordValid) throw new Error ();

    return generateTokens (found.id);
}