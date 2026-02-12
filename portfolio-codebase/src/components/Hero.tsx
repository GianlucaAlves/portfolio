import { heroTexts as enTexts } from "../content/en";
import { heroTexts as ptTexts } from "../content/pt";

type HeroProps = {
  lang: "en" | "pt";
};

export default function Hero({ lang }: HeroProps) {
  const texts = lang === "en" ? enTexts : ptTexts;
  return (
    <div className="flex flex-col pt-12 sm:pt-16 items-center justify-center min-h-screen max-h-screen overflow-y-auto bg-black px-2 sm:px-4 w-full">
      <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm lg:text-base leading-none mb-4 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">
        {texts.welcome}
      </pre>
      <h1 className="text-green-400 font-mono text-xl sm:text-3xl md:text-5xl font-bold mb-1 text-center wrap-break-word max-w-full">
        {texts.name}
      </h1>
      <p className="text-green-300 font-mono text-base sm:text-xl mb-2 text-center wrap-break-word max-w-full">
        {texts.title}
      </p>
      <p className="text-green-200 font-mono text-sm sm:text-lg max-w-xs sm:max-w-2xl text-center">
        {texts.intro}
      </p>
    </div>
  );
}
