import { Car2D } from "@/components/Car2D";

export function GameLoadingScreen({ text = "Preparando a pista..." }: { text?: string }) {
  return (
    <div className="grid h-full min-h-64 place-items-center rounded-[2rem] border-2 border-white/15 bg-green-950/72 p-6 text-center text-white">
      <div className="w-full max-w-sm">
        <div className="relative mx-auto h-24 overflow-hidden rounded-[1.5rem] bg-asphalt ring-2 ring-white/15">
          <div className="absolute inset-x-0 top-1/2 h-1 border-t-4 border-dashed border-white/35" />
          <span className="game-loading-car absolute bottom-5 left-5">
            <Car2D color="#2f9e41" model="turbo" sticker="if" className="scale-125" />
          </span>
        </div>
        <p className="mt-5 text-xl font-black">{text}</p>
        <div className="mt-4 h-4 overflow-hidden rounded-full border-2 border-green-950 bg-white">
          <div className="game-loading-bar h-full w-1/2 rounded-full bg-flagYellow" />
        </div>
      </div>
    </div>
  );
}

