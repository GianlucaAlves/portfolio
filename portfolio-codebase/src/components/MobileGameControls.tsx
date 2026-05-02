type ControlAction = {
  key: string;
  label: string;
  accent?: "primary" | "secondary" | "danger";
};

type MobileGameControlsProps = {
  directional?: boolean;
  actions?: ControlAction[];
  className?: string;
};

function dispatchKey(key: string) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

function pressKey(key: string) {
  return (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatchKey(key);
  };
}

function actionClassName(accent: ControlAction["accent"]) {
  if (accent === "danger") {
    return "border-rose-400/40 bg-rose-950/20 text-rose-200";
  }

  if (accent === "primary") {
    return "border-green-300/40 bg-green-900/30 text-green-100";
  }

  return "border-green-500/30 bg-black/70 text-green-300";
}

export default function MobileGameControls({
  directional = true,
  actions = [],
  className = "",
}: MobileGameControlsProps) {
  return (
    <div className={`w-full md:hidden ${className}`}>
      <div className="rounded-xl border border-green-500/20 bg-black/80 p-3 shadow-[0_0_16px_rgba(0,255,65,0.08)]">
        <div className="flex items-end justify-between gap-3">
          {directional ? (
            <div className="grid grid-cols-3 gap-2">
              <div />
              <button
                type="button"
                onPointerDown={pressKey("ArrowUp")}
                className="h-11 w-11 rounded-lg border border-green-500/30 bg-black/70 text-green-200"
              >
                ↑
              </button>
              <div />
              <button
                type="button"
                onPointerDown={pressKey("ArrowLeft")}
                className="h-11 w-11 rounded-lg border border-green-500/30 bg-black/70 text-green-200"
              >
                ←
              </button>
              <button
                type="button"
                onPointerDown={pressKey("ArrowDown")}
                className="h-11 w-11 rounded-lg border border-green-500/30 bg-black/70 text-green-200"
              >
                ↓
              </button>
              <button
                type="button"
                onPointerDown={pressKey("ArrowRight")}
                className="h-11 w-11 rounded-lg border border-green-500/30 bg-black/70 text-green-200"
              >
                →
              </button>
            </div>
          ) : (
            <div />
          )}

          <div className="flex flex-wrap justify-end gap-2">
            {actions.map((action) => (
              <button
                key={`${action.key}-${action.label}`}
                type="button"
                onPointerDown={pressKey(action.key)}
                className={`min-w-14 rounded-lg border px-3 py-2 text-xs font-semibold ${actionClassName(
                  action.accent,
                )}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
