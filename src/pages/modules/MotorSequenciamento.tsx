import { useState, useEffect } from "react";
import { Brain, Play, Pause, RotateCcw, TrendingUp, Clock, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Sequencia {
  id: string;
  produto: string;
  prioridade: 'alta' | 'media' | 'baixa';
  tempoEstimado: number;
  status: 'aguardando' | 'em_producao' | 'concluido';
  eficiencia: number;
  recursos: string[];
}

const sequenciasIniciais: Sequencia[] = [
  {
    id: "SEQ001",
    produto: "Fertilizante NPK 10-10-10",
    prioridade: "alta",
    tempoEstimado: 120,
    status: "em_producao",
    eficiencia: 94.5,
    recursos: ["Misturador A", "Linha 1"]
  },
  {
    id: "SEQ002",
    produto: "Fertilizante Orgânico Premium",
    prioridade: "media",
    tempoEstimado: 180,
    status: "aguardando",
    eficiencia: 0,
    recursos: ["Misturador B", "Linha 2"]
  },
  {
    id: "SEQ003",
    produto: "Adubo Foliar Concentrado",
    prioridade: "alta",
    tempoEstimado: 90,
    status: "aguardando",
    eficiencia: 0,
    recursos: ["Misturador C", "Linha 3"]
  },
  {
    id: "SEQ004",
    produto: "Fertilizante Líquido Base",
    prioridade: "baixa",
    tempoEstimado: 150,
    status: "concluido",
    eficiencia: 98.2,
    recursos: ["Misturador A", "Linha 1"]
  }
];

const MotorSequenciamento = () => {
  const [sequencias, setSequencias] = useState<Sequencia[]>(sequenciasIniciais);
  const [modoIA, setModoIA] = useState<'automatico' | 'manual'>('automatico');
  const [otimizandoSequencia, setOtimizandoSequencia] = useState(false);
  const [metricas, setMetricas] = useState({
    eficienciaGeral: 92.3,
    tempoMedioSetup: 15.2,
    utilizacaoRecursos: 87.5,
    sequenciasOtimizadas: 156
  });

  const otimizarSequencia = async () => {
    setOtimizandoSequencia(true);
    
    // Simula otimização por IA
    setTimeout(() => {
      setSequencias(prev => {
        const novaSequencia = [...prev];
        // Reordena baseado em prioridade e eficiência
        novaSequencia.sort((a, b) => {
          if (a.prioridade === 'alta' && b.prioridade !== 'alta') return -1;
          if (b.prioridade === 'alta' && a.prioridade !== 'alta') return 1;
          return a.tempoEstimado - b.tempoEstimado;
        });
        return novaSequencia;
      });
      
      setMetricas(prev => ({
        ...prev,
        eficienciaGeral: Math.min(prev.eficienciaGeral + Math.random() * 2, 100),
        sequenciasOtimizadas: prev.sequenciasOtimizadas + 1
      }));
      
      setOtimizandoSequencia(false);
    }, 3000);
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_producao': return 'bg-success text-white';
      case 'aguardando': return 'bg-warning text-black';
      case 'concluido': return 'bg-muted text-muted-foreground';
      default: return 'bg-background';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_producao': return <Play className="w-4 h-4" />;
      case 'aguardando': return <Clock className="w-4 h-4" />;
      case 'concluido': return <TrendingUp className="w-4 h-4 text-white" />;
      default: return null;
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
                Motor de Sequenciamento Inteligente
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                IA otimiza automaticamente a sequência de produção para máxima eficiência
              </p>
            </div>
          </div>

        </div>

        {/* Métricas de Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-white" />
                Eficiência Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-foreground">
                  {metricas.eficienciaGeral.toFixed(1)}%
                </div>
                <Progress value={metricas.eficienciaGeral} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  +2.3% vs. mês anterior
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Tempo Médio Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-foreground">
                  {metricas.tempoMedioSetup} min
                </div>
                <p className="text-sm text-success">
                  -18% redução
                </p>
                <p className="text-sm text-muted-foreground">
                  Meta: &lt;12 min
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-accent-yellow" />
                Utilização Recursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-foreground">
                  {metricas.utilizacaoRecursos}%
                </div>
                <Progress value={metricas.utilizacaoRecursos} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Capacidade otimizada
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Sequências IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-foreground">
                  {metricas.sequenciasOtimizadas}
                </div>
                <p className="text-sm text-muted-foreground">
                  Otimizações este mês
                </p>
                <p className="text-sm text-success">
                  +12% vs. anterior
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="sequencia" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="sequencia" className="text-sm">Sequência Atual</TabsTrigger>
            <TabsTrigger value="otimizacao" className="text-sm">Otimização IA</TabsTrigger>
            <TabsTrigger value="historico" className="text-sm">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="sequencia" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle>Sequência de Produção Atual</CardTitle>
                <CardDescription>
                  Ordem otimizada pela IA baseada em prioridade, recursos e eficiência
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sequencias.map((seq, index) => (
                    <div key={seq.id} className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border/30">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-full text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground truncate">{seq.produto}</h4>
                          <Badge variant={getPrioridadeColor(seq.prioridade)} className="text-xs">
                            {seq.prioridade}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ID: {seq.id} • Recursos: {seq.recursos.join(', ')}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {seq.tempoEstimado} min
                        </div>
                        {seq.eficiencia > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {seq.eficiencia}% efic.
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(seq.status)}>
                          {getStatusIcon(seq.status)}
                          <span className="ml-1 capitalize">
                            {seq.status.replace('_', ' ')}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="otimizacao" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Algoritmos de IA
                  </CardTitle>
                  <CardDescription>
                    Técnicas utilizadas para otimização
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-background/50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Algoritmo Genético</h4>
                      <p className="text-sm text-muted-foreground">
                        Evolui soluções de sequenciamento através de gerações sucessivas
                      </p>
                      <div className="mt-2">
                        <Progress value={94} className="h-2" />
                        <span className="text-xs text-muted-foreground">94% eficácia</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-background/50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Machine Learning</h4>
                      <p className="text-sm text-muted-foreground">
                        Aprende padrões históricos para prever tempos e recursos
                      </p>
                      <div className="mt-2">
                        <Progress value={89} className="h-2" />
                        <span className="text-xs text-muted-foreground">89% precisão</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-background/50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Otimização Heurística</h4>
                      <p className="text-sm text-muted-foreground">
                        Regras inteligentes baseadas em experiência industrial
                      </p>
                      <div className="mt-2">
                        <Progress value={96} className="h-2" />
                        <span className="text-xs text-muted-foreground">96% aplicabilidade</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                    Fatores de Otimização
                  </CardTitle>
                  <CardDescription>
                    Variáveis consideradas pela IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <span className="text-sm font-medium">Prioridade do Pedido</span>
                      <Badge className="bg-accent-yellow text-foreground">Peso: 35%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <span className="text-sm font-medium">Tempo de Setup</span>
                      <Badge className="bg-accent-yellow text-foreground">Peso: 25%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <span className="text-sm font-medium">Disponibilidade Recursos</span>
                      <Badge className="bg-accent-yellow text-foreground">Peso: 20%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <span className="text-sm font-medium">Eficiência Histórica</span>
                      <Badge className="bg-accent-yellow text-foreground">Peso: 15%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <span className="text-sm font-medium">Prazo de Entrega</span>
                      <Badge className="bg-accent-yellow text-foreground">Peso: 5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="historico" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle>Histórico de Otimizações</CardTitle>
                <CardDescription>
                  Registro das melhorias implementadas pela IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      data: "15/01/2024 14:30",
                      melhoria: "Redução de 23% no tempo de setup",
                      impacto: "Economia de 2.5h/dia",
                      tipo: "setup"
                    },
                    {
                      data: "14/01/2024 09:15",
                      melhoria: "Otimização da sequência NPK",
                      impacto: "Aumento de 8% na eficiência",
                      tipo: "sequencia"
                    },
                    {
                      data: "13/01/2024 16:45",
                      melhoria: "Balanceamento de recursos",
                      impacto: "Utilização 95% vs 78%",
                      tipo: "recursos"
                    },
                    {
                      data: "12/01/2024 11:20",
                      melhoria: "Priorização inteligente",
                      impacto: "100% pedidos urgentes no prazo",
                      tipo: "prioridade"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border/30">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-full">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{item.melhoria}</h4>
                        <p className="text-sm text-muted-foreground">{item.data}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-success">{item.impacto}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.tipo}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MotorSequenciamento;