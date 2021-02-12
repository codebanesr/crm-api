import * as bcrypt from "bcryptjs";

// used by user update call, and by user.presave hook
export const hashPassword = async (password: string) => {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
}