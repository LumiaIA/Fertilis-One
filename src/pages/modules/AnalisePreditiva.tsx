import { useState, useEffect } from "react";
import { Brain, TrendingUp, Target, AlertTriangle, BarChart3, Calendar, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PrevisaoDemanda {
  id: string;
  produto: string;
  categoria: string;
  demandaAtual: number;
  previsao7dias: number;
  previsao30dias: number;
  previsao90dias: number;
  tendencia: 'alta' | 'baixa' | 'estavel';
  confianca: number;
  fatoresInfluencia: string[];
  recomendacao: string;
  impactoFinanceiro: number;
}

interface ModeloIA {
  id: string;
  nome: string;
  tipo: 'demanda' | 'qualidade' | 'otimizacao' | 'manutencao';
  precisao: number;
  ultimoTreinamento: string;
  status: 'ativo' | 'treinando' | 'inativo';
  predicoesRealizadas: number;
  acertosUltimos30dias: number;
}

interface AlertaPreditivo {
  id: string;
  tipo: 'demanda_alta' | 'demanda_baixa' | 'qualidade_risco' | 'manutencao_preventiva';
  produto?: string;
  equipamento?: string;
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  probabilidade: number;
  prazoEstimado: string;
  impacto: string;
  acaoRecomendada: string;
  timestamp: string;
}

const previsoesIniciais: PrevisaoDemanda[] = [
  {
    id: "PREV001",
    produto: "NPK 10-10-10",
    categoria: "Fertilizante Mineral",
    demandaAtual: 2500,
    previsao7dias: 2850,
    previsao30dias: 3200,
    previsao90dias: 4100,
    tendencia: "alta",
    confianca: 94.2,
    fatoresInfluencia: ["Safra de milho", "Clima favorável", "Preço commodities"],
    recomendacao: "Aumentar produção em 15% nas próximas 2 semanas",
    impactoFinanceiro: 125000
  },
  {
    id: "PREV002",
    produto: "Fertilizante Orgânico Premium",
    categoria: "Fertilizante Orgânico",
    demandaAtual: 1800,
    previsao7dias: 1650,
    previsao30dias: 1400,
    previsao90dias: 1200,
    tendencia: "baixa",
    confianca: 87.5,
    fatoresInfluencia: ["Entressafra", "Preço elevado", "Concorrência"],
    recomendacao: "Reduzir produção em 20% e focar em promoções",
    impactoFinanceiro: -45000
  },
  {
    id: "PREV003",
    produto: "Superfosfato Simples",
    categoria: "Fertilizante Fosfatado",
    demandaAtual: 3200,
    previsao7dias: 3180,
    previsao30dias: 3150,
    previsao90dias: 3100,
    tendencia: "estavel",
    confianca: 91.8,
    fatoresInfluencia: ["Demanda constante", "Mercado estável"],
    recomendacao: "Manter produção atual",
    impactoFinanceiro: 0
  },
  {
    id: "PREV004",
    produto: "Ureia Granulada",
    categoria: "Fertilizante Nitrogenado",
    demandaAtual: 4500,
    previsao7dias: 5200,
    previsao30dias: 6800,
    previsao90dias: 8500,
    tendencia: "alta",
    confianca: 96.1,
    fatoresInfluencia: ["Plantio soja", "Exportação", "Dólar alto"],
    recomendacao: "Aumentar produção em 25% e garantir estoque",
    impactoFinanceiro: 280000
  }
];

const modelosIniciais: ModeloIA[] = [
  {
    id: "MODEL001",
    nome: "DeepDemand Neural Network",
    tipo: "demanda",
    precisao: 94.2,
    ultimoTreinamento: "2024-01-14 03:00:00",
    status: "ativo",
    predicoesRealizadas: 15847,
    acertosUltimos30dias: 92.8
  },
  {
    id: "MODEL002",
    nome: "QualityPredict AI",
    tipo: "qualidade",
    precisao: 97.5,
    ultimoTreinamento: "2024-01-15 02:30:00",
    status: "ativo",
    predicoesRealizadas: 8934,
    acertosUltimos30dias: 96.2
  },
  {
    id: "MODEL003",
    nome: "OptimizePro Algorithm",
    tipo: "otimizacao",
    precisao: 89.7,
    ultimoTreinamento: "2024-01-13 01:45:00",
    status: "treinando",
    predicoesRealizadas: 12456,
    acertosUltimos30dias: 88.1
  },
  {
    id: "MODEL004",
    nome: "MaintenanceAI Predictor",
    tipo: "manutencao",
    precisao: 91.3,
    ultimoTreinamento: "2024-01-15 04:15:00",
    status: "ativo",
    predicoesRealizadas: 3247,
    acertosUltimos30dias: 93.5
  }
];

const alertasIniciais: AlertaPreditivo[] = [
  {
    id: "ALERT001",
    tipo: "demanda_alta",
    produto: "NPK 10-10-10",
    severidade: "alta",
    probabilidade: 94.2,
    prazoEstimado: "7-14 dias",
    impacto: "Possível ruptura de estoque, perda de vendas de R$ 125k",
    acaoRecomendada: "Aumentar produção imediatamente em 15%",
    timestamp: "2024-01-15 14:30:00"
  },
  {
    id: "ALERT002",
    tipo: "manutencao_preventiva",
    equipamento: "Misturador Principal #3",
    severidade: "media",
    probabilidade: 78.5,
    prazoEstimado: "15-20 dias",
    impacto: "Parada não programada de 8-12 horas",
    acaoRecomendada: "Agendar manutenção preventiva para próximo fim de semana",
    timestamp: "2024-01-15 09:15:00"
  },
  {
    id: "ALERT003",
    tipo: "qualidade_risco",
    produto: "Fertilizante Orgânico Premium",
    severidade: "baixa",
    probabilidade: 65.3,
    prazoEstimado: "3-5 dias",
    impacto: "Possível variação na qualidade do lote atual",
    acaoRecomendada: "Intensificar testes de qualidade nos próximos lotes",
    timestamp: "2024-01-15 11:45:00"
  }
];

const AnalisePreditiva = () => {
  const [previsoes, setPrevisoes] = useState<PrevisaoDemanda[]>(previsoesIniciais);
  const [modelos, setModelos] = useState<ModeloIA[]>(modelosIniciais);
  const [alertas, setAlertas] = useState<AlertaPreditivo[]>(alertasIniciais);
  const [periodoAnalise, setPeriodoAnalise] = useState('30dias');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [metricas, setMetricas] = useState({
    precisaoMediaModelos: 93.2,
    predicoesRealizadas: 40484,
    economiaGerada: 1250000,
    alertasAtivos: 8,
    modelosAtivos: 4,
    acuraciaUltimos30dias: 92.7
  });

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'alta': return 'text-success';
      case 'baixa': return 'text-destructive';
      case 'estavel': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'alta': return <TrendingUp className="w-4 h-4" />;
      case 'baixa': return <TrendingUp className="w-4 h-4 rotate-180" />;
      case 'estavel': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusModeloColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-success text-white';
      case 'treinando': return 'bg-accent-yellow text-foreground';
      case 'inativo': return 'bg-muted text-foreground';
      default: return 'bg-muted';
    }
  };

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case 'baixa': return 'bg-muted text-foreground';
      case 'media': return 'bg-accent-yellow text-foreground';
      case 'alta': return 'bg-warning text-black';
      case 'critica': return 'bg-destructive text-white';
      default: return 'bg-muted';
    }
  };

  const getTipoAlertaIcon = (tipo: string) => {
    switch (tipo) {
      case 'demanda_alta': return <TrendingUp className="w-4 h-4" />;
      case 'demanda_baixa': return <TrendingUp className="w-4 h-4 rotate-180" />;
      case 'qualidade_risco': return <AlertTriangle className="w-4 h-4" />;
      case 'manutencao_preventiva': return <Zap className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const gerarRelatorioPredicoes = () => {
    const dados = {
      timestamp: new Date().toISOString(),
      periodo: periodoAnalise,
      previsoes,
      metricas,
      alertas
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise_preditiva_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-primary p-3 rounded-xl">
              <Brain className="w-8 h-8 text-sidebar-foreground" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Análise Preditiva
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Inteligência artificial para previsão de demanda e otimização
              </p>
            </div>
          </div>
        </div>

        {/* Métricas de IA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Precisão IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.precisaoMediaModelos}%
              </div>
              <Progress value={metricas.precisaoMediaModelos} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-success" />
                Predições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {(metricas.predicoesRealizadas / 1000).toFixed(0)}k
              </div>
              <p className="text-sm text-success mt-1">
                +1.2k hoje
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-yellow" />
                Economia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                R$ {(metricas.economiaGerada / 1000000).toFixed(1)}M
              </div>
              <p className="text-sm text-success mt-1">
                Este ano
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.alertasAtivos}
              </div>
              <p className="text-sm text-warning mt-1">
                Requer atenção
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Modelos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.modelosAtivos}
              </div>
              <p className="text-sm text-success mt-1">
                Ativos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-success" />
                Acurácia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.acuraciaUltimos30dias}%
              </div>
              <p className="text-sm text-success mt-1">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="previsoes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="previsoes" className="text-sm">Previsões</TabsTrigger>
            <TabsTrigger value="modelos" className="text-sm">Modelos IA</TabsTrigger>
            <TabsTrigger value="alertas" className="text-sm">Alertas</TabsTrigger>
            <TabsTrigger value="insights" className="text-sm">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="previsoes" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle>Previsões de Demanda</CardTitle>
                    <CardDescription>
                      Análise preditiva baseada em IA para otimização da produção
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Select value={periodoAnalise} onValueChange={setPeriodoAnalise}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7dias">7 dias</SelectItem>
                        <SelectItem value="30dias">30 dias</SelectItem>
                        <SelectItem value="90dias">90 dias</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button onClick={gerarRelatorioPredicoes} variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Relatório
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {previsoes.map((previsao) => {
                    const previsaoSelecionada = periodoAnalise === '7dias' ? previsao.previsao7dias :
                                               periodoAnalise === '30dias' ? previsao.previsao30dias :
                                               previsao.previsao90dias;
                    const variacao = ((previsaoSelecionada - previsao.demandaAtual) / previsao.demandaAtual) * 100;
                    
                    return (
                      <div key={previsao.id} className="p-6 bg-background/50 rounded-lg border border-border/30">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-xl font-semibold text-foreground">{previsao.produto}</h4>
                              <Badge variant="outline">{previsao.categoria}</Badge>
                              <div className={`flex items-center gap-1 ${getTendenciaColor(previsao.tendencia)}`}>
                                {getTendenciaIcon(previsao.tendencia)}
                                <span className="text-sm font-medium capitalize">{previsao.tendencia}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                              <div className="text-center p-3 bg-background rounded-lg">
                                <div className="text-sm text-muted-foreground mb-1">Demanda Atual</div>
                                <div className="text-2xl font-bold text-foreground">
                                  {previsao.demandaAtual.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">unidades</div>
                              </div>
                              
                              <div className="text-center p-3 bg-background rounded-lg">
                                <div className="text-sm text-muted-foreground mb-1">Previsão {periodoAnalise.replace('dias', ' dias')}</div>
                                <div className="text-2xl font-bold text-primary">
                                  {previsaoSelecionada.toLocaleString()}
                                </div>
                                <div className={`text-xs font-medium ${
                                  variacao > 0 ? 'text-success' : variacao < 0 ? 'text-destructive' : 'text-muted-foreground'
                                }`}>
                                  {variacao > 0 ? '+' : ''}{variacao.toFixed(1)}%
                                </div>
                              </div>
                              
                              <div className="text-center p-3 bg-background rounded-lg">
                                <div className="text-sm text-muted-foreground mb-1">Confiança IA</div>
                                <div className="text-2xl font-bold text-success">
                                  {previsao.confianca}%
                                </div>
                                <Progress value={previsao.confianca} className="h-1 mt-2" />
                              </div>
                              
                              <div className="text-center p-3 bg-background rounded-lg">
                                <div className="text-sm text-muted-foreground mb-1">Impacto Financeiro</div>
                                <div className={`text-2xl font-bold ${
                                  previsao.impactoFinanceiro > 0 ? 'text-success' : 
                                  previsao.impactoFinanceiro < 0 ? 'text-destructive' : 'text-muted-foreground'
                                }`}>
                                  {previsao.impactoFinanceiro > 0 ? '+' : ''}R$ {(previsao.impactoFinanceiro / 1000).toFixed(0)}k
                                </div>
                                <div className="text-xs text-muted-foreground">estimado</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h6 className="font-semibold mb-3 text-foreground">Fatores de Influência</h6>
                            <div className="flex flex-wrap gap-2">
                              {previsao.fatoresInfluencia.map((fator, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {fator}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h6 className="font-semibold mb-3 text-foreground">Recomendação IA</h6>
                            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                              <p className="text-sm text-foreground">{previsao.recomendacao}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modelos" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Modelos de Inteligência Artificial
                </CardTitle>
                <CardDescription>
                  Status e performance dos modelos de machine learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Precisão</TableHead>
                      <TableHead>Último Treinamento</TableHead>
                      <TableHead>Predições</TableHead>
                      <TableHead>Acertos (30d)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modelos.map((modelo) => (
                      <TableRow key={modelo.id}>
                        <TableCell className="font-medium">{modelo.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {modelo.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusModeloColor(modelo.status)}>
                            {modelo.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{modelo.precisao}%</span>
                            <Progress value={modelo.precisao} className="h-2 w-16" />
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {modelo.ultimoTreinamento}
                        </TableCell>
                        <TableCell className="font-mono">
                          {modelo.predicoesRealizadas.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            modelo.acertosUltimos30dias >= 90 ? 'text-success' :
                            modelo.acertosUltimos30dias >= 80 ? 'text-warning' : 'text-destructive'
                          }`}>
                            {modelo.acertosUltimos30dias}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alertas" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Alertas Preditivos
                </CardTitle>
                <CardDescription>
                  Avisos antecipados baseados em análise de IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertas.map((alerta) => (
                    <div key={alerta.id} className="p-4 bg-background/50 rounded-lg border border-border/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getSeveridadeColor(alerta.severidade)}`}>
                            {getTipoAlertaIcon(alerta.tipo)}
                          </div>
                          <div>
                            <h5 className="font-semibold text-foreground capitalize">
                              {alerta.tipo.replace('_', ' ')}
                            </h5>
                            <div className="text-sm text-muted-foreground">
                              {alerta.produto || alerta.equipamento}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={getSeveridadeColor(alerta.severidade)}>
                            {alerta.severidade}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {alerta.probabilidade}% probabilidade
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Prazo Estimado:</span>
                          <div className="font-medium">{alerta.prazoEstimado}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Detectado em:</span>
                          <div className="font-medium">{alerta.timestamp}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-muted-foreground">Impacto Previsto:</span>
                          <div className="text-sm bg-warning/10 p-2 rounded mt-1">{alerta.impacto}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-muted-foreground">Ação Recomendada:</span>
                          <div className="text-sm bg-primary/10 p-2 rounded mt-1">{alerta.acaoRecomendada}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          Adiar
                        </Button>
                        <Button size="sm">
                          Executar Ação
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Insights de Performance</CardTitle>
                  <CardDescription>Análise de tendências e oportunidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-success" />
                        <h6 className="font-semibold text-success">Oportunidade Identificada</h6>
                      </div>
                      <p className="text-sm text-foreground mb-2">
                        Demanda por fertilizantes nitrogenados crescerá 25% nos próximos 90 dias.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Potencial de receita adicional: R$ 280k
                      </p>
                    </div>
                    
                    <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        <h6 className="font-semibold text-warning">Atenção Necessária</h6>
                      </div>
                      <p className="text-sm text-foreground mb-2">
                        Fertilizantes orgânicos apresentam tendência de queda na demanda.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Recomendação: Revisar estratégia de preços e marketing
                      </p>
                    </div>
                    
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-primary" />
                        <h6 className="font-semibold text-primary">Otimização IA</h6>
                      </div>
                      <p className="text-sm text-foreground mb-2">
                        Modelos de IA identificaram padrão sazonal não detectado anteriormente.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Precisão das previsões aumentou 3.2% este mês
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Métricas de Impacto</CardTitle>
                  <CardDescription>Resultados da implementação de IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">Redução de Desperdício</div>
                        <div className="text-lg font-bold text-success">18.5%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">vs. período anterior</div>
                        <div className="text-sm text-success">+2.3%</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">Otimização de Estoque</div>
                        <div className="text-lg font-bold text-primary">R$ 450k</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">economia gerada</div>
                        <div className="text-sm text-success">+15.2%</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">Satisfação Cliente</div>
                        <div className="text-lg font-bold text-success">96.8%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">entregas no prazo</div>
                        <div className="text-sm text-success">+4.1%</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">Tempo de Resposta</div>
                        <div className="text-lg font-bold text-accent-yellow">2.3s</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">análise preditiva</div>
                        <div className="text-sm text-success">-0.8s</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalisePreditiva;