import { IsEnum } from "class-validator";

export enum SubscriptionPlanDto {
  FREE = "FREE",
  PREMIUM = "PREMIUM",
}

export class ChangePlanDto {
  @IsEnum(SubscriptionPlanDto)
  plan: SubscriptionPlanDto;
}