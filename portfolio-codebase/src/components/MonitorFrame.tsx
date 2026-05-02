import type { ReactNode } from "react";

type MonitorFrameProps = {
  children: ReactNode;
  powerOn: boolean;
  screenOpacity: number;
};

function Dial() {
  return (
    <span className="w-4.5 h-4.5 rounded-full bg-linear-to-b from-[#c8b890] to-[#99885e] border border-[#7d6b45] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.35)]" />
  );
}

export default function MonitorFrame({
  children,
  powerOn,
  screenOpacity,
}: MonitorFrameProps) {
  return (
    <>
      <div className="block md:hidden w-full h-screen bg-black overflow-y-auto">
        <div className="w-full min-h-full">{children}</div>
      </div>

      <div className="hidden md:flex w-full h-screen bg-zinc-950 items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="relative w-[98vw] max-w-[calc(95vh*1.65)] h-[95vh] rounded-lg bg-[linear-gradient(160deg,#e5d6b8_0%,#d7c7a3_32%,#cbb88f_68%,#bea97b_100%)] shadow-[inset_2px_2px_0px_rgba(255,255,255,0.45),inset_-2px_-2px_0px_rgba(0,0,0,0.22),0_28px_80px_rgba(0,0,0,0.92)]">
            <div className="absolute inset-3 rounded-md shadow-[inset_1px_1px_0px_rgba(255,255,255,0.25),inset_-1px_-1px_0px_rgba(120,100,60,0.25)]" />

            <div className="relative h-full flex flex-col px-8 pt-7 pb-0">
              <div className="flex-1 min-h-0 rounded-md bg-transparent">
                <div className="h-full rounded-sm border-[6px] border-[#8d7a56] bg-[linear-gradient(180deg,#6c6044_0%,#857553_100%)] shadow-[inset_4px_4px_12px_rgba(0,0,0,0.9),inset_-2px_-2px_8px_rgba(0,0,0,0.6)] p-2.5">
                  <div
                    className="relative h-full rounded-sm bg-black overflow-y-auto overflow-x-hidden shadow-[inset_0_0_36px_rgba(0,0,0,0.92),0_0_18px_rgba(80,255,120,0.08)] transition-opacity duration-80"
                    style={{ opacity: screenOpacity }}
                  >
                    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-sm">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.55)_100%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
                      <div className="absolute inset-0 opacity-100 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(0,0,0,0.06)_3px,rgba(0,0,0,0.06)_4px)]" />
                    </div>
                    <div className="relative z-20 max-w-5xl mx-auto w-full px-8 py-6">
                      {children}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 h-16 shrink-0 rounded-b-lg bg-[linear-gradient(180deg,#c8b894_0%,#b7a477_100%)] border-t border-[#ead8af] shadow-[inset_0_1px_0px_rgba(255,255,255,0.25)] px-6">
                <div className="h-full grid grid-cols-[1fr_auto_1fr] items-center">
                  <div />
                  <div className="justify-self-center rounded-sm border border-[#988560] bg-[linear-gradient(180deg,#cdbd98_0%,#b19d71_100%)] px-4 py-1 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.2)]">
                    <span className="text-[#786743] text-[10px] tracking-widest font-mono">
                      GL-2049
                    </span>
                  </div>
                  <div className="justify-self-end flex items-center gap-3">
                    <span
                      className={
                        powerOn
                          ? "w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(0,255,65,0.9)] animate-pulse"
                          : "w-2 h-2 rounded-full bg-green-900"
                      }
                    />
                    <Dial />
                    <Dial />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-28 h-4 bg-[linear-gradient(180deg,#c5b48c_0%,#a99566_100%)] shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
          <div className="w-64 h-5 rounded-sm bg-[linear-gradient(180deg,#c5b48c_0%,#9f8b5c_100%)] shadow-[0_6px_14px_rgba(0,0,0,0.45)]" />
        </div>
      </div>
    </>
  );
}
