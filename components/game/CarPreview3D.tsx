import { useId } from "react";
import { safeCarColor, safeCarModel, stickerLabel } from "@/lib/studentCustomization";
import type { CarModel } from "@/types/game";

type PreviewSize = "sm" | "md" | "lg";

type CarPreview3DProps = {
  color?: string | null;
  model?: string | null;
  sticker?: string | null;
  isCelebrating?: boolean;
  size?: PreviewSize;
  playerName?: string | null;
  celebration?: string | null;
};

const modelLabel: Record<CarModel, string> = {
  classic: "Clássico",
  formula: "Fórmula",
  kart: "Kart",
  future: "Futurista",
  futuristic: "Futurista",
  mini: "Turbo",
  turbo: "Turbo"
};

function modelShape(model: CarModel) {
  const normalized = model === "future" ? "futuristic" : model === "mini" ? "turbo" : model;

  if (normalized === "formula") {
    return {
      body: "M74 196 C98 158 162 137 280 144 C345 148 405 172 426 206 C370 230 185 232 74 196Z",
      top: "M205 120 C232 92 293 98 318 130 L294 158 L191 153 Z",
      hood: "M72 198 C104 166 161 152 222 149 L206 190 C158 195 111 199 72 198Z",
      side: "M205 189 C276 184 360 188 426 206 C394 235 238 240 91 208 Z",
      spoiler: true,
      intake: true,
      neon: false,
      wheelScale: 1.08
    };
  }

  if (normalized === "kart") {
    return {
      body: "M96 190 C125 166 198 160 298 166 C356 170 394 188 412 214 C338 240 174 238 96 190Z",
      top: "M216 128 C239 111 280 115 306 140 L286 163 L205 158 Z",
      hood: "M91 191 C127 173 180 166 231 167 L215 195 C160 200 118 199 91 191Z",
      side: "M210 193 C276 188 363 196 412 214 C376 241 205 242 105 207 Z",
      spoiler: false,
      intake: false,
      neon: false,
      wheelScale: 1.25
    };
  }

  if (normalized === "futuristic") {
    return {
      body: "M72 190 C115 145 220 126 318 142 C376 151 420 181 436 214 C352 238 164 238 72 190Z",
      top: "M208 108 C249 79 319 92 353 134 L319 164 L185 156 Z",
      hood: "M72 191 C112 157 171 141 230 141 L207 190 C151 196 104 197 72 191Z",
      side: "M207 189 C282 184 379 193 436 214 C392 241 223 243 91 205 Z",
      spoiler: true,
      intake: true,
      neon: true,
      wheelScale: 1.02
    };
  }

  if (normalized === "turbo") {
    return {
      body: "M76 190 C113 151 201 135 308 145 C378 152 421 180 438 214 C374 241 168 239 76 190Z",
      top: "M203 115 C236 92 299 98 330 135 L305 165 L190 158 Z",
      hood: "M76 191 C113 160 172 146 236 147 L212 191 C156 198 107 198 76 191Z",
      side: "M214 190 C290 184 385 193 438 214 C394 245 215 245 94 205 Z",
      spoiler: true,
      intake: true,
      neon: false,
      wheelScale: 1.1
    };
  }

  return {
    body: "M82 188 C122 151 205 137 303 148 C369 155 414 181 430 212 C359 238 169 238 82 188Z",
    top: "M207 118 C238 92 300 99 327 136 L301 164 L191 157 Z",
    hood: "M82 189 C118 160 174 148 232 148 L211 191 C158 197 112 197 82 189Z",
    side: "M211 190 C282 185 371 193 430 212 C388 240 219 242 98 205 Z",
    spoiler: false,
    intake: false,
    neon: false,
    wheelScale: 1
  };
}

