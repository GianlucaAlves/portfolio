import { heroTexts as enTexts } from "../content/en";
import { heroTexts as ptTexts } from "../content/pt";

type HeroProps = {
  lang: "en" | "pt";
};

export default function Hero({ lang }: HeroProps) {
  const texts = lang === "en" ? enTexts : ptTexts;
  return (
    <div className="flex flex-col items-center justify-center w-full py-4 sm:py-6">
      <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm leading-none mb-3 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">
        {texts.welcome}
      </pre>
      <h1 className="text-green-400 font-mono text-lg sm:text-2xl md:text-3xl font-bold mb-1 text-center wrap-break-word max-w-full">
        {texts.name}
      </h1>
      <p className="text-green-300 font-mono text-sm sm:text-base mb-2 text-center wrap-break-word max-w-full">
        {texts.title}
      </p>
      <p className="text-green-200 font-mono text-xs sm:text-sm text-center w-full">
        {texts.intro}
      </p>
    </div>
  );
}
