import { useState, useEffect } from "react";
import { ArrowLeft, Settings, Globe, Users, Factory, Clock, Palette, Database, Shield, Zap, Plus, Edit, Trash2, Save, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Planta {
  id: string;
  nome: string;
  localizacao: string;
  capacidadeProducao: number;
  status: 'ativa' | 'manutencao' | 'inativa';
  linhasProducao: LinhaProducao[];
  turnos: Turno[];
  configuracoes: ConfiguracaoPlanta;
  dataInstalacao: string;
  responsavel: string;
}

interface LinhaProducao {
  id: string;
  nome: string;
  tipo: 'npk' | 'organico' | 'liquido' | 'granulado';
  capacidadeHora: number;
  status: 'operando' | 'parada' | 'manutencao';
  equipamentos: string[];
  operadores: string[];
  configuracoes: ConfiguracaoLinha;
}

interface Turno {
  id: string;
  nome: string;
  horaInicio: string;
  horaFim: string;
  diasSemana: string[];
  supervisor: string;
  operadores: string[];
  ativo: boolean;
}

interface ConfiguracaoPlanta {
  idioma: string;
  timezone: string;
  moeda: string;
  unidadeMedida: string;
  temaInterface: 'claro' | 'escuro' | 'auto';
  notificacoes: {
    email: boolean;
    sms: boolean;
    push: boolean;
    sonoro: boolean;
  };
  backup: {
    frequencia: 'diario' | 'semanal' | 'mensal';
    retencao: number;
    automatico: boolean;
  };
}

interface ConfiguracaoLinha {
  parametrosQualidade: {
    ph: { min: number; max: number };
    umidade: { min: number; max: number };
    granulometria: { min: number; max: number };
  };
  alertas: {
    temperaturaAlta: number;
    pressaoBaixa: number;
    velocidadeBaixa: number;
  };
  manutencao: {
    preventiva: number; // dias
    preditiva: boolean;
    alertaAntecipado: number; // horas
  };
}

interface ConfiguracaoSistema {
  id: string;
  categoria: 'interface' | 'seguranca' | 'integracao' | 'performance';
  nome: string;
  descricao: string;
  valor: any;
  tipo: 'boolean' | 'string' | 'number' | 'select';
  opcoes?: string[];
  requerReinicio: boolean;
}

const EscalabilidadePersonalizacao = () => {
  const navigate = useNavigate();
  const [abaSelecionada, setAbaSelecionada] = useState('plantas');
  const [plantaSelecionada, setPlantaSelecionada] = useState<string>('');
  const [editandoPlanta, setEditandoPlanta] = useState<string | null>(null);
  const [novaPlanta, setNovaPlanta] = useState({
    nome: '',
    localizacao: '',
    capacidadeProducao: 0,
    responsavel: ''
  });
  const [dialogNovaPlanta, setDialogNovaPlanta] = useState(false);

  const [plantas, setPlantas] = useState<Planta[]>([
    {
      id: 'PLT-001',
      nome: 'Planta Matriz - São Paulo',
      localizacao: 'São Paulo, SP',
      capacidadeProducao: 50000,
      status: 'ativa',
      dataInstalacao: '2020-03-15',
      responsavel: 'João Silva',
      linhasProducao: [
        {
          id: 'LN-001',
          nome: 'Linha NPK Principal',
          tipo: 'npk',
          capacidadeHora: 2500,
          status: 'operando',
          equipamentos: ['Misturador M1', 'Granulador G1', 'Secador S1'],
          operadores: ['Maria Santos', 'Carlos Mendes'],
          configuracoes: {
            parametrosQualidade: {
              ph: { min: 6.0, max: 7.5 },
              umidade: { min: 2.0, max: 4.0 },
              granulometria: { min: 2.0, max: 4.0 }
            },
            alertas: {
              temperaturaAlta: 85,
              pressaoBaixa: 2.5,
              velocidadeBaixa: 80
            },
            manutencao: {
              preventiva: 30,
              preditiva: true,
              alertaAntecipado: 24
            }
          }
        },
        {
          id: 'LN-002',
          nome: 'Linha Orgânico',
          tipo: 'organico',
          capacidadeHora: 1800,
          status: 'operando',
          equipamentos: ['Misturador M2', 'Peletizadora P1'],
          operadores: ['Ana Silva', 'Pedro Costa'],
          configuracoes: {
            parametrosQualidade: {
              ph: { min: 6.5, max: 8.0 },
              umidade: { min: 8.0, max: 12.0 },
              granulometria: { min: 3.0, max: 6.0 }
            },
            alertas: {
              temperaturaAlta: 70,
              pressaoBaixa: 2.0,
              velocidadeBaixa: 70
            },
            manutencao: {
              preventiva: 21,
              preditiva: true,
              alertaAntecipado: 12
            }
          }
        }
      ],
      turnos: [
        {
          id: 'T-001',
          nome: 'Turno Manhã',
          horaInicio: '06:00',
          horaFim: '14:00',
          diasSemana: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
          supervisor: 'João Silva',
          operadores: ['Maria Santos', 'Carlos Mendes'],
          ativo: true
        },
        {
          id: 'T-002',
          nome: 'Turno Tarde',
          horaInicio: '14:00',
          horaFim: '22:00',
          diasSemana: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
          supervisor: 'Ana Silva',
          operadores: ['Pedro Costa', 'Lucia Oliveira'],
          ativo: true
        },
        {
          id: 'T-003',
          nome: 'Turno Noite',
          horaInicio: '22:00',
          horaFim: '06:00',
          diasSemana: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
          supervisor: 'Roberto Lima',
          operadores: ['Fernando Santos'],
          ativo: true
        }
      ],
      configuracoes: {
        idioma: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        moeda: 'BRL',
        unidadeMedida: 'metric',
        temaInterface: 'claro',
        notificacoes: {
          email: true,
          sms: true,
          push: true,
          sonoro: true
        },
        backup: {
          frequencia: 'diario',
          retencao: 30,
          automatico: true
        }
      }
    },
    {
      id: 'PLT-002',
      nome: 'Planta Norte - Manaus',
      localizacao: 'Manaus, AM',
      capacidadeProducao: 30000,
      status: 'ativa',
      dataInstalacao: '2021-08-20',
      responsavel: 'Ana Silva',
      linhasProducao: [
        {
          id: 'LN-003',
          nome: 'Linha Líquido',
          tipo: 'liquido',
          capacidadeHora: 1200,
          status: 'operando',
          equipamentos: ['Reator R1', 'Bomba B1', 'Filtro F1'],
          operadores: ['Roberto Lima', 'Lucia Oliveira'],
          configuracoes: {
            parametrosQualidade: {
              ph: { min: 5.5, max: 7.0 },
              umidade: { min: 0, max: 0 },
              granulometria: { min: 0, max: 0 }
            },
            alertas: {
              temperaturaAlta: 60,
              pressaoBaixa: 3.0,
              velocidadeBaixa: 90
            },
            manutencao: {
              preventiva: 15,
              preditiva: true,
              alertaAntecipado: 8
            }
          }
        }
      ],
      turnos: [
        {
          id: 'T-004',
          nome: 'Turno Integral',
          horaInicio: '07:00',
          horaFim: '19:00',
          diasSemana: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
          supervisor: 'Roberto Lima',
          operadores: ['Lucia Oliveira', 'Fernando Santos'],
          ativo: true
        }
      ],
      configuracoes: {
        idioma: 'pt-BR',
        timezone: 'America/Manaus',
        moeda: 'BRL',
        unidadeMedida: 'metric',
        temaInterface: 'claro',
        notificacoes: {
          email: true,
          sms: false,
          push: true,
          sonoro: true
        },
        backup: {
          frequencia: 'semanal',
          retencao: 60,
          automatico: true
        }
      }
    }
  ]);

  const [configuracoesSistema, setConfiguracoesSistema] = useState<ConfiguracaoSistema[]>([
    {
      id: 'CFG-001',
      categoria: 'interface',
      nome: 'Tamanho da Fonte',
      descricao: 'Tamanho padrão da fonte para melhor legibilidade',
      valor: 'grande',
      tipo: 'select',
      opcoes: ['pequeno', 'medio', 'grande', 'extra-grande'],
      requerReinicio: false
    },
    {
      id: 'CFG-002',
      categoria: 'interface',
      nome: 'Contraste Alto',
      descricao: 'Ativar modo de alto contraste para melhor visibilidade',
      valor: true,
      tipo: 'boolean',
      requerReinicio: false
    },
    {
      id: 'CFG-003',
      categoria: 'interface',
      nome: 'Animações',
      descricao: 'Habilitar animações na interface',
      valor: false,
      tipo: 'boolean',
      requerReinicio: false
    },
    {
      id: 'CFG-004',
      categoria: 'seguranca',
      nome: 'Timeout de Sessão',
      descricao: 'Tempo limite de inatividade em minutos',
      valor: 30,
      tipo: 'number',
      requerReinicio: false
    },
    {
      id: 'CFG-005',
      categoria: 'seguranca',
      nome: 'Autenticação Dupla',
      descricao: 'Exigir autenticação em duas etapas',
      valor: true,
      tipo: 'boolean',
      requerReinicio: true
    },
    {
      id: 'CFG-006',
      categoria: 'integracao',
      nome: 'API Rate Limit',
      descricao: 'Limite de requisições por minuto',
      valor: 1000,
      tipo: 'number',
      requerReinicio: true
    },
    {
      id: 'CFG-007',
      categoria: 'performance',
      nome: 'Cache Duration',
      descricao: 'Duração do cache em segundos',
      valor: 300,
      tipo: 'number',
      requerReinicio: false
    },
    {
      id: 'CFG-008',
      categoria: 'interface',
      nome: 'Idioma Padrão',
      descricao: 'Idioma padrão do sistema',
      valor: 'pt-BR',
      tipo: 'select',
      opcoes: ['pt-BR', 'en-US', 'es-ES', 'fr-FR'],
      requerReinicio: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa':
      case 'operando':
        return 'bg-green-100 text-green-800';
      case 'manutencao':
        return 'bg-yellow-100 text-yellow-800';
      case 'inativa':
      case 'parada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLinhaColor = (tipo: string) => {
    switch (tipo) {
      case 'npk': return 'bg-blue-100 text-blue-800';
      case 'organico': return 'bg-green-100 text-green-800';
      case 'liquido': return 'bg-purple-100 text-purple-800';
      case 'granulado': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'interface': return 'bg-blue-100 text-blue-800';
      case 'seguranca': return 'bg-red-100 text-red-800';
      case 'integracao': return 'bg-purple-100 text-purple-800';
      case 'performance': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const criarNovaPlanta = () => {
    if (!novaPlanta.nome || !novaPlanta.localizacao || !novaPlanta.responsavel) return;
    
    const nova: Planta = {
      id: `PLT-${String(plantas.length + 1).padStart(3, '0')}`,
      nome: novaPlanta.nome,
      localizacao: novaPlanta.localizacao,
      capacidadeProducao: novaPlanta.capacidadeProducao,
      status: 'ativa',
      dataInstalacao: new Date().toISOString().split('T')[0],
      responsavel: novaPlanta.responsavel,
      linhasProducao: [],
      turnos: [],
      configuracoes: {
        idioma: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        moeda: 'BRL',
        unidadeMedida: 'metric',
        temaInterface: 'claro',
        notificacoes: {
          email: true,
          sms: true,
          push: true,
          sonoro: true
        },
        backup: {
          frequencia: 'diario',
          retencao: 30,
          automatico: true
        }
      }
    };
    
    setPlantas([...plantas, nova]);
    setNovaPlanta({ nome: '', localizacao: '', capacidadeProducao: 0, responsavel: '' });
    setDialogNovaPlanta(false);
  };

  const atualizarConfiguracao = (id: string, novoValor: any) => {
    setConfiguracoesSistema(prev => 
      prev.map(config => 
        config.id === id ? { ...config, valor: novoValor } : config
      )
    );
  };

  const plantaAtual = plantas.find(p => p.id === plantaSelecionada) || plantas[0];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Escalabilidade & Personalização
              </h1>
              <p className="text-muted-foreground mt-1">Configuração de plantas, linhas de produção e personalização do sistema</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Database className="w-4 h-4 mr-2" />
              Backup
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Segurança
            </Button>
          </div>
        </div>

        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <Factory className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{plantas.length}</div>
                  <div className="text-sm text-muted-foreground">Plantas Ativas</div>
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
                  <div className="text-2xl font-bold">{plantas.reduce((acc, p) => acc + p.linhasProducao.length, 0)}</div>
                  <div className="text-sm text-muted-foreground">Linhas de Produção</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{plantas.reduce((acc, p) => acc + p.turnos.length, 0)}</div>
                  <div className="text-sm text-muted-foreground">Turnos Configurados</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-sm text-muted-foreground">Idiomas Suportados</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="plantas">Plantas</TabsTrigger>
            <TabsTrigger value="linhas">Linhas de Produção</TabsTrigger>
            <TabsTrigger value="turnos">Turnos</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plantas" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Plantas Registradas</h3>
              <Dialog open={dialogNovaPlanta} onOpenChange={setDialogNovaPlanta}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Planta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Nova Planta</DialogTitle>
                    <DialogDescription>
                      Adicione uma nova planta ao sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome da Planta</Label>
                      <Input
                        id="nome"
                        value={novaPlanta.nome}
                        onChange={(e) => setNovaPlanta(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Ex: Planta Sul - Curitiba"
                      />
                    </div>
                    <div>
                      <Label htmlFor="localizacao">Localização</Label>
                      <Input
                        id="localizacao"
                        value={novaPlanta.localizacao}
                        onChange={(e) => setNovaPlanta(prev => ({ ...prev, localizacao: e.target.value }))}
                        placeholder="Ex: Curitiba, PR"
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacidade">Capacidade de Produção (ton/mês)</Label>
                      <Input
                        id="capacidade"
                        type="number"
                        value={novaPlanta.capacidadeProducao}
                        onChange={(e) => setNovaPlanta(prev => ({ ...prev, capacidadeProducao: parseInt(e.target.value) || 0 }))}
                        placeholder="Ex: 25000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="responsavel">Responsável</Label>
                      <Input
                        id="responsavel"
                        value={novaPlanta.responsavel}
                        onChange={(e) => setNovaPlanta(prev => ({ ...prev, responsavel: e.target.value }))}
                        placeholder="Ex: João Silva"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setDialogNovaPlanta(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={criarNovaPlanta}>
                        Criar Planta
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {plantas.map(planta => (
                <Card key={planta.id} className={plantaSelecionada === planta.id ? 'ring-2 ring-primary' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{planta.nome}</CardTitle>
                        <Badge className={getStatusColor(planta.status)}>
                          {planta.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setPlantaSelecionada(planta.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{planta.localizacao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Capacidade</div>
                          <div className="font-medium">{planta.capacidadeProducao.toLocaleString()} ton/mês</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Linhas</div>
                          <div className="font-medium">{planta.linhasProducao.length}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Turnos</div>
                          <div className="font-medium">{planta.turnos.length}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Responsável</div>
                          <div className="font-medium">{planta.responsavel}</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Configurações</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Idioma: {planta.configuracoes.idioma}</div>
                          <div>Timezone: {planta.configuracoes.timezone.split('/')[1]}</div>
                          <div>Tema: {planta.configuracoes.temaInterface}</div>
                          <div>Backup: {planta.configuracoes.backup.frequencia}</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Instalada em: {planta.dataInstalacao}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="linhas" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Linhas de Produção</h3>
                <p className="text-sm text-muted-foreground">Planta: {plantaAtual?.nome}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={plantaSelecionada} onValueChange={setPlantaSelecionada}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecionar planta" />
                  </SelectTrigger>
                  <SelectContent>
                    {plantas.map(planta => (
                      <SelectItem key={planta.id} value={planta.id}>
                        {planta.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Linha
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {plantaAtual?.linhasProducao.map(linha => (
                <Card key={linha.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{linha.nome}</CardTitle>
                        <Badge className={getTipoLinhaColor(linha.tipo)}>
                          {linha.tipo.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(linha.status)}>
                          {linha.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Capacidade</div>
                        <div className="font-medium">{linha.capacidadeHora} kg/h</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Equipamentos</div>
                        <div className="flex flex-wrap gap-1">
                          {linha.equipamentos.map((equip, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {equip}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Operadores</div>
                        <div className="flex flex-wrap gap-1">
                          {linha.operadores.map((op, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {op}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Parâmetros de Qualidade</div>
                        <div className="space-y-1 text-xs">
                          <div>pH: {linha.configuracoes.parametrosQualidade.ph.min} - {linha.configuracoes.parametrosQualidade.ph.max}</div>
                          {linha.configuracoes.parametrosQualidade.umidade.max > 0 && (
                            <div>Umidade: {linha.configuracoes.parametrosQualidade.umidade.min}% - {linha.configuracoes.parametrosQualidade.umidade.max}%</div>
                          )}
                          {linha.configuracoes.parametrosQualidade.granulometria.max > 0 && (
                            <div>Granulometria: {linha.configuracoes.parametrosQualidade.granulometria.min}mm - {linha.configuracoes.parametrosQualidade.granulometria.max}mm</div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Manutenção</div>
                        <div className="space-y-1 text-xs">
                          <div>Preventiva: a cada {linha.configuracoes.manutencao.preventiva} dias</div>
                          <div>Preditiva: {linha.configuracoes.manutencao.preditiva ? 'Ativa' : 'Inativa'}</div>
                          <div>Alerta: {linha.configuracoes.manutencao.alertaAntecipado}h antes</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="turnos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Turnos de Trabalho</h3>
                <p className="text-sm text-muted-foreground">Planta: {plantaAtual?.nome}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={plantaSelecionada} onValueChange={setPlantaSelecionada}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecionar planta" />
                  </SelectTrigger>
                  <SelectContent>
                    {plantas.map(planta => (
                      <SelectItem key={planta.id} value={planta.id}>
                        {planta.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Turno
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {plantaAtual?.turnos.map(turno => (
                <Card key={turno.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{turno.nome}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={turno.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {turno.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Início</div>
                          <div className="font-medium">{turno.horaInicio}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Fim</div>
                          <div className="font-medium">{turno.horaFim}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Dias da Semana</div>
                        <div className="flex flex-wrap gap-1">
                          {turno.diasSemana.map((dia, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {dia.substring(0, 3)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Supervisor</div>
                        <div className="font-medium">{turno.supervisor}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Operadores</div>
                        <div className="space-y-1">
                          {turno.operadores.map((op, index) => (
                            <div key={index} className="text-sm">{op}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="configuracoes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Configurações do Sistema</h3>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {['interface', 'seguranca', 'integracao', 'performance'].map(categoria => (
                <Card key={categoria}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {categoria === 'interface' && <Palette className="w-5 h-5" />}
                      {categoria === 'seguranca' && <Shield className="w-5 h-5" />}
                      {categoria === 'integracao' && <Globe className="w-5 h-5" />}
                      {categoria === 'performance' && <Zap className="w-5 h-5" />}
                      {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {configuracoesSistema
                        .filter(config => config.categoria === categoria)
                        .map(config => (
                          <div key={config.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm font-medium">{config.nome}</Label>
                                <p className="text-xs text-muted-foreground">{config.descricao}</p>
                              </div>
                              {config.requerReinicio && (
                                <Badge variant="outline" className="text-xs">
                                  Requer reinício
                                </Badge>
                              )}
                            </div>
                            
                            {config.tipo === 'boolean' && (
                              <Switch
                                checked={config.valor}
                                onCheckedChange={(checked) => atualizarConfiguracao(config.id, checked)}
                              />
                            )}
                            
                            {config.tipo === 'string' && (
                              <Input
                                value={config.valor}
                                onChange={(e) => atualizarConfiguracao(config.id, e.target.value)}
                              />
                            )}
                            
                            {config.tipo === 'number' && (
                              <Input
                                type="number"
                                value={config.valor}
                                onChange={(e) => atualizarConfiguracao(config.id, parseInt(e.target.value) || 0)}
                              />
                            )}
                            
                            {config.tipo === 'select' && config.opcoes && (
                              <Select value={config.valor} onValueChange={(value) => atualizarConfiguracao(config.id, value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {config.opcoes.map(opcao => (
                                    <SelectItem key={opcao} value={opcao}>
                                      {opcao}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        ))
                      }
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

export default EscalabilidadePersonalizacao;