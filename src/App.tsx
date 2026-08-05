import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignalLens from "./pages/blank-demo";
import { ThemeProvider } from "@/components/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="signal-lens-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignalLens />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
