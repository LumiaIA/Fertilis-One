import { useState, useEffect } from "react";
import { Search, MapPin, Clock, Package, Truck, Factory, Users, QrCode, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EventoRastreabilidade {
  id: string;
  timestamp: string;
  tipo: 'producao' | 'transporte' | 'armazenamento' | 'qualidade' | 'venda' | 'entrega';
  descricao: string;
  localizacao: string;
  responsavel: string;
  documento?: string;
  temperatura?: number;
  umidade?: number;
  coordenadas?: { lat: number; lng: number };
  observacoes?: string;
  hashBlockchain?: string;
}

interface ProdutoRastreado {
  id: string;
  codigo: string;
  nome: string;
  lote: string;
  dataProducao: string;
  dataValidade: string;
  status: 'em_producao' | 'em_transito' | 'armazenado' | 'entregue' | 'vendido';
  cliente?: string;
  fornecedorMateriaPrima: string;
  certificacoes: string[];
  eventos: EventoRastreabilidade[];
  qrCode: string;
  nfce?: string;
  peso: number;
  composicao: { componente: string; percentual: number }[];
}

const produtosIniciais: ProdutoRastreado[] = [
  {
    id: "PROD001",
    codigo: "NPK-10-10-10",
    nome: "Fertilizante NPK 10-10-10 Premium",
    lote: "NPK240115001",
    dataProducao: "2024-01-15",
    dataValidade: "2026-01-15",
    status: "entregue",
    cliente: "Fazenda São José - João Silva",
    fornecedorMateriaPrima: "Petrobras Fertilizantes",
    certificacoes: ["ISO 9001", "MAPA", "Orgânico Brasil"],
    qrCode: "QR240115001NPK",
    nfce: "NFCe-001234567",
    peso: 25,
    composicao: [
      { componente: "Nitrogênio (N)", percentual: 10 },
      { componente: "Fósforo (P2O5)", percentual: 10 },
      { componente: "Potássio (K2O)", percentual: 10 },
      { componente: "Outros nutrientes", percentual: 5 },
      { componente: "Material inerte", percentual: 65 }
    ],
    eventos: [
      {
        id: "EVT001",
        timestamp: "2024-01-15 08:00:00",
        tipo: "producao",
        descricao: "Início da produção do lote NPK240115001",
        localizacao: "Linha de Produção 1 - Unifertil",
        responsavel: "Carlos Mendes",
        documento: "OP-2024-001",
        temperatura: 25,
        umidade: 45,
        coordenadas: { lat: -23.5505, lng: -46.6333 },
        hashBlockchain: "0x1a2b3c4d5e6f7890abcdef1234567890"
      },
      {
        id: "EVT002",
        timestamp: "2024-01-15 14:30:00",
        tipo: "qualidade",
        descricao: "Teste de qualidade aprovado - Conformidade total",
        localizacao: "Laboratório de Qualidade - Unifertil",
        responsavel: "Dra. Maria Santos",
        documento: "LQ-2024-0156",
        temperatura: 22,
        umidade: 50,
        observacoes: "Todos os parâmetros dentro das especificações",
        hashBlockchain: "0x2b3c4d5e6f7890abcdef1234567890ab"
      },
      {
        id: "EVT003",
        timestamp: "2024-01-15 16:45:00",
        tipo: "armazenamento",
        descricao: "Produto armazenado no galpão de expedição",
        localizacao: "Galpão B - Setor Expedição",
        responsavel: "José Oliveira",
        temperatura: 24,
        umidade: 48,
        coordenadas: { lat: -23.5515, lng: -46.6343 },
        hashBlockchain: "0x3c4d5e6f7890abcdef1234567890abcd"
      },
      {
        id: "EVT004",
        timestamp: "2024-01-16 09:15:00",
        tipo: "transporte",
        descricao: "Carregamento para transporte - Destino: Fazenda São José",
        localizacao: "Doca de Carregamento - Unifertil",
        responsavel: "Transportadora LogiFert",
        documento: "CT-2024-0089",
        observacoes: "Veículo: Caminhão ABC-1234, Motorista: Pedro Costa",
        hashBlockchain: "0x4d5e6f7890abcdef1234567890abcdef"
      },
      {
        id: "EVT005",
        timestamp: "2024-01-16 15:30:00",
        tipo: "entrega",
        descricao: "Produto entregue ao cliente final",
        localizacao: "Fazenda São José - Ribeirão Preto/SP",
        responsavel: "João Silva (Cliente)",
        documento: "RE-2024-0045",
        coordenadas: { lat: -21.1775, lng: -47.8208 },
        observacoes: "Entrega realizada com sucesso, produto em perfeitas condições",
        hashBlockchain: "0x5e6f7890abcdef1234567890abcdef12"
      }
    ]
  },
  {
    id: "PROD002",
    codigo: "ORG-PREMIUM",
    nome: "Fertilizante Orgânico Premium",
    lote: "ORG240116001",
    dataProducao: "2024-01-16",
    dataValidade: "2025-01-16",
    status: "em_transito",
    cliente: "Cooperativa AgroVerde",
    fornecedorMateriaPrima: "Compostagem Natural Ltda",
    certificacoes: ["Orgânico Brasil", "IBD", "MAPA"],
    qrCode: "QR240116001ORG",
    peso: 20,
    composicao: [
      { componente: "Matéria Orgânica", percentual: 85 },
      { componente: "Nitrogênio (N)", percentual: 4 },
      { componente: "Fósforo (P2O5)", percentual: 3 },
      { componente: "Potássio (K2O)", percentual: 2 },
      { componente: "Micronutrientes", percentual: 6 }
    ],
    eventos: [
      {
        id: "EVT006",
        timestamp: "2024-01-16 07:30:00",
        tipo: "producao",
        descricao: "Início da produção do fertilizante orgânico",
        localizacao: "Linha Orgânica - Unifertil",
        responsavel: "Ana Paula",
        documento: "OP-2024-002",
        temperatura: 28,
        umidade: 55,
        hashBlockchain: "0x6f7890abcdef1234567890abcdef1234"
      },
      {
        id: "EVT007",
        timestamp: "2024-01-16 18:00:00",
        tipo: "transporte",
        descricao: "Em trânsito para Cooperativa AgroVerde",
        localizacao: "Rodovia SP-310, KM 245",
        responsavel: "Transportadora EcoLog",
        documento: "CT-2024-0090",
        coordenadas: { lat: -22.0154, lng: -47.8941 },
        observacoes: "Previsão de chegada: 17h30 de amanhã",
        hashBlockchain: "0x7890abcdef1234567890abcdef123456"
      }
    ]
  }
];

const RastreabilidadeCompleta = () => {
  const [produtos, setProdutos] = useState<ProdutoRastreado[]>(produtosIniciais);
  const [busca, setBusca] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoRastreado | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [metricas, setMetricas] = useState({
    totalProdutos: 1247,
    produtosRastreados: 1247,
    eventosRegistrados: 8934,
    certificacoesAtivas: 156,
    integridadeBlockchain: 100,
    tempoMedioRastreamento: 2.3
  });

  const produtosFiltrados = produtos.filter(produto => {
    const matchBusca = busca === '' || 
      produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      produto.lote.toLowerCase().includes(busca.toLowerCase()) ||
      produto.qrCode.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || produto.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_producao': return 'bg-accent-yellow text-foreground';
      case 'em_transito': return 'bg-primary text-white';
      case 'armazenado': return 'bg-muted text-foreground';
      case 'entregue': return 'bg-success text-white';
      case 'vendido': return 'bg-success text-white';
      default: return 'bg-muted';
    }
  };

  const getTipoEventoIcon = (tipo: string) => {
    switch (tipo) {
      case 'producao': return <Factory className="w-4 h-4" />;
      case 'transporte': return <Truck className="w-4 h-4" />;
      case 'armazenamento': return <Package className="w-4 h-4" />;
      case 'qualidade': return <Shield className="w-4 h-4" />;
      case 'venda': return <Users className="w-4 h-4" />;
      case 'entrega': return <MapPin className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTipoEventoColor = (tipo: string) => {
    switch (tipo) {
      case 'producao': return 'text-primary';
      case 'transporte': return 'text-accent-yellow';
      case 'armazenamento': return 'text-muted-foreground';
      case 'qualidade': return 'text-success';
      case 'venda': return 'text-success';
      case 'entrega': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const gerarRelatorioRastreabilidade = (produto: ProdutoRastreado) => {
    const dados = {
      produto,
      timestamp: new Date().toISOString(),
      relatorio: 'Rastreabilidade Completa'
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rastreabilidade_${produto.lote}_${new Date().toISOString().split('T')[0]}.json`;
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
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Rastreabilidade Completa
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Transparência total da origem ao destino com blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Métricas de Rastreabilidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Total Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {(metricas.totalProdutos / 1000).toFixed(1)}k
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Search className="w-5 h-5 text-success" />
                Rastreados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                100%
              </div>
              <p className="text-sm text-success mt-1">
                Cobertura total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent-yellow" />
                Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {(metricas.eventosRegistrados / 1000).toFixed(1)}k
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Registrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                Certificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.certificacoesAtivas}
              </div>
              <p className="text-sm text-success mt-1">
                Ativas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                Blockchain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.integridadeBlockchain}%
              </div>
              <p className="text-sm text-success mt-1">
                Integridade
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent-yellow" />
                Tempo Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.tempoMedioRastreamento}s
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Consulta
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Busca e Filtros */}
        <Card className="bg-gradient-surface border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Buscar Produto</CardTitle>
            <CardDescription>
              Digite o código, lote, QR Code ou nome do produto para rastrear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por código, lote, QR Code ou nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
              
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-4 py-3 bg-background border border-border rounded-md text-sm min-w-48"
              >
                <option value="todos">Todos os status</option>
                <option value="em_producao">Em Produção</option>
                <option value="em_transito">Em Trânsito</option>
                <option value="armazenado">Armazenado</option>
                <option value="entregue">Entregue</option>
                <option value="vendido">Vendido</option>
              </select>
              
              <Button size="lg" className="px-8">
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados da Busca */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Produtos */}
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Produtos Encontrados</span>
                <Badge variant="secondary">{produtosFiltrados.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {produtosFiltrados.map((produto) => (
                  <div 
                    key={produto.id} 
                    className={`p-4 bg-background/50 rounded-lg border cursor-pointer transition-all hover:bg-background/70 ${
                      produtoSelecionado?.id === produto.id ? 'border-primary bg-primary/5' : 'border-border/30'
                    }`}
                    onClick={() => setProdutoSelecionado(produto)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{produto.nome}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Código: {produto.codigo}</div>
                          <div>Lote: {produto.lote}</div>
                          <div>QR: {produto.qrCode}</div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(produto.status)}>
                        {produto.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">
                        Produzido: {produto.dataProducao}
                      </div>
                      <div className="text-primary font-medium">
                        {produto.eventos.length} eventos
                      </div>
                    </div>
                    
                    {produto.cliente && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Cliente: {produto.cliente}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Produto Selecionado */}
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Detalhes da Rastreabilidade</span>
                {produtoSelecionado && (
                  <Button 
                    onClick={() => gerarRelatorioRastreabilidade(produtoSelecionado)}
                    variant="outline" 
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Relatório
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {produtoSelecionado ? (
                <Tabs defaultValue="timeline" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                    <TabsTrigger value="certificacoes">Certificações</TabsTrigger>
                  </TabsList>

                  <TabsContent value="timeline" className="space-y-4">
                    <div className="max-h-80 overflow-y-auto space-y-4">
                      {produtoSelecionado.eventos.map((evento, index) => (
                        <div key={evento.id} className="relative">
                          {index < produtoSelecionado.eventos.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                          )}
                          
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full bg-background border-2 border-border ${getTipoEventoColor(evento.tipo)}`}>
                              {getTipoEventoIcon(evento.tipo)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-foreground text-sm">
                                  {evento.descricao}
                                </h5>
                                <Badge variant="outline" className="text-xs">
                                  {evento.tipo}
                                </Badge>
                              </div>
                              
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  {evento.timestamp}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3 h-3" />
                                  {evento.localizacao}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-3 h-3" />
                                  {evento.responsavel}
                                </div>
                                
                                {evento.documento && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-3 h-3" />
                                    {evento.documento}
                                  </div>
                                )}
                                
                                {(evento.temperatura || evento.umidade) && (
                                  <div className="text-xs bg-background/50 p-2 rounded mt-2">
                                    {evento.temperatura && `Temp: ${evento.temperatura}°C `}
                                    {evento.umidade && `Umidade: ${evento.umidade}%`}
                                  </div>
                                )}
                                
                                {evento.observacoes && (
                                  <div className="text-xs bg-accent/10 p-2 rounded mt-2">
                                    {evento.observacoes}
                                  </div>
                                )}
                                
                                {evento.hashBlockchain && (
                                  <div className="text-xs font-mono bg-primary/10 p-2 rounded mt-2">
                                    <div className="flex items-center gap-1">
                                      <QrCode className="w-3 h-3" />
                                      Hash: {evento.hashBlockchain.substring(0, 20)}...
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="detalhes" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div>
                          <span className="text-muted-foreground">Produto:</span>
                          <div className="font-medium">{produtoSelecionado.nome}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Código:</span>
                          <div className="font-medium">{produtoSelecionado.codigo}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Lote:</span>
                          <div className="font-medium">{produtoSelecionado.lote}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Peso:</span>
                          <div className="font-medium">{produtoSelecionado.peso} kg</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">QR Code:</span>
                          <div className="font-mono text-xs bg-background p-2 rounded">
                            {produtoSelecionado.qrCode}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-muted-foreground">Data Produção:</span>
                          <div className="font-medium">{produtoSelecionado.dataProducao}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Validade:</span>
                          <div className="font-medium">{produtoSelecionado.dataValidade}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fornecedor MP:</span>
                          <div className="font-medium">{produtoSelecionado.fornecedorMateriaPrima}</div>
                        </div>
                        {produtoSelecionado.cliente && (
                          <div>
                            <span className="text-muted-foreground">Cliente:</span>
                            <div className="font-medium">{produtoSelecionado.cliente}</div>
                          </div>
                        )}
                        {produtoSelecionado.nfce && (
                          <div>
                            <span className="text-muted-foreground">NFCe:</span>
                            <div className="font-medium">{produtoSelecionado.nfce}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h6 className="font-semibold mb-3">Composição do Produto</h6>
                      <div className="space-y-2">
                        {produtoSelecionado.composicao.map((comp, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{comp.componente}:</span>
                            <span className="font-medium">{comp.percentual}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="certificacoes" className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {produtoSelecionado.certificacoes.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-success" />
                            <span className="font-medium">{cert}</span>
                          </div>
                          <Badge variant="outline" className="text-success border-success">
                            Ativo
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <QrCode className="w-5 h-5 text-primary" />
                        <h6 className="font-semibold text-primary">Verificação Blockchain</h6>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Todas as certificações são verificadas e registradas em blockchain para garantir autenticidade.
                      </p>
                      <div className="text-xs font-mono bg-background p-2 rounded">
                        Última verificação: {new Date().toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Selecione um produto da lista para ver os detalhes da rastreabilidade
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RastreabilidadeCompleta;