import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignalLens from "./pages/blank-demo";
import DesignKitDemo from "./pages/_design";
import { ThemeProvider } from "@/components/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="signal-lens-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/_design" element={<DesignKitDemo />} />
          <Route path="/" element={<SignalLens />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
