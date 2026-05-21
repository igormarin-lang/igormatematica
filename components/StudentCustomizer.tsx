"use client";

import { CarPreview3D } from "@/components/CarPreview3D";
import { GameButton } from "@/components/GameButton";
import { GameInput } from "@/components/GameInput";
import { GamePanel } from "@/components/GamePanel";
import { StudentHeroCar } from "@/components/StudentHeroCar";
import { carColors, carModels, celebrations, stickers, studentThemes } from "@/lib/studentCustomization";

export type StudentCustomization = {
  name: string;
  carColor: string;
  carModel: string;
  carSticker: string;
  celebrationEmoji: string;
  studentTheme: string;
};

export function StudentCustomizer({
  value,
  onChange,
  onSubmit,
  loading,
  message
}: {
  value: StudentCustomization;
  onChange: (value: StudentCustomization) => void;
  onSubmit: () => void;
  loading: boolean;
  message?: string;
}) {
  const set = (patch: Partial<StudentCustomization>) => onChange({ ...value, ...patch });

  return (
    <div className="grid w-full max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="rounded-[2.4rem] border-2 border-white/15 bg-green-950/72 p-5 text-center text-white shadow-soft backdrop-blur sm:p-8">
        <p className="text-sm font-black uppercase text-flagYellow">Garagem do aluno</p>
        <h1 className="game-title mt-2 text-5xl font-black leading-none sm:text-6xl">Monte seu carro</h1>
        <p className="mx-auto mt-4 max-w-md font-semibold text-white/75">Escolha seu estilo antes de entrar na corrida.</p>
        <div className="mt-7 lg:hidden">
          <StudentHeroCar color={value.carColor} model={value.carModel} sticker={value.carSticker} editable />
        </div>
        <div className="mt-6 hidden lg:block">
          <CarPreview3D
            color={value.carColor}
            model={value.carModel}
            sticker={value.carSticker}
            celebration={value.celebrationEmoji}
            playerName={value.name || "Seu carrinho"}
          />
        </div>
      </aside>

      <GamePanel className="grid gap-5">
        <div>
          <label className="font-black" htmlFor="student-name">
            Nome ou apelido
          </label>
          <GameInput
            id="student-name"
            value={value.name}
            onChange={(event) => set({ name: event.target.value })}
            maxLength={24}
            placeholder="Ex.: Ana"
            className="mt-2 text-xl normal-case tracking-normal"
          />
        </div>

        <div>
          <p className="font-black">Cor do carrinho</p>
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-8">
            {carColors.map((color) => (
              <button
                key={color.value}
                type="button"
                aria-label={color.name}
                onClick={() => set({ carColor: color.value })}
                className={`h-14 rounded-[1.25rem] border-4 transition hover:-translate-y-0.5 ${
                  value.carColor === color.value
                    ? "border-green-950 shadow-[0_5px_0_rgba(0,0,0,.25)]"
                    : "border-white shadow-sm ring-1 ring-slate-200"
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="font-black">Modelo do carrinho</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {carModels.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => set({ carModel: item.value })}
                className={`rounded-[1.25rem] border-4 px-3 py-3 text-sm font-black transition ${
                  value.carModel === item.value
                    ? "border-green-950 bg-flagYellow text-green-950 shadow-[0_5px_0_rgba(0,0,0,.22)]"
                    : "border-green-950/20 bg-green-50 text-green-950"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <p className="font-black">Adesivo</p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {stickers.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => set({ carSticker: item.value })}
                  className={`h-12 rounded-2xl border-2 text-lg font-black ${
                    value.carSticker === item.value ? "border-green-950 bg-green-100" : "border-slate-200 bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-black">Comemoração</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {celebrations.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => set({ celebrationEmoji: item })}
                  className={`h-12 rounded-2xl border-2 text-xl ${
                    value.celebrationEmoji === item ? "border-green-950 bg-flagYellow" : "border-slate-200 bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-black">Tema</p>
            <div className="mt-2 grid gap-2">
              {studentThemes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => set({ studentTheme: item.value })}
                  className={`rounded-2xl border-2 px-3 py-2 text-left text-sm font-black ${
                    value.studentTheme === item.value ? "border-green-950 bg-green-100" : "border-slate-200 bg-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <GameButton className="min-h-16 w-full text-lg" type="button" icon="🏁" onClick={onSubmit} disabled={loading || value.name.trim().length < 2}>
          {loading ? "Entrando..." : "Entrar na corrida"}
        </GameButton>
        {message ? <p className="rounded-2xl bg-red-50 p-3 font-bold text-raceRed">{message}</p> : null}
      </GamePanel>
    </div>
  );
}
