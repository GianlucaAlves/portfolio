import { useState } from "react";
import Hero from './components/Hero';
import Terminal from './components/Terminal';
import BootScreen from "./components/BootScreen";

function App() {
  const [lang, setLang] = useState<"en" | "pt">("en");
  const [booted, setBooted] = useState(false);
  
  return (
    <>
      {!booted && <BootScreen onFinish={() => setBooted(true)} />}
      {booted && (
        <div className="bg-black min-h-screen">
          <Hero lang={lang} />
          <Terminal lang={lang} setLang={setLang} />
        </div>
      )}
    </>
  );
}

export default App;