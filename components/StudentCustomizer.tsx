"use client";

import {
  StudentCustomizationStepper,
  type StudentCustomizationStepperProps,
  type StudentCustomizationValue
} from "@/components/game/StudentCustomizationStepper";

export type StudentCustomization = StudentCustomizationValue;

export function StudentCustomizer(props: StudentCustomizationStepperProps) {
  return <StudentCustomizationStepper {...props} />;
}
