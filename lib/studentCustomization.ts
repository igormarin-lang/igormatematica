import type { CarModel, StudentTheme } from "@/types/game";

export const carColors = [
  { name: "Verde IF", value: "#2f9e41" },
  { name: "Azul", value: "#2563eb" },
  { name: "Roxo", value: "#7c3aed" },
  { name: "Amarelo", value: "#facc15" },
  { name: "Laranja", value: "#f97316" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Vermelho", value: "#cd191e" }
];

export const carModels: Array<{ name: string; value: CarModel }> = [
  { name: "Clássico", value: "classic" },
  { name: "Fórmula", value: "formula" },
  { name: "Kart", value: "kart" },
  { name: "Futurista", value: "future" },
  { name: "Mini turbo", value: "mini" }
];

export const stickers = [
  { name: "Estrela", value: "star", label: "⭐" },
  { name: "Raio", value: "bolt", label: "⚡" },
  { name: "Foguete", value: "rocket", label: "🚀" },
  { name: "Troféu", value: "trophy", label: "🏆" },
  { name: "Bandeira", value: "flag", label: "🏁" },
  { name: "Número 1", value: "one", label: "1" },
  { name: "IF", value: "if", label: "IF" },
  { name: "Soma +", value: "plus", label: "+" }
];

export const celebrations = ["🎉", "🚀", "🏆", "🔥", "⭐", "💚"];

export const studentThemes: Array<{ name: string; value: StudentTheme }> = [
  { name: "IF Verde", value: "if-green" },
  { name: "Neon corrida", value: "neon" },
  { name: "Sala de aula", value: "classroom" },
  { name: "Arcade", value: "arcade" },
  { name: "Minimal", value: "minimal" }
];

export function stickerLabel(value?: string | null) {
  return stickers.find((item) => item.value === value)?.label ?? "⭐";
}

export function safeCarColor(value?: string | null) {
  return carColors.some((item) => item.value === value) ? value! : "#2f9e41";
}

export function safeCarModel(value?: string | null): CarModel {
  return carModels.some((item) => item.value === value) ? (value as CarModel) : "classic";
}

export function safeCelebration(value?: string | null) {
  return celebrations.includes(value ?? "") ? value! : "🎉";
}

export function safeStudentTheme(value?: string | null): StudentTheme {
  return studentThemes.some((item) => item.value === value) ? (value as StudentTheme) : "if-green";
}

