import type { CarModel, Player, StudentTheme } from "@/types/game";

export type StudentCustomizationData = {
  name: string;
  carColor: string;
  carModel: string;
  carSticker: string;
  celebrationEmoji: string;
  studentTheme: string;
};

export const defaultStudentCustomization: StudentCustomizationData = {
  name: "",
  carColor: "#2f9e41",
  carModel: "classic",
  carSticker: "star",
  celebrationEmoji: "🎉",
  studentTheme: "if-green"
};

export const carColors = [
  { name: "Verde IF", value: "#2f9e41" },
  { name: "Azul", value: "#2563eb" },
  { name: "Roxo", value: "#7c3aed" },
  { name: "Amarelo", value: "#facc15" },
  { name: "Laranja", value: "#f97316" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Vermelho IF", value: "#cd191e" }
];

export const carModels: Array<{ name: string; value: CarModel }> = [
  { name: "Clássico", value: "classic" },
  { name: "Fórmula", value: "formula" },
  { name: "Kart", value: "kart" },
  { name: "Futurista", value: "futuristic" },
  { name: "Turbo", value: "turbo" }
];

export const stickers = [
  { name: "Estrela", value: "star", label: "⭐" },
  { name: "Raio", value: "bolt", label: "⚡" },
  { name: "Foguete", value: "rocket", label: "🚀" },
  { name: "Troféu", value: "trophy", label: "🏆" },
  { name: "Bandeira", value: "flag", label: "🏁" },
  { name: "Número 1", value: "one", label: "1º" },
  { name: "IF", value: "if", label: "IF" },
  { name: "Matemática", value: "plus", label: "➕" }
];

export const celebrations = ["🎉", "🚀", "🏆", "🔥", "⭐", "💚"];

export const studentThemes: Array<{ name: string; value: StudentTheme }> = [
  { name: "IF Verde", value: "if-green" },
  { name: "Arcade", value: "arcade" },
  { name: "Neon", value: "neon" },
  { name: "Sala de aula", value: "classroom" },
  { name: "Corrida", value: "minimal" }
];

export function stickerLabel(value?: string | null) {
  return stickers.find((item) => item.value === value)?.label ?? "⭐";
}

export function safeCarColor(value?: string | null) {
  return carColors.some((item) => item.value === value) ? value! : defaultStudentCustomization.carColor;
}

export function safeCarModel(value?: string | null): CarModel {
  if (value === "future") return "futuristic";
  if (value === "mini") return "turbo";
  return carModels.some((item) => item.value === value) ? (value as CarModel) : "classic";
}

export function safeSticker(value?: string | null) {
  return stickers.some((item) => item.value === value) ? value! : defaultStudentCustomization.carSticker;
}

export function safeCelebration(value?: string | null) {
  return celebrations.includes(value ?? "") ? value! : defaultStudentCustomization.celebrationEmoji;
}

export function safeStudentTheme(value?: string | null): StudentTheme {
  return studentThemes.some((item) => item.value === value) ? (value as StudentTheme) : "if-green";
}

export function normalizeStudentCustomization(
  value: Partial<StudentCustomizationData>,
  fallback: StudentCustomizationData = defaultStudentCustomization
): StudentCustomizationData {
  return {
    name: String(value.name ?? fallback.name ?? "").trim().replace(/\s+/g, " ").slice(0, 24),
    carColor: safeCarColor(value.carColor ?? fallback.carColor),
    carModel: safeCarModel(value.carModel ?? fallback.carModel),
    carSticker: safeSticker(value.carSticker ?? fallback.carSticker),
    celebrationEmoji: safeCelebration(value.celebrationEmoji ?? fallback.celebrationEmoji),
    studentTheme: safeStudentTheme(value.studentTheme ?? fallback.studentTheme)
  };
}

export function playerToStudentCustomization(player: Player, fallback: StudentCustomizationData = defaultStudentCustomization): StudentCustomizationData {
  return normalizeStudentCustomization(
    {
      name: player.name,
      carColor: player.car_color ?? undefined,
      carModel: String(player.car_model ?? ""),
      carSticker: player.car_sticker ?? undefined,
      celebrationEmoji: player.celebration_emoji ?? undefined,
      studentTheme: String(player.student_theme ?? "")
    },
    fallback
  );
}

export function toPlayerColumns(value: Partial<StudentCustomizationData>) {
  const normalized = normalizeStudentCustomization(value);
  return {
    car_color: normalized.carColor,
    car_model: normalized.carModel,
    car_sticker: normalized.carSticker,
    celebration_emoji: normalized.celebrationEmoji,
    student_theme: normalized.studentTheme
  };
}
