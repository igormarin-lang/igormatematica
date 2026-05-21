"use client";

import { Button } from "@/components/Button";
import { CarPreview3D } from "@/components/CarPreview3D";
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
    <div className="grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-white shadow-soft ring-1 ring-slate-200 lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="speed-lines p-5 text-white sm:p-8">
        <p className="text-sm font-black uppercase text-flagYellow">Garagem do aluno</p>
        <h1 className="mt-2 text-5xl font-black leading-none">Monte seu carro</h1>
        <p className="mt-4 font-semibold text-white/75">Escolha cor, modelo, adesivo, emoji e tema antes de entrar na corrida.</p>
        <div className="mt-6">
          <CarPreview3D color={value.carColor} model={value.carModel} sticker={value.carSticker} celebration={value.celebrationEmoji} />
        </div>
      </aside>

      <section className="grid gap-5 p-5 sm:p-8">
        <div>
          <label className="font-black" htmlFor="student-name">Nome ou apelido</label>
          <input
            id="student-name"
            value={value.name}
            onChange={(event) => set({ name: event.target.value })}
            maxLength={24}
            placeholder="Ex.: Ana"
            className="mt-2 h-16 w-full rounded-2xl border-2 border-slate-200 px-4 text-xl font-bold outline-none focus:border-ifGreen"
          />
        </div>

        <div>
          <p className="font-black">Cor do carrinho</p>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {carColors.map((color) => (
              <button
                key={color.value}
                type="button"
                aria-label={color.name}
                onClick={() => set({ carColor: color.value })}
                className={`h-12 rounded-2xl border-4 ${value.carColor === color.value ? "border-slate-950" : "border-white"} shadow-sm ring-1 ring-slate-200`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-black" htmlFor="car-model">Modelo</label>
            <select id="car-model" value={value.carModel} onChange={(event) => set({ carModel: event.target.value })} className="mt-2 h-14 w-full rounded-2xl border-2 border-slate-200 px-3 font-bold">
              {carModels.map((item) => <option key={item.value} value={item.value}>{item.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-black" htmlFor="car-sticker">Adesivo</label>
            <select id="car-sticker" value={value.carSticker} onChange={(event) => set({ carSticker: event.target.value })} className="mt-2 h-14 w-full rounded-2xl border-2 border-slate-200 px-3 font-bold">
              {stickers.map((item) => <option key={item.value} value={item.value}>{item.label} {item.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-black" htmlFor="celebration">Comemoração</label>
            <select id="celebration" value={value.celebrationEmoji} onChange={(event) => set({ celebrationEmoji: event.target.value })} className="mt-2 h-14 w-full rounded-2xl border-2 border-slate-200 px-3 font-bold">
              {celebrations.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="font-black" htmlFor="student-theme">Tema</label>
            <select id="student-theme" value={value.studentTheme} onChange={(event) => set({ studentTheme: event.target.value })} className="mt-2 h-14 w-full rounded-2xl border-2 border-slate-200 px-3 font-bold">
              {studentThemes.map((item) => <option key={item.value} value={item.value}>{item.name}</option>)}
            </select>
          </div>
        </div>

        <Button className="min-h-16 w-full text-lg" type="button" onClick={onSubmit} disabled={loading || value.name.trim().length < 2}>
          {loading ? "Entrando..." : "Entrar na corrida"}
        </Button>
        {message ? <p className="rounded-2xl bg-red-50 p-3 font-bold text-raceRed">{message}</p> : null}
      </section>
    </div>
  );
}

