"use client";

import { useState } from "react";
import { CarPreview3D } from "@/components/CarPreview3D";
import { GameButton } from "@/components/GameButton";
import { GameInput } from "@/components/GameInput";
import { FixedBottomActions } from "@/components/layout/FixedBottomActions";
import { ScrollAreaContent } from "@/components/layout/ScrollAreaContent";
import { carColors, carModels, celebrations, stickers, studentThemes } from "@/lib/studentCustomization";

export type StudentCustomizationValue = {
  name: string;
  carColor: string;
  carModel: string;
  carSticker: string;
  celebrationEmoji: string;
  studentTheme: string;
};

export type StudentCustomizationStepperProps = {
  value: StudentCustomizationValue;
  onChange: (value: StudentCustomizationValue) => void;
  onSubmit: () => void;
  loading: boolean;
  message?: string;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  loadingLabel?: string;
  lockName?: boolean;
  locked?: boolean;
  onCancel?: () => void;
};

const steps = ["Seu nome", "Carrinho", "Cor", "Adesivo", "Confirmar"];
const pilotSuggestion = "Piloto 123";

export function StudentCustomizationStepper({
  value,
  onChange,
  onSubmit,
  loading,
  message,
  title = "Monte seu carro",
  subtitle = "Escolha seu estilo antes de entrar na corrida.",
  submitLabel = "Salvar e entrar na corrida",
  loadingLabel = "Salvando...",
  lockName = false,
  locked = false,
  onCancel
}: StudentCustomizationStepperProps) {
  const [step, setStep] = useState(lockName ? 1 : 0);
  const set = (patch: Partial<StudentCustomizationValue>) => onChange({ ...value, ...patch });
  const selectedModel = carModels.find((item) => item.value === value.carModel)?.name ?? "Clássico";
  const selectedColor = carColors.find((item) => item.value === value.carColor)?.name ?? "Verde IF";
  const selectedSticker = stickers.find((item) => item.value === value.carSticker)?.name ?? "Estrela";
  const selectedTheme = studentThemes.find((item) => item.value === value.studentTheme)?.name ?? "IF Verde";
  const currentStep = steps[step];
  const canContinueFromName = lockName || value.name.trim().length >= 2;

  function nextStep() {
    if (step === 0 && !canContinueFromName) {
      set({ name: pilotSuggestion });
      return;
    }
    setStep((current) => Math.min(steps.length - 1, current + 1));
  }

  return (
    <section className="mx-auto grid h-full min-h-0 w-full max-w-[1280px] flex-1 gap-3 lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="min-h-0 rounded-[1.7rem] border-2 border-white/15 bg-green-950/78 p-3 text-center text-white shadow-soft backdrop-blur sm:p-4">
        <div className="flex items-start justify-between gap-3 text-left">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-flagYellow">Garagem do aluno</p>
            <h1 className="game-title mt-1 text-2xl font-black leading-none sm:text-4xl">{title}</h1>
            <p className="mt-2 hidden max-w-xl text-sm font-semibold text-white/75 sm:block">{subtitle}</p>
          </div>
          <span className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-black uppercase text-white/80">
            {step + 1}/{steps.length}
          </span>
        </div>
        <div className="mt-3 h-[min(32vh,17rem)] min-h-52 lg:h-[min(44vh,23rem)] lg:min-h-64">
          <CarPreview3D
            color={value.carColor}
            model={value.carModel}
            sticker={value.carSticker}
            celebration={value.celebrationEmoji}
            playerName={value.name || "Seu carrinho"}
            size="md"
          />
        </div>
      </aside>

      <div className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] border-2 border-green-950/15 bg-white text-green-950 shadow-soft">
        <div className="border-b border-green-950/10 bg-green-50 px-5 py-4">
          <p className="text-xs font-black uppercase tracking-wide text-ifGreen">Etapa {step + 1}</p>
          <h2 className="text-2xl font-black">{currentStep}</h2>
          {locked ? <p className="mt-2 rounded-2xl bg-flagYellow/35 p-3 text-sm font-black text-green-950">A corrida já começou. Seu carrinho foi travado para esta partida.</p> : null}
        </div>

        <ScrollAreaContent className="px-5 py-4">
          {step === 0 ? (
            <div className="grid gap-4">
              <label className="font-black" htmlFor="student-name">
                Nome ou apelido
              </label>
              <GameInput
                id="student-name"
                value={value.name}
                onChange={(event) => set({ name: event.target.value })}
                disabled={lockName || locked}
                maxLength={24}
                placeholder={pilotSuggestion}
                className="text-xl normal-case tracking-normal"
              />
              {!canContinueFromName ? (
                <p className="rounded-2xl bg-yellow-50 p-3 font-bold text-green-950">Digite seu nome ou toque em continuar para usar “{pilotSuggestion}”.</p>
              ) : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {carModels.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => set({ carModel: item.value })}
                  disabled={locked}
                  className={`rounded-[1.35rem] border-4 px-4 py-4 text-left font-black transition ${
                    value.carModel === item.value
                      ? "border-green-950 bg-flagYellow text-green-950 shadow-[0_5px_0_rgba(0,0,0,.22)]"
                      : "border-green-950/15 bg-green-50 text-green-950 hover:border-green-950/45"
                  }`}
                >
                  <span className="block text-lg">{item.name}</span>
                  <span className="text-xs uppercase text-green-900/60">Modelo da corrida</span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {carColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => set({ carColor: color.value })}
                  disabled={locked}
                  className={`flex min-h-20 items-center gap-3 rounded-[1.35rem] border-4 bg-white px-3 py-3 text-left font-black transition ${
                    value.carColor === color.value ? "border-green-950 shadow-[0_5px_0_rgba(0,0,0,.22)]" : "border-green-950/15"
                  }`}
                >
                  <span className="h-11 w-11 rounded-full border-4 border-green-950" style={{ backgroundColor: color.value }} />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-5">
              <div>
                <p className="font-black">Adesivo</p>
                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {stickers.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => set({ carSticker: item.value })}
                      disabled={locked}
                      className={`h-14 rounded-2xl border-4 text-lg font-black ${
                        value.carSticker === item.value ? "border-green-950 bg-green-100" : "border-green-950/15 bg-white"
                      }`}
                      aria-label={item.name}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-black">Comemoração</p>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {celebrations.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => set({ celebrationEmoji: item })}
                      disabled={locked}
                      className={`h-14 rounded-2xl border-4 text-2xl ${
                        value.celebrationEmoji === item ? "border-green-950 bg-flagYellow" : "border-green-950/15 bg-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-black">Tema do painel</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {studentThemes.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => set({ studentTheme: item.value })}
                      disabled={locked}
                      className={`rounded-2xl border-4 px-4 py-3 text-left font-black ${
                        value.studentTheme === item.value ? "border-green-950 bg-green-100" : "border-green-950/15 bg-white"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-3">
              {[
                ["Nome", value.name || pilotSuggestion],
                ["Modelo", selectedModel],
                ["Cor", selectedColor],
                ["Adesivo", selectedSticker],
                ["Comemoração", value.celebrationEmoji],
                ["Tema", selectedTheme]
              ].map(([label, content]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-2xl bg-green-50 px-4 py-3">
                  <span className="text-sm font-black uppercase text-green-900/60">{label}</span>
                  <span className="text-right text-lg font-black">{content}</span>
                </div>
              ))}
            </div>
          ) : null}

          {message ? <p className="mt-4 rounded-2xl bg-red-50 p-3 font-bold text-raceRed">{message}</p> : null}
        </ScrollAreaContent>

        <FixedBottomActions>
          <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto]">
            {onCancel ? (
              <GameButton type="button" variant="white" onClick={onCancel} disabled={loading}>
                Fechar
              </GameButton>
            ) : null}
            <GameButton type="button" variant="white" onClick={() => setStep((current) => Math.max(lockName ? 1 : 0, current - 1))} disabled={loading || step === (lockName ? 1 : 0)}>
              Voltar
            </GameButton>
            {step < steps.length - 1 ? (
              <GameButton type="button" icon="➜" onClick={nextStep} disabled={loading}>
                Continuar
              </GameButton>
            ) : (
              <GameButton type="button" icon="🏁" onClick={onSubmit} disabled={loading || locked || value.name.trim().length < 2}>
                {loading ? loadingLabel : submitLabel}
              </GameButton>
            )}
          </div>
        </FixedBottomActions>
      </div>
    </section>
  );
}
