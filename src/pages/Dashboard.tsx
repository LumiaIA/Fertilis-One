import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Factory, 
  Shield, 
  Zap,
  Activity,
  Database,
  Leaf,
  Settings,
  Bell,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KPI {
  id: string;
  nome: string;
  valor: number;
  unidade: string;
  meta: number;
  tendencia: 'up' | 'down' | 'stable';
  variacao: number;
  status: 'excelente' | 'bom' | 'atencao' | 'critico';
}

interface AlertaOperacional {
  id: string;
  tipo: 'producao' | 'qualidade' | 'manutencao' | 'estoque';
  titulo: string;
  descricao: string;
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  timestamp: string;
  status: 'novo' | 'em_andamento' | 'resolvido';
}

interface StatusSistema {
  modulo: string;
  status: 'online' | 'offline' | 'manutencao';
  ultimaAtualizacao: string;
  conectividade: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // KPIs principais do sistema
  const [kpis] = useState<KPI[]>([
    {
      id: 'oee',
      nome: 'Eficiência Geral (OEE)',
      valor: 87.5,
      unidade: '%',
      meta: 85,
      tendencia: 'up',
      variacao: 2.3,
      status: 'excelente'
    },
    {
      id: 'producao',
      nome: 'Produção Diária',
      valor: 2847,
      unidade: 'ton',
      meta: 3000,
      tendencia: 'down',
      variacao: -5.1,
      status: 'atencao'
    },
    {
      id: 'qualidade',
      nome: 'Qualidade (First Pass)',
      valor: 94.2,
      unidade: '%',
      meta: 95,
      tendencia: 'stable',
      variacao: 0.1,
      status: 'bom'
    },
    {
      id: 'disponibilidade',
      nome: 'Disponibilidade',
      valor: 92.8,
      unidade: '%',
      meta: 90,
      tendencia: 'up',
      variacao: 1.2,
      status: 'excelente'
    }
  ]);

  // Alertas operacionais
  const [alertas] = useState<AlertaOperacional[]>([
    {
      id: 'alert-001',
      tipo: 'producao',
      titulo: 'Meta de Produção',
      descricao: 'Produção atual 5% abaixo da meta diária',
      severidade: 'media',
      timestamp: '14:30',
      status: 'em_andamento'
    },
    {
      id: 'alert-002',
      tipo: 'estoque',
      titulo: 'Estoque Baixo',
      descricao: 'Matéria prima A com estoque para 2 dias',
      severidade: 'alta',
      timestamp: '12:15',
      status: 'novo'
    },
    {
      id: 'alert-003',
      tipo: 'manutencao',
      titulo: 'Manutenção Preventiva',
      descricao: 'Equipamento Mix-02 programado para amanhã',
      severidade: 'baixa',
      timestamp: '09:00',
      status: 'em_andamento'
    }
  ]);

  // Status dos sistemas
  const [statusSistemas] = useState<StatusSistema[]>([
    {
      modulo: 'Integração de Dados',
      status: 'online',
      ultimaAtualizacao: '14:35',
      conectividade: 98
    },
    {
      modulo: 'Controle de Qualidade',
      status: 'online',
      ultimaAtualizacao: '14:34',
      conectividade: 95
    },
    {
      modulo: 'Registro Blockchain',
      status: 'online',
      ultimaAtualizacao: '14:35',
      conectividade: 100
    },
    {
      modulo: 'Auditoria Inteligente',
      status: 'online',
      ultimaAtualizacao: '14:33',
      conectividade: 92
    }
  ]);

  // Estatísticas resumidas
  const estatisticas = {
    lotesProduzidos: 47,
    lotesAprovados: 45,
    registrosBlockchain: 1247,
    alertasAtivos: alertas.filter(a => a.status !== 'resolvido').length,
    eficienciaMedia: 87.5,
    conformidadeTotal: 99.8
  };

