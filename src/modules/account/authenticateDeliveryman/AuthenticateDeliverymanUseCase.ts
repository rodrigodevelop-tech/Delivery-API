import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "../../../database/prismaClient";
import { env } from "process";

interface IAuthenticateDeliveryman {
  username: string;
  password: string;
}

export class AuthenticateDeliverymanUseCase {
  async execute({ username, password }: IAuthenticateDeliveryman) {
    // Receber username, password,

    // verificar se existe username
    const deliveryman = await prisma.deliveryman.findFirst({
      where: {
        username,
      },
    });

    if (!deliveryman) {
      throw new Error("Username or password invalid");
    }
    // Verificar se senha corresponde ao username
    const passwordMatch = await compare(password, deliveryman.password);

    if (!passwordMatch) {
      throw new Error("Username or password invalid");
    }
    // Gerar o token
    const token = sign(
      {
        username,
      },
      env.DELIVERYMAN_SECRET_JWT!,
      {
        subject: deliveryman.id,
        expiresIn: "1d",
      }
    );

    return token;
  }
}
