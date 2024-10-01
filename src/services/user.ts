import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";
const JWT_SECRET = "veryverysecuredjwttoken";

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface getUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }

  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = UserService.generateHash(salt, password);
    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    });
  }

  public static async getUserToken(payload: getUserTokenPayload) {
    const { email, password } = payload;
    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) throw new Error("No user exists with this email!");

    const salt = user.salt;
    const hashedPassword = UserService.generateHash(salt, password);

    if (hashedPassword !== user.password) {
      throw new Error("Incorrect password");
    }

    // generate a token
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }
}

export default UserService;
