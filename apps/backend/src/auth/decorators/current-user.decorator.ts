import { createParamDecorator } from "@nestjs/common";
import type { ExecutionContext } from "@nestjs/common";

export interface JwtUser {
  id: number;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUser => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtUser }>();
    return request.user;
  },
);
