import { IsHexColor, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}
