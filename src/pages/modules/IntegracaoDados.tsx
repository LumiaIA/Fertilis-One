import { useState, useEffect } from "react";
import { Database, Wifi, AlertCircle, CheckCircle, Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Simulação de dados em tempo real
const mockData = {
  erp: {
    status: "conectado",
    ultimaAtualizacao: "2024-01-15 14:30:25",
    registros: 1247,
    qualidade: 98.5
  },
  logistica: {
    status: "conectado",
    caminhoes: 3,
    agendamentos: 12,
    qualidade: 96.2
  },
  iot: {
    status: "conectado",
    dispositivos: 8,
    sensores: 24,
    qualidade: 99.1
  },
  estoque: {
    status: "conectado",
    itens: 156,
    movimentacoes: 89,
    qualidade: 97.8
  }
};

const IntegracaoDados = () => {
  const [dados, setDados] = useState(mockData);
  const [atualizando, setAtualizando] = useState(false);
  const [anomalias, setAnomalias] = useState([
    { id: 1, tipo: "ERP", descricao: "Lentidão na sincronização de pedidos", severidade: "baixa" },
    { id: 2, tipo: "IoT", descricao: "Sensor de temperatura offline - Misturador 3", severidade: "media" }
  ]);

  const atualizarDados = async () => {
    setAtualizando(true);
    // Simula atualização de dados
    setTimeout(() => {
      setDados(prev => ({
        ...prev,
        erp: {
          ...prev.erp,
          ultimaAtualizacao: new Date().toLocaleString('pt-BR'),
          registros: prev.erp.registros + Math.floor(Math.random() * 10)
        }
      }));
      setAtualizando(false);
    }, 2000);
  };

  useEffect(() => {
    // Atualização automática a cada 30 segundos
    const interval = setInterval(() => {
      atualizarDados();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "conectado": return "bg-success text-white";
      case "desconectado": return "bg-destructive text-white";
      case "instavel": return "bg-warning text-black";
      default: return "bg-muted";
    }
  };

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case "alta": return "destructive";
      case "media": return "default";
      case "baixa": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Integração Total de Dados
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Conecta ERP, sistemas logísticos, estoque e chão de fábrica em tempo real
              </p>
            </div>
          </div>
          

        </div>

        {/* Status das Conexões */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Sistema ERP</CardTitle>
                <Badge className={getStatusColor(dados.erp.status)}>
                  {dados.erp.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Registros:</span>
                  <span className="font-medium">{dados.erp.registros.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Qualidade:</span>
                    <span className="font-medium">{dados.erp.qualidade}%</span>
                  </div>
                  <Progress value={dados.erp.qualidade} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Logística</CardTitle>
                <Badge className={getStatusColor(dados.logistica.status)}>
                  {dados.logistica.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Caminhões:</span>
                  <span className="font-medium">{dados.logistica.caminhoes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Agendamentos:</span>
                  <span className="font-medium">{dados.logistica.agendamentos}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Qualidade:</span>
                    <span className="font-medium">{dados.logistica.qualidade}%</span>
                  </div>
                  <Progress value={dados.logistica.qualidade} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Dispositivos IoT</CardTitle>
                <Badge className={getStatusColor(dados.iot.status)}>
                  {dados.iot.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dispositivos:</span>
                  <span className="font-medium">{dados.iot.dispositivos}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sensores:</span>
                  <span className="font-medium">{dados.iot.sensores}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Qualidade:</span>
                    <span className="font-medium">{dados.iot.qualidade}%</span>
                  </div>
                  <Progress value={dados.iot.qualidade} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Estoque</CardTitle>
                <Badge className={getStatusColor(dados.estoque.status)}>
                  {dados.estoque.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Itens:</span>
                  <span className="font-medium">{dados.estoque.itens}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Movimentações:</span>
                  <span className="font-medium">{dados.estoque.movimentacoes}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Qualidade:</span>
                    <span className="font-medium">{dados.estoque.qualidade}%</span>
                  </div>
                  <Progress value={dados.estoque.qualidade} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Anomalias e Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Anomalias Detectadas
              </CardTitle>
              <CardDescription>
                IA identifica automaticamente inconsistências nos dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anomalias.map((anomalia) => (
                  <Alert key={anomalia.id} className="border-l-4 border-l-warning">
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{anomalia.tipo}:</span> {anomalia.descricao}
                      </div>
                      <Badge variant={getSeveridadeColor(anomalia.severidade)}>
                        {anomalia.severidade}
                      </Badge>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-success" />
                Validação Automática
              </CardTitle>
              <CardDescription>
                Sistema de IA valida integridade dos dados recebidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">Validação ERP</span>
                  </div>
                  <Badge className="bg-success text-white">OK</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">Validação IoT</span>
                  </div>
                  <Badge className="bg-success text-white">OK</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium">Validação Logística</span>
                  </div>
                  <Badge className="bg-warning text-black">Atenção</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fluxo de Dados em Tempo Real */}
        <Card className="bg-gradient-surface border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-primary" />
              Fluxo de Dados em Tempo Real
            </CardTitle>
            <CardDescription>
              Visualização do fluxo de informações entre sistemas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-gradient-primary p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Coleta de Dados</h4>
                <p className="text-sm text-muted-foreground">
                  APIs e IoT coletam informações de todos os sistemas em tempo real
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-primary p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Processamento IA</h4>
                <p className="text-sm text-muted-foreground">
                  Inteligência artificial valida, processa e identifica padrões nos dados
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-primary p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Disponibilização</h4>
                <p className="text-sm text-muted-foreground">
                  Dados validados são disponibilizados para todos os módulos do sistema
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegracaoDados;