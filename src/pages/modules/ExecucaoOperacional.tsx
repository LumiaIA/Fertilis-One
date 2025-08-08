import { useState, useEffect } from "react";
import { ArrowLeft, Play, Pause, CheckCircle, AlertTriangle, Clock, User, Wrench, Lock, Unlock, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OrdemTrabalho {
  id: string;
  produto: string;
  lote: string;
  quantidade: number;
  operador: string;
  linha: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  status: 'Aguardando' | 'Em Execução' | 'Pausada' | 'Concluída' | 'Bloqueada';
  progresso: number;
  tempoEstimado: number;
  tempoDecorrido: number;
  etapas: EtapaOperacao[];
  alertas: string[];
  travamentos: Travamento[];
}

interface EtapaOperacao {
  id: string;
  nome: string;
  descricao: string;
  status: 'Pendente' | 'Em Execução' | 'Concluída' | 'Bloqueada';
  tempoEstimado: number;
  instrucoes: string[];
  parametros: { nome: string; valor: string; unidade: string }[];
  verificacoes: { item: string; status: boolean }[];
}

interface Travamento {
  id: string;
  tipo: 'Qualidade' | 'Segurança' | 'Equipamento' | 'Material';
  motivo: string;
  timestamp: string;
  ativo: boolean;
  nivelCriticidade: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
}

const ExecucaoOperacional = () => {
  const navigate = useNavigate();
  const [ordemAtiva, setOrdemAtiva] = useState<string>('ORD-2024-001');
  const [modoVisualizacao, setModoVisualizacao] = useState<'operador' | 'supervisor'>('operador');
  const [ordens, setOrdens] = useState<OrdemTrabalho[]>([
    {
      id: 'ORD-2024-001',
      produto: 'NPK 20-05-20',
      lote: 'LT240115001',
      quantidade: 2500,
      operador: 'João Silva',
      linha: 'Linha 1 - Granulação',
      prioridade: 'Alta',
      status: 'Em Execução',
      progresso: 65,
      tempoEstimado: 480,
      tempoDecorrido: 312,
      alertas: ['Temperatura do reator acima do ideal', 'Verificar umidade do produto'],
      travamentos: [
        {
          id: 'TRV-001',
          tipo: 'Qualidade',
          motivo: 'pH fora da especificação - Aguardando ajuste',
          timestamp: '2024-01-15 14:30:00',
          ativo: true,
          nivelCriticidade: 'Médio'
        }
      ],
      etapas: [
        {
          id: 'ETP-001',
          nome: 'Preparação de Matéria-Prima',
          descricao: 'Dosagem e mistura dos componentes NPK',
          status: 'Concluída',
          tempoEstimado: 60,
          instrucoes: [
            'Verificar qualidade das matérias-primas',
            'Dosar conforme receita aprovada',
            'Registrar pesos no sistema'
          ],
          parametros: [
            { nome: 'Nitrogênio', valor: '20.1', unidade: '%' },
            { nome: 'Fósforo', valor: '5.0', unidade: '%' },
            { nome: 'Potássio', valor: '19.8', unidade: '%' }
          ],
          verificacoes: [
            { item: 'Pesos conferidos', status: true },
            { item: 'Qualidade aprovada', status: true },
            { item: 'Registro no sistema', status: true }
          ]
        },
        {
          id: 'ETP-002',
          nome: 'Granulação',
          descricao: 'Processo de formação dos grânulos',
          status: 'Em Execução',
          tempoEstimado: 180,
          instrucoes: [
            'Ajustar temperatura do tambor para 85°C',
            'Controlar umidade entre 12-15%',
            'Monitorar formação dos grânulos'
          ],
          parametros: [
            { nome: 'Temperatura', valor: '87.2', unidade: '°C' },
            { nome: 'Umidade', valor: '13.5', unidade: '%' },
            { nome: 'Velocidade', valor: '12.5', unidade: 'rpm' }
          ],
          verificacoes: [
            { item: 'Temperatura ajustada', status: true },
            { item: 'Umidade controlada', status: true },
            { item: 'Granulometria OK', status: false }
          ]
        },
        {
          id: 'ETP-003',
          nome: 'Secagem',
          descricao: 'Redução da umidade dos grânulos',
          status: 'Pendente',
          tempoEstimado: 120,
          instrucoes: [
            'Ajustar temperatura do secador',
            'Controlar fluxo de ar',
            'Monitorar umidade final'
          ],
          parametros: [],
          verificacoes: []
        },
        {
          id: 'ETP-004',
          nome: 'Peneiramento',
          descricao: 'Classificação granulométrica',
          status: 'Pendente',
          tempoEstimado: 90,
          instrucoes: [
            'Configurar peneiras',
            'Separar por granulometria',
            'Registrar rendimento'
          ],
          parametros: [],
          verificacoes: []
        },
        {
          id: 'ETP-005',
          nome: 'Ensacamento',
          descricao: 'Embalagem do produto final',
          status: 'Pendente',
          tempoEstimado: 30,
          instrucoes: [
            'Verificar qualidade das embalagens',
            'Pesar e ensacar produto',
            'Aplicar etiquetas de identificação'
          ],
          parametros: [],
          verificacoes: []
        }
      ]
    },
    {
      id: 'ORD-2024-002',
      produto: 'Ureia 46-00-00',
      lote: 'LT240115002',
      quantidade: 1800,
      operador: 'Maria Santos',
      linha: 'Linha 2 - Prilling',
      prioridade: 'Média',
      status: 'Aguardando',
      progresso: 0,
      tempoEstimado: 360,
      tempoDecorrido: 0,
      alertas: [],
      travamentos: [],
      etapas: []
    }
  ]);

  const ordemSelecionada = ordens.find(o => o.id === ordemAtiva);
  const travamentosAtivos = ordemSelecionada?.travamentos.filter(t => t.ativo) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Execução': return 'bg-blue-500';
      case 'Concluída': return 'bg-green-500';
      case 'Pausada': return 'bg-yellow-500';
      case 'Bloqueada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Média': return 'bg-yellow-100 text-yellow-800';
      case 'Baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTravamentoColor = (tipo: string) => {
    switch (tipo) {
      case 'Qualidade': return 'bg-orange-100 text-orange-800';
      case 'Segurança': return 'bg-red-100 text-red-800';
      case 'Equipamento': return 'bg-blue-100 text-blue-800';
      case 'Material': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
  };

  const handleAcaoOrdem = (acao: 'iniciar' | 'pausar' | 'retomar' | 'finalizar') => {
    if (!ordemSelecionada) return;
    
    setOrdens(prev => prev.map(ordem => {
      if (ordem.id === ordemAtiva) {
        switch (acao) {
          case 'iniciar':
            return { ...ordem, status: 'Em Execução' as const };
          case 'pausar':
            return { ...ordem, status: 'Pausada' as const };
          case 'retomar':
            return { ...ordem, status: 'Em Execução' as const };
          case 'finalizar':
            return { ...ordem, status: 'Concluída' as const, progresso: 100 };
          default:
            return ordem;
        }
      }
      return ordem;
    }));
  };

  const resolverTravamento = (travamentoId: string) => {
    setOrdens(prev => prev.map(ordem => {
      if (ordem.id === ordemAtiva) {
        return {
          ...ordem,
          travamentos: ordem.travamentos.map(t => 
            t.id === travamentoId ? { ...t, ativo: false } : t
          )
        };
      }
      return ordem;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Execução Operacional Guiada</h1>
              <p className="text-muted-foreground mt-1">Ordens de trabalho e suporte visual para operadores</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={modoVisualizacao === 'operador' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setModoVisualizacao('operador')}
              >
                <User className="w-4 h-4 mr-2" />
                Operador
              </Button>
              <Button
                variant={modoVisualizacao === 'supervisor' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setModoVisualizacao('supervisor')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Supervisor
              </Button>
            </div>
          </div>
        </div>

        {/* Alertas de Travamento */}
        {travamentosAtivos.length > 0 && (
          <div className="mb-6">
            {travamentosAtivos.map(travamento => (
              <Alert key={travamento.id} className="mb-4 border-orange-200 bg-orange-50">
                <Lock className="h-4 w-4 text-orange-600" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-orange-800">
                      Travamento {travamento.tipo}: 
                    </span>
                    <span className="text-orange-700 ml-2">{travamento.motivo}</span>
                    <Badge className={`ml-3 ${getTravamentoColor(travamento.tipo)}`}>
                      {travamento.nivelCriticidade}
                    </Badge>
                  </div>
                  {modoVisualizacao === 'supervisor' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolverTravamento(travamento.id)}
                      className="text-orange-700 border-orange-300 hover:bg-orange-100"
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      Resolver
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Ordens */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Ordens de Trabalho
                </CardTitle>
                <CardDescription>
                  Selecione uma ordem para visualizar detalhes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ordens.map(ordem => (
                  <div
                    key={ordem.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      ordemAtiva === ordem.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setOrdemAtiva(ordem.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{ordem.id}</span>
                      <Badge className={getPrioridadeColor(ordem.prioridade)}>
                        {ordem.prioridade}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {ordem.produto} - {ordem.quantidade}kg
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(ordem.status)}`} />
                      <span className="text-xs text-muted-foreground">{ordem.status}</span>
                    </div>
                    <Progress value={ordem.progresso} className="h-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Detalhes da Ordem Selecionada */}
          <div className="lg:col-span-2">
            {ordemSelecionada && (
              <div className="space-y-6">
                {/* Cabeçalho da Ordem */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {ordemSelecionada.produto}
                          <Badge className={getPrioridadeColor(ordemSelecionada.prioridade)}>
                            {ordemSelecionada.prioridade}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {ordemSelecionada.id} - Lote: {ordemSelecionada.lote}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {ordemSelecionada.status === 'Aguardando' && (
                          <Button onClick={() => handleAcaoOrdem('iniciar')} disabled={travamentosAtivos.length > 0}>
                            <Play className="w-4 h-4 mr-2" />
                            Iniciar
                          </Button>
                        )}
                        {ordemSelecionada.status === 'Em Execução' && (
                          <Button variant="outline" onClick={() => handleAcaoOrdem('pausar')}>
                            <Pause className="w-4 h-4 mr-2" />
                            Pausar
                          </Button>
                        )}
                        {ordemSelecionada.status === 'Pausada' && (
                          <Button onClick={() => handleAcaoOrdem('retomar')} disabled={travamentosAtivos.length > 0}>
                            <Play className="w-4 h-4 mr-2" />
                            Retomar
                          </Button>
                        )}
                        {modoVisualizacao === 'supervisor' && ordemSelecionada.progresso > 90 && (
                          <Button variant="outline" onClick={() => handleAcaoOrdem('finalizar')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Finalizar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Operador</div>
                        <div className="font-medium">{ordemSelecionada.operador}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Linha</div>
                        <div className="font-medium">{ordemSelecionada.linha}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Quantidade</div>
                        <div className="font-medium">{ordemSelecionada.quantidade.toLocaleString()} kg</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Tempo</div>
                        <div className="font-medium">
                          {formatarTempo(ordemSelecionada.tempoDecorrido)} / {formatarTempo(ordemSelecionada.tempoEstimado)}
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{ordemSelecionada.progresso}%</span>
                      </div>
                      <Progress value={ordemSelecionada.progresso} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Etapas da Operação */}
                <Card>
                  <CardHeader>
                    <CardTitle>Etapas da Operação</CardTitle>
                    <CardDescription>
                      Acompanhe o progresso de cada etapa do processo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="etapas" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="etapas">Etapas</TabsTrigger>
                        <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="etapas" className="space-y-4">
                        {ordemSelecionada.etapas.map((etapa, index) => (
                          <div key={etapa.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                  etapa.status === 'Concluída' ? 'bg-green-500' :
                                  etapa.status === 'Em Execução' ? 'bg-blue-500' :
                                  etapa.status === 'Bloqueada' ? 'bg-red-500' : 'bg-gray-400'
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-medium">{etapa.nome}</div>
                                  <div className="text-sm text-muted-foreground">{etapa.descricao}</div>
                                </div>
                              </div>
                              <Badge variant={etapa.status === 'Concluída' ? 'default' : 'secondary'}>
                                {etapa.status}
                              </Badge>
                            </div>
                            
                            {etapa.parametros.length > 0 && (
                              <div className="grid grid-cols-3 gap-4 mt-3">
                                {etapa.parametros.map((param, idx) => (
                                  <div key={idx} className="bg-muted/50 p-2 rounded">
                                    <div className="text-xs text-muted-foreground">{param.nome}</div>
                                    <div className="font-medium">{param.valor} {param.unidade}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="instrucoes" className="space-y-4">
                        {ordemSelecionada.etapas.filter(e => e.status === 'Em Execução' || e.status === 'Pendente').map(etapa => (
                          <div key={etapa.id} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">{etapa.nome}</h4>
                            <div className="space-y-2">
                              <div>
                                <h5 className="text-sm font-medium text-muted-foreground mb-2">Instruções:</h5>
                                <ul className="space-y-1">
                                  {etapa.instrucoes.map((instrucao, idx) => (
                                    <li key={idx} className="text-sm flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                      {instrucao}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {etapa.verificacoes.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium text-muted-foreground mb-2">Verificações:</h5>
                                  <div className="space-y-1">
                                    {etapa.verificacoes.map((verificacao, idx) => (
                                      <div key={idx} className="flex items-center gap-2 text-sm">
                                        {verificacao.status ? (
                                          <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                          <Clock className="w-4 h-4 text-yellow-500" />
                                        )}
                                        {verificacao.item}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Alertas */}
                {ordemSelecionada.alertas.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        Alertas Ativos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {ordemSelecionada.alertas.map((alerta, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">{alerta}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecucaoOperacional;