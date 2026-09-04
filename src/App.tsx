import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./lib/theme";
import { VariantSwitch } from "./components/VariantSwitch";

const Classic = lazy(() => import("./pages/Classic"));
const ConceptB = lazy(() => import("./concept-b/BPage"));

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Classic />} />
          <Route path="/b" element={<ConceptB />} />
        </Routes>
      </Suspense>
      <VariantSwitch />
    </ThemeProvider>
  );
}
