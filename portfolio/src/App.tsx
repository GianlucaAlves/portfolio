import { useState } from "react";
import Hero from './components/Hero';
import Terminal from './components/Terminal';


function App() {
  const [lang, setLang] = useState<"en" | "pt">("en");
  return (
    <div className="bg-black min-h-screen">
      <Hero lang={lang} />
      <Terminal lang={lang} setLang={setLang} />
    </div>
  );
}

export default App;