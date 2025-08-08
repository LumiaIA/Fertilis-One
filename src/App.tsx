import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

// Importação dos módulos
import IntegracaoDados from "./pages/modules/IntegracaoDados";
import MotorSequenciamento from "./pages/modules/MotorSequenciamento";
import RegistroBlockchain from "./pages/modules/RegistroBlockchain";
import ControleQualidade from "./pages/modules/ControleQualidade";
import GestaoEstoque from "./pages/modules/GestaoEstoque";
import RastreabilidadeCompleta from "./pages/modules/RastreabilidadeCompleta";
import AnalisePreditiva from "./pages/modules/AnalisePreditiva";
import AuditoriaInteligente from "./pages/modules/AuditoriaInteligente";
import ExecucaoOperacional from "./pages/modules/ExecucaoOperacional";
import PainelControle from "./pages/modules/PainelControle";
import AprendizadoContinuo from "./pages/modules/AprendizadoContinuo";
import EscalabilidadePersonalizacao from "./pages/modules/EscalabilidadePersonalizacao";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

// Layout component for module pages
const ModuleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      <Sidebar />
      <main className="flex-1 lg:ml-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<ModuleLayout><Dashboard /></ModuleLayout>} />
          
          {/* Rotas dos Módulos */}
          <Route path="/integracao-dados" element={<ModuleLayout><IntegracaoDados /></ModuleLayout>} />
          <Route path="/motor-sequenciamento" element={<ModuleLayout><MotorSequenciamento /></ModuleLayout>} />
          <Route path="/registro-blockchain" element={<ModuleLayout><RegistroBlockchain /></ModuleLayout>} />
          <Route path="/controle-qualidade" element={<ModuleLayout><ControleQualidade /></ModuleLayout>} />
          <Route path="/gestao-estoque" element={<ModuleLayout><GestaoEstoque /></ModuleLayout>} />
          <Route path="/rastreabilidade-completa" element={<ModuleLayout><RastreabilidadeCompleta /></ModuleLayout>} />
          <Route path="/analise-preditiva" element={<ModuleLayout><AnalisePreditiva /></ModuleLayout>} />
          <Route path="/auditoria-inteligente" element={<ModuleLayout><AuditoriaInteligente /></ModuleLayout>} />
          <Route path="/execucao-operacional" element={<ModuleLayout><ExecucaoOperacional /></ModuleLayout>} />
           <Route path="/painel-controle" element={<ModuleLayout><PainelControle /></ModuleLayout>} />
           <Route path="/aprendizado-continuo" element={<ModuleLayout><AprendizadoContinuo /></ModuleLayout>} />
           <Route path="/escalabilidade-personalizacao" element={<ModuleLayout><EscalabilidadePersonalizacao /></ModuleLayout>} />
           <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