  const getKPIStatusColor = (status: string) => {
    switch (status) {
      case 'excelente': return 'text-green-600 bg-green-50 border-green-200';
      case 'bom': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'atencao': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critico': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'up': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'stable': return <Activity className="w-5 h-5 text-gray-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case 'critica': return 'border-l-red-500 bg-red-50';
      case 'alta': return 'border-l-orange-500 bg-orange-50';
      case 'media': return 'border-l-yellow-500 bg-yellow-50';
      case 'baixa': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'manutencao': return <Settings className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const atualizarDados = () => {
    setUltimaAtualizacao(new Date());
  };

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(atualizarDados, 60000); // Atualiza a cada minuto
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Principal */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Dashboard Executivo
              </h1>
              <p className="text-lg text-muted-foreground">
                Visão geral da operação em tempo real
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Última atualização: {ultimaAtualizacao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={atualizarDados}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Resumo Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-surface border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{estatisticas.lotesProduzidos}</div>
              <div className="text-sm text-muted-foreground">Lotes Hoje</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-surface border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{estatisticas.lotesAprovados}</div>
              <div className="text-sm text-muted-foreground">Aprovados</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-surface border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{estatisticas.registrosBlockchain}</div>
              <div className="text-sm text-muted-foreground">Registros</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-surface border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{estatisticas.alertasAtivos}</div>
              <div className="text-sm text-muted-foreground">Alertas</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-surface border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{estatisticas.eficienciaMedia}%</div>
              <div className="text-sm text-muted-foreground">Eficiência</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-surface border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{estatisticas.conformidadeTotal}%</div>
              <div className="text-sm text-muted-foreground">Conformidade</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KPIs Principais */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  Indicadores Principais
                </CardTitle>
                <CardDescription>
                  Principais métricas de desempenho operacional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {kpis.map((kpi) => (
                    <div key={kpi.id} className={`p-4 rounded-lg border-2 ${getKPIStatusColor(kpi.status)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{kpi.nome}</h3>
                        {getTendenciaIcon(kpi.tendencia)}
                      </div>
                      
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold">
                          {kpi.unidade === '%' ? `${kpi.valor.toFixed(1)}%` : 
                           kpi.unidade === 'ton' ? `${kpi.valor.toLocaleString('pt-BR')}` :
                           `${kpi.valor.toFixed(1)} ${kpi.unidade}`}
                        </span>
                        <span className={`text-sm font-medium ${
                          kpi.variacao > 0 ? 'text-green-600' : 
                          kpi.variacao < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {kpi.variacao > 0 ? '+' : ''}{kpi.variacao.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                          <span>Meta: {kpi.unidade === '%' ? `${kpi.meta}%` : `${kpi.meta} ${kpi.unidade}`}</span>
                          <span>{((kpi.valor / kpi.meta) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress 
                          value={(kpi.valor / kpi.meta) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {kpi.status === 'excelente' ? 'Excelente' :
                         kpi.status === 'bom' ? 'Bom' :
                         kpi.status === 'atencao' ? 'Atenção' : 'Crítico'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas e Status */}
          <div className="space-y-6">
            {/* Alertas Operacionais */}
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bell className="w-6 h-6 text-orange-500" />
                  Alertas Ativos
                </CardTitle>
                <CardDescription>
                  Situações que requerem atenção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertas.filter(a => a.status !== 'resolvido').map((alerta) => (
                    <Alert key={alerta.id} className={`border-l-4 ${getSeveridadeColor(alerta.severidade)}`}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-semibold text-sm">{alerta.titulo}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {alerta.descricao}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {alerta.timestamp}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status dos Sistemas */}
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Activity className="w-6 h-6 text-green-500" />
                  Status dos Sistemas
                </CardTitle>
                <CardDescription>
                  Conectividade e funcionamento dos módulos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statusSistemas.map((sistema, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(sistema.status)}
                        <div>
                          <div className="font-medium text-sm">{sistema.modulo}</div>
                          <div className="text-xs text-muted-foreground">
                            Atualizado: {sistema.ultimaAtualizacao}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{sistema.conectividade}%</div>
                        <div className="w-16">
                          <Progress value={sistema.conectividade} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Acesso Rápido aos Módulos */}
        <Card className="mt-8 bg-gradient-surface border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="w-6 h-6 text-primary" />
              Acesso Rápido aos Módulos
            </CardTitle>
            <CardDescription>
              Navegue rapidamente para os principais módulos do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 hover:bg-primary/10"
                onClick={() => navigate('/integracao-dados')}
              >
                <Database className="w-6 h-6" />
                <span className="text-sm">Integração de Dados</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 hover:bg-primary/10"
                onClick={() => navigate('/painel-controle')}
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">Painel de Controle</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 hover:bg-primary/10"
                onClick={() => navigate('/registro-blockchain')}
              >
                <Shield className="w-6 h-6" />
                <span className="text-sm">Registro Blockchain</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 hover:bg-primary/10"
                onClick={() => navigate('/auditoria-inteligente')}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">Auditoria Inteligente</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;