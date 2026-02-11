import { heroTexts as enTexts } from "../content/en";
import { heroTexts as ptTexts } from "../content/pt";

type HeroProps = {
  lang: "en" | "pt";
};


export default function Hero({ lang }: HeroProps) {
  const texts = lang === "en" ? enTexts : ptTexts;
  return (
   <div className="flex flex-col pt-16 items-center justify-center min-h-screen max-h-screen overflow-y-auto bg-black">
  <pre className="text-green-400 font-mono text-base sm:text-lg leading-none mb-4 mt-2 whitespace-pre text-center">
    {texts.welcome}
  </pre>
  <h1 className="text-green-400 font-mono text-3xl font-bold mb-1">
    {texts.name}
  </h1>
  <p className="text-green-300 font-mono text-xl mb-2">
    {texts.title}
  </p>
  <p className="text-green-200 font-mono text-lg max-w-3xl text-center">
    {texts.intro}
  </p>
</div>
  );
}