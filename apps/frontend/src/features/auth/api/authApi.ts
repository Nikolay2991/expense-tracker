import type { AuthResponse, LoginDto, RegisterDto } from "@expense-tracker/shared";
import { apiFetch } from "@/shared/api/client";

export function registerRequest(dto: RegisterDto): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function loginRequest(dto: LoginDto): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}
