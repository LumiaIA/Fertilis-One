import { useState, useEffect } from "react";
import { ArrowLeft, Monitor, TrendingUp, AlertTriangle, Users, Zap, Activity, BarChart3, Settings, Maximize2, Minimize2, RefreshCw, Download, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface KPI {
  id: string;
  nome: string;
  valor: number;
  unidade: string;
  meta: number;
  tendencia: 'up' | 'down' | 'stable';
  variacao: number;
  categoria: 'producao' | 'qualidade' | 'eficiencia' | 'financeiro';
  criticidade: 'baixa' | 'media' | 'alta' | 'critica';
  historico: { timestamp: string; valor: number }[];
}

interface Incidente {
  id: string;
  titulo: string;
  descricao: string;
  severidade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  status: 'Aberto' | 'Em Análise' | 'Resolvido' | 'Fechado';
  responsavel: string;
  dataAbertura: string;
  tempoResposta: number;
  area: string;
  impacto: string;
}

interface Widget {
  id: string;
  tipo: 'kpi' | 'grafico' | 'lista' | 'mapa';
  titulo: string;
  tamanho: 'pequeno' | 'medio' | 'grande';
  posicao: { x: number; y: number };
  configuracao: any;
  visivel: boolean;
}

const PainelControle = () => {
  const navigate = useNavigate();
  const [modoVisualizacao, setModoVisualizacao] = useState<'macro' | 'micro'>('macro');
  const [plantaSelecionada, setPlantaSelecionada] = useState('planta-1');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('hoje');
  const [modoTela, setModoTela] = useState<'normal' | 'fullscreen'>('normal');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());

  const [kpis, setKpis] = useState<KPI[]>([
    {
      id: 'kpi-001',
      nome: 'Eficiência Geral (OEE)',
      valor: 87.5,
      unidade: '%',
      meta: 85,
      tendencia: 'up',
      variacao: 2.3,
      categoria: 'eficiencia',
      criticidade: 'baixa',
      historico: [
        { timestamp: '08:00', valor: 82 },
        { timestamp: '10:00', valor: 85 },
        { timestamp: '12:00', valor: 87 },
        { timestamp: '14:00', valor: 88 },
        { timestamp: '16:00', valor: 87.5 }
      ]
    },
    {
      id: 'kpi-002',
      nome: 'Produção Diária',
      valor: 2847,
      unidade: 'ton',
      meta: 3000,
      tendencia: 'down',
      variacao: -5.1,
      categoria: 'producao',
      criticidade: 'media',
      historico: [
        { timestamp: '08:00', valor: 580 },
        { timestamp: '10:00', valor: 1150 },
        { timestamp: '12:00', valor: 1720 },
        { timestamp: '14:00', valor: 2290 },
        { timestamp: '16:00', valor: 2847 }
      ]
    },
    {
      id: 'kpi-003',
      nome: 'Qualidade (First Pass)',
      valor: 94.2,
      unidade: '%',
      meta: 95,
      tendencia: 'stable',
      variacao: 0.1,
      categoria: 'qualidade',
      criticidade: 'media',
      historico: [
        { timestamp: '08:00', valor: 94 },
        { timestamp: '10:00', valor: 94.5 },
        { timestamp: '12:00', valor: 94.1 },
        { timestamp: '14:00', valor: 94.3 },
        { timestamp: '16:00', valor: 94.2 }
      ]
    },
    {
      id: 'kpi-004',
      nome: 'Custo por Tonelada',
      valor: 1247,
      unidade: 'R$',
      meta: 1200,
      tendencia: 'up',
      variacao: 3.9,
      categoria: 'financeiro',
      criticidade: 'alta',
      historico: [
        { timestamp: '08:00', valor: 1245 },
        { timestamp: '10:00', valor: 1248 },
        { timestamp: '12:00', valor: 1246 },
        { timestamp: '14:00', valor: 1249 },
        { timestamp: '16:00', valor: 1247 }
      ]
    },
    {
      id: 'kpi-005',
      nome: 'Disponibilidade',
      valor: 92.8,
      unidade: '%',
      meta: 90,
      tendencia: 'up',
      variacao: 1.2,
      categoria: 'eficiencia',
      criticidade: 'baixa',
      historico: [
        { timestamp: '08:00', valor: 91 },
        { timestamp: '10:00', valor: 92 },
        { timestamp: '12:00', valor: 93 },
        { timestamp: '14:00', valor: 92.5 },
        { timestamp: '16:00', valor: 92.8 }
      ]
    },
    {
      id: 'kpi-006',
      nome: 'Consumo Energético',
      valor: 145.7,
      unidade: 'kWh/ton',
      meta: 150,
      tendencia: 'down',
      variacao: -2.8,
      categoria: 'eficiencia',
      criticidade: 'baixa',
      historico: [
        { timestamp: '08:00', valor: 148 },
        { timestamp: '10:00', valor: 147 },
        { timestamp: '12:00', valor: 146 },
        { timestamp: '14:00', valor: 145.5 },
        { timestamp: '16:00', valor: 145.7 }
      ]
    }
  ]);

  const [incidentes, setIncidentes] = useState<Incidente[]>([
    {
      id: 'INC-001',
      titulo: 'Temperatura Elevada - Reator 2',
      descricao: 'Temperatura do reator 2 ultrapassou 95°C, necessário ajuste imediato',
      severidade: 'Alta',
      status: 'Em Análise',
      responsavel: 'Carlos Mendes',
      dataAbertura: '2024-01-15 14:30:00',
      tempoResposta: 15,
      area: 'Produção',
      impacto: 'Redução de 12% na eficiência da linha'
    },
    {
      id: 'INC-002',
      titulo: 'Falha Sensor pH - Linha 1',
      descricao: 'Sensor de pH da linha 1 apresentando leituras inconsistentes',
      severidade: 'Média',
      status: 'Aberto',
      responsavel: 'Ana Silva',
      dataAbertura: '2024-01-15 13:45:00',
      tempoResposta: 60,
      area: 'Qualidade',
      impacto: 'Necessário controle manual do pH'
    },
    {
      id: 'INC-003',
      titulo: 'Estoque Baixo - Matéria Prima A',
      descricao: 'Nível de estoque da matéria prima A abaixo do mínimo',
      severidade: 'Crítica',
      status: 'Aberto',
      responsavel: 'João Santos',
      dataAbertura: '2024-01-15 12:00:00',
      tempoResposta: 30,
      area: 'Logística',
      impacto: 'Risco de parada de produção em 4 horas'
    }
  ]);

  const plantas = [
    { id: 'planta-1', nome: 'Planta São Paulo', status: 'Operacional' },
    { id: 'planta-2', nome: 'Planta Rio de Janeiro', status: 'Manutenção' },
    { id: 'planta-3', nome: 'Planta Minas Gerais', status: 'Operacional' }
  ];

  const periodos = [
    { id: 'hoje', nome: 'Hoje' },
    { id: 'semana', nome: 'Esta Semana' },
    { id: 'mes', nome: 'Este Mês' },
    { id: 'trimestre', nome: 'Trimestre' }
  ];

  const getCriticidadeColor = (criticidade: string) => {
    switch (criticidade) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case 'Crítica': return 'bg-red-500';
      case 'Alta': return 'bg-orange-500';
      case 'Média': return 'bg-yellow-500';
      case 'Baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      case 'stable': return <Activity className="w-4 h-4 text-gray-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatarValor = (valor: number, unidade: string) => {
    if (unidade === '%') {
      return `${valor.toFixed(1)}%`;
    } else if (unidade === 'R$') {
      return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    } else if (unidade === 'ton') {
      return `${valor.toLocaleString('pt-BR')} ton`;
    } else {
      return `${valor.toFixed(1)} ${unidade}`;
    }
  };

  const atualizarDados = () => {
    setUltimaAtualizacao(new Date());
    // Simular atualização dos dados
    setKpis(prev => prev.map(kpi => ({
      ...kpi,
      valor: kpi.valor + (Math.random() - 0.5) * 2
    })));
  };

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(atualizarDados, 30000); // Atualiza a cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const kpisPorCategoria = {
    producao: kpis.filter(k => k.categoria === 'producao'),
    qualidade: kpis.filter(k => k.categoria === 'qualidade'),
    eficiencia: kpis.filter(k => k.categoria === 'eficiencia'),
    financeiro: kpis.filter(k => k.categoria === 'financeiro')
  };

  const incidentesCriticos = incidentes.filter(i => i.severidade === 'Crítica' || i.severidade === 'Alta');

  return (
    <div className={`min-h-screen bg-gradient-subtle ${modoTela === 'fullscreen' ? 'fixed inset-0 z-50' : ''}`}>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Painel de Controle & War Room
              </h1>
              <p className="text-muted-foreground mt-1">Dashboard executivo com KPIs em tempo real e gestão de incidentes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select value={plantaSelecionada} onValueChange={setPlantaSelecionada}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {plantas.map(planta => (
                    <SelectItem key={planta.id} value={planta.id}>
                      {planta.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map(periodo => (
                    <SelectItem key={periodo.id} value={periodo.id}>
                      {periodo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={modoVisualizacao === 'macro' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setModoVisualizacao('macro')}
              >
                Macro
              </Button>
              <Button
                variant={modoVisualizacao === 'micro' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setModoVisualizacao('micro')}
              >
                Micro
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={atualizarDados}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModoTela(modoTela === 'normal' ? 'fullscreen' : 'normal')}
              >
                {modoTela === 'normal' ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Alertas Críticos */}
        {incidentesCriticos.length > 0 && (
          <div className="mb-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-red-800">
                    {incidentesCriticos.length} incidente(s) crítico(s) requer(em) atenção imediata
                  </span>
                  <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                    Ver Detalhes
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Tabs defaultValue="visao-geral" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="kpis">KPIs Detalhados</TabsTrigger>
            <TabsTrigger value="incidentes">Gestão de Incidentes</TabsTrigger>
            <TabsTrigger value="configuracao">Configuração</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visao-geral" className="space-y-6">
            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kpis.slice(0, 6).map(kpi => (
                <Card key={kpi.id} className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {kpi.nome}
                      </CardTitle>
                      <Badge className={getCriticidadeColor(kpi.criticidade)}>
                        {kpi.criticidade}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl font-bold">
                        {formatarValor(kpi.valor, kpi.unidade)}
                      </div>
                      <div className="flex items-center gap-1">
                        {getTendenciaIcon(kpi.tendencia)}
                        <span className={`text-sm font-medium ${
                          kpi.tendencia === 'up' ? 'text-green-600' :
                          kpi.tendencia === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {kpi.variacao > 0 ? '+' : ''}{kpi.variacao.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Meta: {formatarValor(kpi.meta, kpi.unidade)}</span>
                        <span>{((kpi.valor / kpi.meta) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress 
                        value={(kpi.valor / kpi.meta) * 100} 
                        className="h-1"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Última atualização: {ultimaAtualizacao.toLocaleTimeString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Gráfico de Tendências */}
            <Card>
              <CardHeader>
                <CardTitle>Tendências dos KPIs Principais</CardTitle>
                <CardDescription>
                  Evolução dos indicadores ao longo do dia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Gráfico de tendências em tempo real</p>
                    <p className="text-sm text-muted-foreground">Dados atualizados automaticamente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="kpis" className="space-y-6">
            {Object.entries(kpisPorCategoria).map(([categoria, kpisCategoria]) => (
              <Card key={categoria}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    KPIs de {categoria === 'producao' ? 'Produção' : 
                             categoria === 'qualidade' ? 'Qualidade' :
                             categoria === 'eficiencia' ? 'Eficiência' : 'Financeiro'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {kpisCategoria.map(kpi => (
                      <div key={kpi.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{kpi.nome}</h4>
                          {getTendenciaIcon(kpi.tendencia)}
                        </div>
                        <div className="text-xl font-bold mb-1">
                          {formatarValor(kpi.valor, kpi.unidade)}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Meta: {formatarValor(kpi.meta, kpi.unidade)}
                        </div>
                        <Progress value={(kpi.valor / kpi.meta) * 100} className="h-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="incidentes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gestão de Incidentes</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
                <Button size="sm">
                  Novo Incidente
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-sm text-muted-foreground">Críticos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">7</div>
                  <div className="text-sm text-muted-foreground">Alta Prioridade</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-muted-foreground">Em Análise</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">25</div>
                  <div className="text-sm text-muted-foreground">Resolvidos Hoje</div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Incidentes Ativos</CardTitle>
                <CardDescription>
                  Lista de incidentes que requerem atenção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidentes.map(incidente => (
                    <div key={incidente.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getSeveridadeColor(incidente.severidade)}`} />
                          <h4 className="font-medium">{incidente.titulo}</h4>
                          <Badge variant="outline">{incidente.status}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {incidente.dataAbertura}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{incidente.descricao}</p>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Responsável:</span> {incidente.responsavel}
                        </div>
                        <div>
                          <span className="font-medium">Área:</span> {incidente.area}
                        </div>
                        <div>
                          <span className="font-medium">Tempo Resposta:</span> {incidente.tempoResposta}min
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-orange-600">
                        <span className="font-medium">Impacto:</span> {incidente.impacto}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configuracao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Dashboard</CardTitle>
                <CardDescription>
                  Personalize a visualização e comportamento do painel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Atualização Automática</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={autoRefresh}
                          onChange={(e) => setAutoRefresh(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Atualizar dados automaticamente</span>
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Dados são atualizados a cada 30 segundos
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Alertas</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Notificações de incidentes críticos</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Alertas de KPIs fora da meta</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Exportação de Dados</h4>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar KPIs (Excel)
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Relatório de Incidentes (PDF)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PainelControle;