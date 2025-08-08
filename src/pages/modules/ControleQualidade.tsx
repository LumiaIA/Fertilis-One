import { useState, useEffect } from "react";
import { FlaskConical, CheckCircle, AlertTriangle, TrendingUp, BarChart3, Target, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TesteQualidade {
  id: string;
  lote: string;
  produto: string;
  dataColeta: string;
  status: 'aprovado' | 'reprovado' | 'em_analise' | 'pendente';
  parametros: {
    ph: { valor: number; min: number; max: number; status: 'ok' | 'alerta' | 'critico' };
    umidade: { valor: number; min: number; max: number; status: 'ok' | 'alerta' | 'critico' };
    pureza: { valor: number; min: number; max: number; status: 'ok' | 'alerta' | 'critico' };
    granulometria: { valor: number; min: number; max: number; status: 'ok' | 'alerta' | 'critico' };
  };
  responsavel: string;
  observacoes?: string;
}

interface AlertaQualidade {
  id: string;
  tipo: 'desvio' | 'tendencia' | 'limite';
  parametro: string;
  lote: string;
  valor: number;
  limite: number;
  severidade: 'baixa' | 'media' | 'alta';
  timestamp: string;
}

const testesIniciais: TesteQualidade[] = [
  {
    id: "TQ001",
    lote: "NPK-2024-001",
    produto: "Fertilizante NPK 10-10-10",
    dataColeta: "2024-01-15 14:30",
    status: "aprovado",
    parametros: {
      ph: { valor: 6.8, min: 6.0, max: 7.5, status: 'ok' },
      umidade: { valor: 2.1, min: 0.5, max: 3.0, status: 'ok' },
      pureza: { valor: 98.5, min: 95.0, max: 100.0, status: 'ok' },
      granulometria: { valor: 2.3, min: 2.0, max: 4.0, status: 'ok' }
    },
    responsavel: "Maria Santos",
    observacoes: "Todos os parâmetros dentro da especificação"
  },
  {
    id: "TQ002",
    lote: "ORG-2024-005",
    produto: "Fertilizante Orgânico Premium",
    dataColeta: "2024-01-15 13:15",
    status: "em_analise",
    parametros: {
      ph: { valor: 7.2, min: 6.5, max: 8.0, status: 'ok' },
      umidade: { valor: 3.8, min: 2.0, max: 4.0, status: 'alerta' },
      pureza: { valor: 94.2, min: 90.0, max: 100.0, status: 'ok' },
      granulometria: { valor: 3.1, min: 2.5, max: 5.0, status: 'ok' }
    },
    responsavel: "João Silva"
  },
  {
    id: "TQ003",
    lote: "LIQ-2024-012",
    produto: "Fertilizante Líquido Base",
    dataColeta: "2024-01-15 11:45",
    status: "reprovado",
    parametros: {
      ph: { valor: 5.2, min: 6.0, max: 7.5, status: 'critico' },
      umidade: { valor: 1.8, min: 0.5, max: 3.0, status: 'ok' },
      pureza: { valor: 92.1, min: 95.0, max: 100.0, status: 'critico' },
      granulometria: { valor: 1.9, min: 2.0, max: 4.0, status: 'alerta' }
    },
    responsavel: "Carlos Oliveira",
    observacoes: "pH abaixo do limite mínimo. Pureza insuficiente. Lote rejeitado."
  }
];

const alertasIniciais: AlertaQualidade[] = [
  {
    id: "ALT001",
    tipo: "limite",
    parametro: "pH",
    lote: "LIQ-2024-012",
    valor: 5.2,
    limite: 6.0,
    severidade: "alta",
    timestamp: "2024-01-15 11:45"
  },
  {
    id: "ALT002",
    tipo: "tendencia",
    parametro: "Umidade",
    lote: "ORG-2024-005",
    valor: 3.8,
    limite: 4.0,
    severidade: "media",
    timestamp: "2024-01-15 13:15"
  }
];

const ControleQualidade = () => {
  const [testes, setTestes] = useState<TesteQualidade[]>(testesIniciais);
  const [alertas, setAlertas] = useState<AlertaQualidade[]>(alertasIniciais);
  const [metricas, setMetricas] = useState({
    testesHoje: 23,
    aprovados: 89.5,
    emAnalise: 6,
    alertasAtivos: 2,
    tempoMedioAnalise: 2.4,
    conformidade: 94.2
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-success text-white';
      case 'reprovado': return 'bg-destructive text-white';
      case 'em_analise': return 'bg-warning text-black';
      case 'pendente': return 'bg-muted text-muted-foreground';
      default: return 'bg-background';
    }
  };

  const getParametroColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-success';
      case 'alerta': return 'text-warning';
      case 'critico': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
      default: return 'outline';
    }
  };

  const calcularConformidade = (parametros: TesteQualidade['parametros']) => {
    const total = Object.keys(parametros).length;
    const conformes = Object.values(parametros).filter(p => p.status === 'ok').length;
    return (conformes / total) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-primary p-3 rounded-xl">
              <FlaskConical className="w-8 h-8 text-sidebar-foreground" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Controle de Qualidade
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Monitoramento contínuo e análise automatizada da qualidade dos produtos
              </p>
            </div>
          </div>
        </div>

        {/* Métricas de Qualidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Microscope className="w-5 h-5 text-primary" />
                Testes Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {metricas.testesHoje}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                +12% vs. ontem
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Aprovados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {metricas.aprovados}%
              </div>
              <Progress value={metricas.aprovados} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-warning" />
                Em Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {metricas.emAnalise}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Amostras pendentes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {metricas.alertasAtivos}
              </div>
              <p className="text-sm text-destructive mt-1">
                Requer atenção
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-yellow" />
                Tempo Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {metricas.tempoMedioAnalise}h
              </div>
              <p className="text-sm text-success mt-1">
                -15% vs. meta
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Conformidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {metricas.conformidade}%
              </div>
              <Progress value={metricas.conformidade} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="testes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="testes" className="text-sm">Testes</TabsTrigger>
            <TabsTrigger value="parametros" className="text-sm">Parâmetros</TabsTrigger>
            <TabsTrigger value="alertas" className="text-sm">Alertas</TabsTrigger>
            <TabsTrigger value="relatorios" className="text-sm">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="testes" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle>Testes de Qualidade Recentes</CardTitle>
                <CardDescription>
                  Resultados dos testes realizados nas últimas 24 horas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testes.map((teste) => (
                    <div key={teste.id} className="p-4 bg-background/50 rounded-lg border border-border/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{teste.produto}</h4>
                            <Badge className={getStatusColor(teste.status)}>
                              {teste.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <div>Lote: {teste.lote}</div>
                            <div>Data: {teste.dataColeta}</div>
                            <div>Responsável: {teste.responsavel}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {calcularConformidade(teste.parametros).toFixed(0)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Conformidade</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(teste.parametros).map(([nome, param]) => (
                          <div key={nome} className="p-3 bg-background/30 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium capitalize">{nome}</span>
                              <span className={`text-sm font-bold ${getParametroColor(param.status)}`}>
                                {param.valor}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Limite: {param.min} - {param.max}
                            </div>
                            <Progress 
                              value={((param.valor - param.min) / (param.max - param.min)) * 100} 
                              className="h-1 mt-2" 
                            />
                          </div>
                        ))}
                      </div>
                      
                      {teste.observacoes && (
                        <div className="mt-4 p-3 bg-background/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Observações:</strong> {teste.observacoes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parametros" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Especificações de Qualidade
                  </CardTitle>
                  <CardDescription>
                    Parâmetros e limites para cada tipo de produto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { produto: "NPK 10-10-10", ph: "6.0-7.5", umidade: "0.5-3.0%", pureza: "95-100%" },
                      { produto: "Orgânico Premium", ph: "6.5-8.0", umidade: "2.0-4.0%", pureza: "90-100%" },
                      { produto: "Líquido Base", ph: "6.0-7.5", umidade: "0.5-3.0%", pureza: "95-100%" },
                      { produto: "Foliar Concentrado", ph: "5.5-7.0", umidade: "1.0-2.5%", pureza: "98-100%" }
                    ].map((spec, index) => (
                      <div key={index} className="p-3 bg-background/50 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">{spec.produto}</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">pH: </span>
                            <span className="font-medium">{spec.ph}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Umidade: </span>
                            <span className="font-medium">{spec.umidade}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Pureza: </span>
                            <span className="font-medium">{spec.pureza}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-success" />
                    Tendências de Qualidade
                  </CardTitle>
                  <CardDescription>
                    Análise de tendências dos últimos 30 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { parametro: "pH Médio", valor: 6.8, tendencia: "+0.2", status: "melhoria" },
                      { parametro: "Umidade Média", valor: 2.4, tendencia: "-0.1", status: "estavel" },
                      { parametro: "Pureza Média", valor: 96.8, tendencia: "+1.2", status: "melhoria" },
                      { parametro: "Taxa Aprovação", valor: 89.5, tendencia: "+3.1", status: "melhoria" }
                    ].map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{trend.parametro}</div>
                          <div className="text-sm text-muted-foreground">Últimos 30 dias</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">{trend.valor}</div>
                          <div className={`text-sm ${trend.status === 'melhoria' ? 'text-success' : 'text-muted-foreground'}`}>
                            {trend.tendencia}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alertas" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Alertas de Qualidade
                </CardTitle>
                <CardDescription>
                  Desvios e anomalias detectadas automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Parâmetro</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Limite</TableHead>
                      <TableHead>Severidade</TableHead>
                      <TableHead>Data/Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alertas.map((alerta) => (
                      <TableRow key={alerta.id}>
                        <TableCell className="font-medium capitalize">{alerta.tipo}</TableCell>
                        <TableCell>{alerta.parametro}</TableCell>
                        <TableCell>{alerta.lote}</TableCell>
                        <TableCell className="font-mono">{alerta.valor}</TableCell>
                        <TableCell className="font-mono">{alerta.limite}</TableCell>
                        <TableCell>
                          <Badge variant={getSeveridadeColor(alerta.severidade)}>
                            {alerta.severidade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {alerta.timestamp}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Relatório Diário</CardTitle>
                  <CardDescription>Resumo das atividades do dia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Testes realizados:</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Taxa de aprovação:</span>
                      <span className="font-medium text-success">89.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Alertas gerados:</span>
                      <span className="font-medium text-warning">2</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Relatório Semanal</CardTitle>
                  <CardDescription>Análise da semana</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Testes realizados:</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Conformidade média:</span>
                      <span className="font-medium text-success">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lotes rejeitados:</span>
                      <span className="font-medium text-destructive">3</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Relatório Mensal</CardTitle>
                  <CardDescription>Visão geral do mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Testes realizados:</span>
                      <span className="font-medium">687</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Melhoria qualidade:</span>
                      <span className="font-medium text-success">+5.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Economia retrabalho:</span>
                      <span className="font-medium text-primary">R$ 45.2k</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ControleQualidade;