export function CarPreview3D({ color, model, sticker, isCelebrating = false, size = "lg", playerName, celebration }: CarPreview3DProps) {
  const id = useId().replace(/:/g, "");
  const carColor = safeCarColor(color);
  const carModel = safeCarModel(model);
  const shape = modelShape(carModel);
  const heightClass = size === "sm" ? "min-h-56" : size === "md" ? "min-h-72" : "min-h-[22rem]";
  const label = modelLabel[carModel] ?? "Clássico";

  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] border-2 border-white/15 bg-green-950 p-5 text-white shadow-soft ${heightClass}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(250,204,21,.22),transparent_24%),radial-gradient(circle_at_50%_48%,rgba(85,201,107,.28),transparent_42%),linear-gradient(145deg,#052e16,#03170a_64%,#000)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute left-5 top-5 rounded-2xl border border-white/15 bg-white/10 px-4 py-2">
        <p className="text-[10px] font-black uppercase tracking-wide text-flagYellow">Garagem</p>
        <p className="text-sm font-black">{playerName || "Seu carrinho"}</p>
      </div>
      <div className="absolute right-5 top-5 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-right">
        <p className="text-[10px] font-black uppercase tracking-wide text-flagYellow">Modelo</p>
        <p className="text-sm font-black">{label}</p>
      </div>

      <div className="absolute inset-x-6 bottom-8 h-24 rounded-[50%] border-2 border-white/15 bg-white/10 shadow-[0_24px_60px_rgba(0,0,0,.45)] [transform:rotateX(66deg)]" />
      <div className="absolute inset-x-8 bottom-12 h-12 rounded-[50%] bg-black/40 blur-xl" />

      <svg viewBox="0 0 520 330" role="img" aria-label={`Carrinho ${label}`} className={`relative z-10 mx-auto mt-12 w-full max-w-[520px] ${isCelebrating ? "animate-car-boost" : "animate-car-idle"}`}>
        <defs>
          <linearGradient id={`${id}-paint`} x1="90" y1="120" x2="430" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".48" />
            <stop offset=".18" stopColor={carColor} />
            <stop offset=".68" stopColor={carColor} />
            <stop offset="1" stopColor="#06130a" stopOpacity=".36" />
          </linearGradient>
          <linearGradient id={`${id}-side`} x1="120" y1="160" x2="430" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={carColor} />
            <stop offset="1" stopColor="#06130a" stopOpacity=".6" />
          </linearGradient>
          <linearGradient id={`${id}-glass`} x1="200" y1="98" x2="340" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#e0fbff" />
            <stop offset=".55" stopColor="#4dd6ff" />
            <stop offset="1" stopColor="#0f3b56" />
          </linearGradient>
          <radialGradient id={`${id}-wheel`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f8fafc" />
            <stop offset=".24" stopColor="#94a3b8" />
            <stop offset=".28" stopColor="#0f172a" />
            <stop offset="1" stopColor="#020617" />
          </radialGradient>
          <filter id={`${id}-softShadow`} x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="14" stdDeviation="10" floodColor="#000000" floodOpacity=".38" />
          </filter>
        </defs>

        <g filter={`url(#${id}-softShadow)`} transform="rotate(-5 260 170)">
          {shape.spoiler ? (
            <g>
              <path d="M350 118 L445 94 L454 119 L356 145 Z" fill={carColor} stroke="#06130a" strokeWidth="10" strokeLinejoin="round" />
              <path d="M360 142 L378 176" stroke="#06130a" strokeWidth="10" strokeLinecap="round" />
            </g>
          ) : null}
          <path d={shape.body} fill={`url(#${id}-paint)`} stroke="#06130a" strokeWidth="11" strokeLinejoin="round" />
          <path d={shape.side} fill={`url(#${id}-side)`} stroke="#06130a" strokeWidth="8" strokeLinejoin="round" opacity=".96" />
          <path d={shape.hood} fill="rgba(255,255,255,.18)" stroke="#06130a" strokeWidth="7" strokeLinejoin="round" />
          <path d={shape.top} fill={`url(#${id}-glass)`} stroke="#06130a" strokeWidth="10" strokeLinejoin="round" />
          <path d="M215 126 C246 112 291 115 314 136" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="8" strokeLinecap="round" />
          {shape.intake ? <path d="M236 157 C256 148 294 151 314 164 L305 179 C282 172 258 171 239 178 Z" fill="#06130a" opacity=".72" /> : null}
          {shape.neon ? (
            <>
              <path d="M332 176 L405 199" stroke="#67e8f9" strokeWidth="7" strokeLinecap="round" />
              <path d="M116 184 L184 157" stroke="#86efac" strokeWidth="7" strokeLinecap="round" />
            </>
          ) : null}
          <g transform={`translate(126 225) scale(${shape.wheelScale})`} className={isCelebrating ? "animate-wheel-spin origin-center" : ""}>
            <ellipse cx="0" cy="0" rx="44" ry="38" fill={`url(#${id}-wheel)`} stroke="#06130a" strokeWidth="9" />
            <ellipse cx="0" cy="0" rx="17" ry="15" fill="#cbd5e1" stroke="#06130a" strokeWidth="5" />
            <path d="M0 -27 L0 27 M-28 0 L28 0" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" opacity=".75" />
          </g>
          <g transform={`translate(354 228) scale(${shape.wheelScale})`} className={isCelebrating ? "animate-wheel-spin origin-center" : ""}>
            <ellipse cx="0" cy="0" rx="50" ry="40" fill={`url(#${id}-wheel)`} stroke="#06130a" strokeWidth="10" />
            <ellipse cx="0" cy="0" rx="19" ry="15" fill="#cbd5e1" stroke="#06130a" strokeWidth="5" />
            <path d="M0 -29 L0 29 M-31 0 L31 0" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" opacity=".75" />
          </g>
          <path d="M406 198 C424 200 440 207 452 218" stroke="#fde68a" strokeWidth="12" strokeLinecap="round" />
          <path d="M91 186 C105 174 119 168 139 162" stroke="#fef3c7" strokeWidth="10" strokeLinecap="round" />
          <rect x="226" y="171" width="58" height="34" rx="14" fill="#ffffff" stroke="#06130a" strokeWidth="7" transform="rotate(-5 255 188)" />
          <text x="255" y="196" textAnchor="middle" fontSize="21" fontWeight="900" fill="#06130a">{stickerLabel(sticker)}</text>
          <path d="M122 174 C177 144 270 134 347 149" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="9" strokeLinecap="round" />
        </g>
      </svg>

      <div className="relative z-10 mt-2 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase text-white/80">Cor ativa</span>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase text-white/80">Adesivo {stickerLabel(sticker)}</span>
        {isCelebrating ? <span className="rounded-full bg-flagYellow px-3 py-1.5 text-xs font-black uppercase text-green-950">{celebration ?? "🎉"} Boost</span> : null}
      </div>
    </div>
  );
}
