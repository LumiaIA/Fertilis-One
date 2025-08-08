import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Database, 
  Brain, 
  ClipboardCheck, 
  Monitor, 
  FileText, 
  BookOpen, 
  Globe, 
  Shield,
  Menu,
  X,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import FertilisLogo from "./FertilisLogo";

const modules = [
  {
    id: 0,
    name: "Dashboard Executivo",
    icon: BarChart3,
    description: "Visão geral da operação",
    route: "/dashboard"
  },
  {
    id: 1,
    name: "Integração Total de Dados",
    icon: Database,
    description: "Conectividade ERP, IoT e sistemas",
    route: "/integracao-dados"
  },
  {
    id: 2,
    name: "Motor de Sequenciamento",
    icon: Brain,
    description: "IA para otimização de produção",
    route: "/motor-sequenciamento"
  },
  {
    id: 3,
    name: "Execução Operacional",
    icon: ClipboardCheck,
    description: "Ordens de trabalho guiadas",
    route: "/execucao-operacional"
  },
  {
    id: 4,
    name: "Painel de Controle",
    icon: Monitor,
    description: "War Room e KPIs em tempo real",
    route: "/painel-controle"
  },
  {
    id: 5,
    name: "Rastreabilidade Completa",
    icon: FileText,
    description: "Auditoria e histórico completo",
    route: "/rastreabilidade-completa"
  },
  {
    id: 6,
    name: "Aprendizado Contínuo",
    icon: BookOpen,
    description: "IA supervisionada e melhorias",
    route: "/aprendizado-continuo"
  },
  {
    id: 7,
    name: "Escalabilidade",
    icon: Globe,
    description: "Multi-planta e customização",
    route: "/escalabilidade-personalizacao"
  },
  {
    id: 8,
    name: "Registro Blockchain",
    icon: Shield,
    description: "Trilha inviolável de decisões",
    route: "/registro-blockchain"
  }
];

interface SidebarProps {
  activeModule?: number;
  onModuleSelect?: (moduleId: number) => void;
}

const Sidebar = ({ activeModule, onModuleSelect }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleModuleClick = (module: typeof modules[0]) => {
    navigate(module.route);
    onModuleSelect?.(module.id);
    setIsCollapsed(true); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-sidebar-primary text-sidebar-foreground p-2 rounded-lg shadow-glow"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 bg-sidebar-primary text-sidebar-foreground transform transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:inset-0",
        isCollapsed ? "-translate-x-full" : "translate-x-0",
        "w-80 flex flex-col"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-sidebar-foreground/10">
          <FertilisLogo className="text-sidebar-foreground [&_h1]:text-sidebar-foreground [&_p]:text-sidebar-foreground/70" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-4">
              Módulos do Sistema
            </h2>
            
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = location.pathname === module.route || activeModule === module.id;
              
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-smooth text-left group",
                    isActive 
                      ? "bg-accent-yellow/40 text-white shadow-glow" 
                      : "hover:bg-white/10 text-white/95 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-smooth",
                    isActive 
                      ? "bg-accent-yellow text-sidebar-primary" 
                      : "bg-white/20 group-hover:bg-white/30"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-bold text-sm truncate",
                      isActive ? "text-white" : "text-white"
                    )}>
                      {module.name}
                    </div>
                    <div className={cn(
                      "text-xs truncate",
                      isActive ? "text-white/90" : "text-white/85"
                    )}>
                      {module.description}
                    </div>
                  </div>
                  
                  {isActive && (
                    <div className="w-2 h-2 bg-accent-yellow rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-foreground/10">
          <div className="text-xs text-sidebar-foreground/50 text-center">
            Fertilis One v2.0
            <br />
            Powered by IA & Blockchain
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;