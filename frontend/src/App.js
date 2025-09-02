import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import GamesLibrary from "./pages/GamesLibrary";
import Timeline from "./pages/Timeline";
import Backlog from "./pages/Backlog";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/games" element={<GamesLibrary />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/backlog" element={<Backlog />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;