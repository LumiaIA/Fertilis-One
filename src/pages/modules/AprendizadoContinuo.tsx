import { useState, useEffect } from "react";
import { ArrowLeft, Brain, TrendingUp, BookOpen, Target, Lightbulb, CheckCircle, Clock, Star, BarChart3, Users, Zap, RefreshCw, Download, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Aprendizado {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'otimizacao' | 'qualidade' | 'eficiencia' | 'manutencao' | 'seguranca';
  fonte: 'ia_automatica' | 'feedback_operador' | 'analise_dados' | 'benchmark';
  impacto: number;
  confianca: number;
  status: 'proposto' | 'em_teste' | 'aprovado' | 'implementado' | 'rejeitado';
  dataIdentificacao: string;
  dataImplementacao?: string;
  responsavel: string;
  metricas: {
    antes: { nome: string; valor: number; unidade: string }[];
    depois?: { nome: string; valor: number; unidade: string }[];
  };
  feedback: FeedbackItem[];
}

interface FeedbackItem {
  id: string;
  usuario: string;
  cargo: string;
  avaliacao: 1 | 2 | 3 | 4 | 5;
  comentario: string;
  data: string;
  categoria: 'usabilidade' | 'eficacia' | 'implementacao' | 'resultado';
}

interface AlgoritmoIA {
  id: string;
  nome: string;
  versao: string;
  descricao: string;
  area: string;
  precisao: number;
  ultimaAtualizacao: string;
  melhorias: string[];
  proximaEvolucao: string;
  status: 'ativo' | 'treinando' | 'teste' | 'inativo';
}

interface SugestaoMelhoria {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  esforco: 'baixo' | 'medio' | 'alto';
  impactoEstimado: number;
  area: string;
  status: 'nova' | 'analisando' | 'aprovada' | 'em_desenvolvimento' | 'concluida';
  dataSubmissao: string;
  autor: string;
}

const AprendizadoContinuo = () => {
  const navigate = useNavigate();
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [novoFeedback, setNovoFeedback] = useState({
    categoria: 'eficacia' as const,
    avaliacao: 5 as const,
    comentario: ''
  });

  const [aprendizados, setAprendizados] = useState<Aprendizado[]>([
    {
      id: 'APR-001',
      titulo: 'Otimização de Sequenciamento NPK',
      descricao: 'IA identificou padrão que reduz tempo de setup em 15% ao agrupar produtos similares',
      categoria: 'otimizacao',
      fonte: 'ia_automatica',
      impacto: 15.2,
      confianca: 94,
      status: 'implementado',
      dataIdentificacao: '2024-01-10',
      dataImplementacao: '2024-01-12',
      responsavel: 'Sistema IA - Motor Sequenciamento',
      metricas: {
        antes: [
          { nome: 'Tempo Setup Médio', valor: 45, unidade: 'min' },
          { nome: 'Eficiência Linha', valor: 82, unidade: '%' }
        ],
        depois: [
          { nome: 'Tempo Setup Médio', valor: 38, unidade: 'min' },
          { nome: 'Eficiência Linha', valor: 89, unidade: '%' }
        ]
      },
      feedback: [
        {
          id: 'FB-001',
          usuario: 'João Silva',
          cargo: 'Supervisor Produção',
          avaliacao: 5,
          comentario: 'Excelente melhoria! Notamos redução significativa nos tempos mortos.',
          data: '2024-01-13',
          categoria: 'resultado'
        },
        {
          id: 'FB-002',
          usuario: 'Maria Santos',
          cargo: 'Operadora',
          avaliacao: 4,
          comentario: 'Implementação foi suave, mas precisou de alguns ajustes iniciais.',
          data: '2024-01-14',
          categoria: 'implementacao'
        }
      ]
    },
    {
      id: 'APR-002',
      titulo: 'Predição de Falhas em Equipamentos',
      descricao: 'Algoritmo de ML detecta padrões que indicam necessidade de manutenção preventiva',
      categoria: 'manutencao',
      fonte: 'analise_dados',
      impacto: 28.5,
      confianca: 87,
      status: 'em_teste',
      dataIdentificacao: '2024-01-08',
      responsavel: 'Equipe Data Science',
      metricas: {
        antes: [
          { nome: 'Paradas Não Planejadas', valor: 12, unidade: 'por mês' },
          { nome: 'Custo Manutenção', valor: 45000, unidade: 'R$/mês' }
        ]
      },
      feedback: [
        {
          id: 'FB-003',
          usuario: 'Carlos Mendes',
          cargo: 'Técnico Manutenção',
          avaliacao: 4,
          comentario: 'Alertas estão sendo precisos, mas ainda temos alguns falsos positivos.',
          data: '2024-01-15',
          categoria: 'eficacia'
        }
      ]
    },
    {
      id: 'APR-003',
      titulo: 'Controle Automático de pH',
      descricao: 'Sistema aprende padrões de ajuste de pH baseado em feedback dos operadores',
      categoria: 'qualidade',
      fonte: 'feedback_operador',
      impacto: 12.8,
      confianca: 91,
      status: 'aprovado',
      dataIdentificacao: '2024-01-05',
      responsavel: 'Ana Silva - Controle Qualidade',
      metricas: {
        antes: [
          { nome: 'Desvios pH', valor: 8, unidade: 'por dia' },
          { nome: 'Retrabalho', valor: 3.2, unidade: '%' }
        ]
      },
      feedback: [
        {
          id: 'FB-004',
          usuario: 'Ana Silva',
          cargo: 'Analista Qualidade',
          avaliacao: 5,
          comentario: 'Sistema está aprendendo bem com nossos ajustes manuais.',
          data: '2024-01-12',
          categoria: 'usabilidade'
        }
      ]
    }
  ]);

  const [algoritmosIA, setAlgoritmosIA] = useState<AlgoritmoIA[]>([
    {
      id: 'ALG-001',
      nome: 'Otimizador de Sequenciamento',
      versao: '2.3.1',
      descricao: 'Algoritmo genético para otimização de sequência de produção',
      area: 'Planejamento',
      precisao: 94.2,
      ultimaAtualizacao: '2024-01-12',
      melhorias: [
        'Redução de 15% no tempo de setup',
        'Melhoria de 7% na eficiência geral',
        'Redução de 23% em trocas de linha'
      ],
      proximaEvolucao: '2024-01-20',
      status: 'ativo'
    },
    {
      id: 'ALG-002',
      nome: 'Preditor de Demanda',
      versao: '1.8.4',
      descricao: 'Rede neural para previsão de demanda de produtos',
      area: 'Comercial',
      precisao: 89.7,
      ultimaAtualizacao: '2024-01-10',
      melhorias: [
        'Melhoria de 12% na precisão de previsão',
        'Redução de 18% em excesso de estoque',
        'Aumento de 8% no nível de serviço'
      ],
      proximaEvolucao: '2024-01-25',
      status: 'treinando'
    },
    {
      id: 'ALG-003',
      nome: 'Detector de Anomalias',
      versao: '3.1.0',
      descricao: 'Sistema de detecção de anomalias em tempo real',
      area: 'Qualidade',
      precisao: 96.8,
      ultimaAtualizacao: '2024-01-14',
      melhorias: [
        'Redução de 45% em falsos positivos',
        'Detecção 30% mais rápida de problemas',
        'Melhoria de 25% na precisão geral'
      ],
      proximaEvolucao: '2024-01-18',
      status: 'ativo'
    }
  ]);

  const [sugestoes, setSugestoes] = useState<SugestaoMelhoria[]>([
    {
      id: 'SUG-001',
      titulo: 'Interface Simplificada para Operadores +50',
      descricao: 'Criar interface com botões maiores e navegação mais intuitiva para operadores mais experientes',
      prioridade: 'alta',
      esforco: 'medio',
      impactoEstimado: 20,
      area: 'UX/UI',
      status: 'aprovada',
      dataSubmissao: '2024-01-08',
      autor: 'Maria Santos - Operadora'
    },
    {
      id: 'SUG-002',
      titulo: 'Alertas Sonoros Configuráveis',
      descricao: 'Permitir configuração de diferentes tipos de alertas sonoros para diferentes situações',
      prioridade: 'media',
      esforco: 'baixo',
      impactoEstimado: 15,
      area: 'Sistema',
      status: 'em_desenvolvimento',
      dataSubmissao: '2024-01-10',
      autor: 'Carlos Mendes - Supervisor'
    },
    {
      id: 'SUG-003',
      titulo: 'Dashboard Personalizado por Turno',
      descricao: 'Criar dashboards específicos para cada turno com KPIs relevantes',
      prioridade: 'media',
      esforco: 'alto',
      impactoEstimado: 25,
      area: 'Analytics',
      status: 'analisando',
      dataSubmissao: '2024-01-12',
      autor: 'João Silva - Supervisor'
    }
  ]);

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'otimizacao': return 'bg-blue-100 text-blue-800';
      case 'qualidade': return 'bg-green-100 text-green-800';
      case 'eficiencia': return 'bg-purple-100 text-purple-800';
      case 'manutencao': return 'bg-orange-100 text-orange-800';
      case 'seguranca': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implementado': return 'bg-green-100 text-green-800';
      case 'aprovado': return 'bg-blue-100 text-blue-800';
      case 'em_teste': return 'bg-yellow-100 text-yellow-800';
      case 'proposto': return 'bg-gray-100 text-gray-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'critica': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusAlgoritmo = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'treinando': return 'bg-blue-100 text-blue-800';
      case 'teste': return 'bg-yellow-100 text-yellow-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const aprendizadosFiltrados = aprendizados.filter(a => {
    const categoriaMatch = filtroCategoria === 'todas' || a.categoria === filtroCategoria;
    const statusMatch = filtroStatus === 'todos' || a.status === filtroStatus;
    return categoriaMatch && statusMatch;
  });

  const submeterFeedback = () => {
    if (!novoFeedback.comentario.trim()) return;
    
    // Simular submissão de feedback
    console.log('Feedback submetido:', novoFeedback);
    setNovoFeedback({ categoria: 'eficacia', avaliacao: 5, comentario: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Aprendizado Contínuo
              </h1>
              <p className="text-muted-foreground mt-1">Sistema de feedback estruturado e evolução automática de algoritmos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Relatório
            </Button>
          </div>
        </div>

        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">47</div>
                  <div className="text-sm text-muted-foreground">Aprendizados Ativos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">18.5%</div>
                  <div className="text-sm text-muted-foreground">Melhoria Média</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Feedbacks Recebidos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">92.3%</div>
                  <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="aprendizados" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="aprendizados">Aprendizados</TabsTrigger>
            <TabsTrigger value="algoritmos">Algoritmos IA</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="sugestoes">Sugestões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="aprendizados" className="space-y-6">
            {/* Filtros */}
            <div className="flex items-center gap-4">
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Categorias</SelectItem>
                  <SelectItem value="otimizacao">Otimização</SelectItem>
                  <SelectItem value="qualidade">Qualidade</SelectItem>
                  <SelectItem value="eficiencia">Eficiência</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="seguranca">Segurança</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="proposto">Proposto</SelectItem>
                  <SelectItem value="em_teste">Em Teste</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="implementado">Implementado</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Lista de Aprendizados */}
            <div className="space-y-4">
              {aprendizadosFiltrados.map(aprendizado => (
                <Card key={aprendizado.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{aprendizado.titulo}</CardTitle>
                        <Badge className={getCategoriaColor(aprendizado.categoria)}>
                          {aprendizado.categoria}
                        </Badge>
                        <Badge className={getStatusColor(aprendizado.status)}>
                          {aprendizado.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">+{aprendizado.impacto}%</div>
                          <div className="text-xs text-muted-foreground">Impacto</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{aprendizado.confianca}%</div>
                          <div className="text-xs text-muted-foreground">Confiança</div>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{aprendizado.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Métricas */}
                      <div>
                        <h4 className="font-medium mb-3">Métricas de Impacto</h4>
                        <div className="space-y-3">
                          {aprendizado.metricas.antes.map((metrica, index) => {
                            const depois = aprendizado.metricas.depois?.[index];
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm font-medium">{metrica.nome}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">
                                    {metrica.valor} {metrica.unidade}
                                  </span>
                                  {depois && (
                                    <>
                                      <span className="text-sm text-muted-foreground">→</span>
                                      <span className="text-sm font-medium text-green-600">
                                        {depois.valor} {depois.unidade}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Feedback */}
                      <div>
                        <h4 className="font-medium mb-3">Feedback dos Usuários</h4>
                        <div className="space-y-3">
                          {aprendizado.feedback.map(fb => (
                            <div key={fb.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{fb.usuario}</span>
                                  <span className="text-xs text-muted-foreground">({fb.cargo})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {renderStars(fb.avaliacao)}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{fb.comentario}</p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {fb.categoria}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{fb.data}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div>Responsável: {aprendizado.responsavel}</div>
                        <div>Identificado em: {aprendizado.dataIdentificacao}</div>
                        {aprendizado.dataImplementacao && (
                          <div>Implementado em: {aprendizado.dataImplementacao}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="algoritmos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {algoritmosIA.map(algoritmo => (
                <Card key={algoritmo.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{algoritmo.nome}</CardTitle>
                      <Badge className={getStatusAlgoritmo(algoritmo.status)}>
                        {algoritmo.status}
                      </Badge>
                    </div>
                    <CardDescription>{algoritmo.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Versão</span>
                        <span className="font-medium">{algoritmo.versao}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Área</span>
                        <span className="font-medium">{algoritmo.area}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Precisão</span>
                          <span className="font-medium">{algoritmo.precisao}%</span>
                        </div>
                        <Progress value={algoritmo.precisao} className="h-2" />
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Melhorias Recentes</h5>
                        <ul className="space-y-1">
                          {algoritmo.melhorias.map((melhoria, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {melhoria}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Última atualização: {algoritmo.ultimaAtualizacao}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>Próxima evolução: {algoritmo.proximaEvolucao}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="feedback" className="space-y-6">
            {/* Formulário de Novo Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Enviar Feedback</CardTitle>
                <CardDescription>
                  Compartilhe sua experiência para ajudar na melhoria contínua do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={novoFeedback.categoria} onValueChange={(value: any) => setNovoFeedback(prev => ({ ...prev, categoria: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usabilidade">Usabilidade</SelectItem>
                        <SelectItem value="eficacia">Eficácia</SelectItem>
                        <SelectItem value="implementacao">Implementação</SelectItem>
                        <SelectItem value="resultado">Resultado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="avaliacao">Avaliação</Label>
                    <Select value={novoFeedback.avaliacao.toString()} onValueChange={(value) => setNovoFeedback(prev => ({ ...prev, avaliacao: parseInt(value) as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Muito Ruim</SelectItem>
                        <SelectItem value="2">2 - Ruim</SelectItem>
                        <SelectItem value="3">3 - Regular</SelectItem>
                        <SelectItem value="4">4 - Bom</SelectItem>
                        <SelectItem value="5">5 - Excelente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="comentario">Comentário</Label>
                  <Textarea
                    id="comentario"
                    placeholder="Descreva sua experiência, sugestões ou observações..."
                    value={novoFeedback.comentario}
                    onChange={(e) => setNovoFeedback(prev => ({ ...prev, comentario: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button onClick={submeterFeedback} disabled={!novoFeedback.comentario.trim()}>
                  Enviar Feedback
                </Button>
              </CardContent>
            </Card>
            
            {/* Estatísticas de Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">4.6</div>
                  <div className="text-sm text-muted-foreground">Avaliação Média</div>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(5)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Total de Feedbacks</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-sm text-muted-foreground">Satisfação Geral</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-sm text-muted-foreground">Melhorias Implementadas</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sugestoes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sugestões de Melhoria</h3>
              <Button>
                Nova Sugestão
              </Button>
            </div>
            
            <div className="space-y-4">
              {sugestoes.map(sugestao => (
                <Card key={sugestao.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{sugestao.titulo}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getPrioridadeColor(sugestao.prioridade)}>
                          {sugestao.prioridade}
                        </Badge>
                        <Badge variant="outline">
                          {sugestao.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{sugestao.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Esforço</div>
                        <div className="font-medium capitalize">{sugestao.esforco}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Impacto Estimado</div>
                        <div className="font-medium text-green-600">+{sugestao.impactoEstimado}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Área</div>
                        <div className="font-medium">{sugestao.area}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Autor</div>
                        <div className="font-medium">{sugestao.autor}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Submetida em: {sugestao.dataSubmissao}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AprendizadoContinuo;