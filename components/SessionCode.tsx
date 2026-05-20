export function SessionCode({ code }: { code: string }) {
  return (
    <div className="rounded-2xl border-4 border-dashed border-raceRed bg-red-50 px-6 py-4 text-center">
      <p className="text-xs font-black uppercase text-raceRed">Código da sessão</p>
      <strong className="block text-5xl font-black tracking-widest text-raceRed sm:text-6xl">{code}</strong>
    </div>
  );
}
