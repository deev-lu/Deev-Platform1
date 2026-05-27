import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Hero from "./components/Hero";
import ValueProposition from "./components/ValueProposition";
import ProjectBuilder from "./components/ProjectBuilder";
import DigitalMarketing from "./components/DigitalMarketing";
import Portfolio from "./components/Portfolio";
import AIShowcase from "./components/AIShowcase";
import Process from "./components/Process";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ClientLogos from "./components/ClientLogos";
import Legal from "./components/Legal";

function HomePage({ theme, toggleTheme }: { theme: "light" | "dark"; toggleTheme: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06060a] overflow-x-hidden transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <ClientLogos />
      <div id="value-proposition"><ValueProposition /></div>
      <div id="ai-showcase"><AIShowcase /></div>
      <ProjectBuilder />
      <div id="portfolio"><Portfolio /></div>
      <DigitalMarketing />
      <div id="process"><Process /></div>
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </BrowserRouter>
  );
}
