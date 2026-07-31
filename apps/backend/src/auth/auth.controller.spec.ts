import { Test, type TestingModule } from "@nestjs/testing";
import type { AuthResponse } from "@expense-tracker/shared";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: { register: jest.Mock; login: jest.Mock };

  const authResponse: AuthResponse = {
    user: {
      id: 1,
      email: "user@example.com",
      name: "Test User",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    },
    accessToken: "signed-jwt-token",
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("delegates to AuthService.register with the given dto", async () => {
      const dto: RegisterDto = {
        name: "Test User",
        email: "user@example.com",
        password: "password123",
      };
      authService.register.mockResolvedValue(authResponse);

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(result).toBe(authResponse);
    });

    it("propagates errors thrown by AuthService.register", async () => {
      const dto: RegisterDto = {
        name: "Test User",
        email: "user@example.com",
        password: "password123",
      };
      const error = new Error("Пользователь с таким email уже существует");
      authService.register.mockRejectedValue(error);

      await expect(controller.register(dto)).rejects.toThrow(error);
    });
  });

  describe("login", () => {
    it("delegates to AuthService.login with the given dto", async () => {
      const dto: LoginDto = {
        email: "user@example.com",
        password: "password123",
      };
      authService.login.mockResolvedValue(authResponse);

      const result = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toBe(authResponse);
    });

    it("propagates errors thrown by AuthService.login", async () => {
      const dto: LoginDto = {
        email: "user@example.com",
        password: "wrong-password",
      };
      const error = new Error("Неверный email или пароль");
      authService.login.mockRejectedValue(error);

      await expect(controller.login(dto)).rejects.toThrow(error);
    });
  });
});
