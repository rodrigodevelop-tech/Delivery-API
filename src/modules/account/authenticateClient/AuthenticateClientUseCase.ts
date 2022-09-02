import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "../../../database/prismaClient";
import { env } from "process";

interface IAuthenticateClient {
  username: string;
  password: string;
}

export class AuthenticateClientUseCase {
  async execute({ username, password }: IAuthenticateClient) {
    // Receber username, password,

    // verificar se existe username
    const client = await prisma.clients.findFirst({
      where: {
        username,
      },
    });

    if (!client) {
      throw new Error("Username or password invalid");
    }
    // Verificar se senha corresponde ao username
    const passwordMatch = await compare(password, client.password);

    if (!passwordMatch) {
      throw new Error("Username or password invalid");
    }
    // Gerar o token
    const token = sign(
      {
        username,
      },
      env.CLIENT_SECRET_JWT!,
      {
        subject: client.id,
        expiresIn: "1d",
      }
    );

    return token;
  }
}
