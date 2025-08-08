import { useState, useEffect } from "react";
import { Package, TrendingDown, TrendingUp, AlertCircle, BarChart3, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface ItemEstoque {
  id: string;
  codigo: string;
  nome: string;
  categoria: 'materia_prima' | 'produto_acabado' | 'embalagem' | 'insumo';
  quantidade: number;
  unidade: string;
  estoqueMinimo: number;
  estoqueMaximo: number;
  valorUnitario: number;
  localizacao: string;
  ultimaMovimentacao: string;
  status: 'normal' | 'baixo' | 'critico' | 'excesso';
  fornecedor?: string;
  lote?: string;
  validade?: string;
}

interface MovimentacaoEstoque {
  id: string;
  tipo: 'entrada' | 'saida' | 'transferencia' | 'ajuste';
  item: string;
  quantidade: number;
  motivo: string;
  responsavel: string;
  timestamp: string;
  documento?: string;
}

const itensIniciais: ItemEstoque[] = [
  {
    id: "EST001",
    codigo: "MP-001",
    nome: "Ureia Granulada",
    categoria: "materia_prima",
    quantidade: 2500,
    unidade: "kg",
    estoqueMinimo: 1000,
    estoqueMaximo: 5000,
    valorUnitario: 2.85,
    localizacao: "Galpão A - Setor 1",
    ultimaMovimentacao: "2024-01-15 14:30",
    status: "normal",
    fornecedor: "Petrobras Fertilizantes",
    lote: "UR240115001",
    validade: "2025-01-15"
  },
  {
    id: "EST002",
    codigo: "MP-002",
    nome: "Superfosfato Simples",
    categoria: "materia_prima",
    quantidade: 450,
    unidade: "kg",
    estoqueMinimo: 800,
    estoqueMaximo: 3000,
    valorUnitario: 1.95,
    localizacao: "Galpão A - Setor 2",
    ultimaMovimentacao: "2024-01-15 13:15",
    status: "baixo",
    fornecedor: "Vale Fertilizantes",
    lote: "SF240115002"
  },
  {
    id: "EST003",
    codigo: "PA-001",
    nome: "NPK 10-10-10 (25kg)",
    categoria: "produto_acabado",
    quantidade: 1200,
    unidade: "saco",
    estoqueMinimo: 500,
    estoqueMaximo: 2000,
    valorUnitario: 45.50,
    localizacao: "Galpão B - Expedição",
    ultimaMovimentacao: "2024-01-15 16:45",
    status: "normal"
  },
  {
    id: "EST004",
    codigo: "EMB-001",
    nome: "Saco Polipropileno 25kg",
    categoria: "embalagem",
    quantidade: 150,
    unidade: "unidade",
    estoqueMinimo: 500,
    estoqueMaximo: 2000,
    valorUnitario: 2.15,
    localizacao: "Almoxarifado - Prateleira 3",
    ultimaMovimentacao: "2024-01-15 11:20",
    status: "critico",
    fornecedor: "Embalagens São Paulo"
  },
  {
    id: "EST005",
    codigo: "PA-002",
    nome: "Fertilizante Orgânico Premium (20kg)",
    categoria: "produto_acabado",
    quantidade: 2800,
    unidade: "saco",
    estoqueMinimo: 800,
    estoqueMaximo: 2000,
    valorUnitario: 38.90,
    localizacao: "Galpão C - Setor 1",
    ultimaMovimentacao: "2024-01-15 09:30",
    status: "excesso"
  }
];

const movimentacoesIniciais: MovimentacaoEstoque[] = [
  {
    id: "MOV001",
    tipo: "saida",
    item: "NPK 10-10-10 (25kg)",
    quantidade: 200,
    motivo: "Venda - Pedido #2024-001",
    responsavel: "Carlos Silva",
    timestamp: "2024-01-15 16:45",
    documento: "NF-001234"
  },
  {
    id: "MOV002",
    tipo: "entrada",
    item: "Ureia Granulada",
    quantidade: 1000,
    motivo: "Compra - Fornecedor Petrobras",
    responsavel: "Maria Santos",
    timestamp: "2024-01-15 14:30",
    documento: "NF-005678"
  },
  {
    id: "MOV003",
    tipo: "ajuste",
    item: "Saco Polipropileno 25kg",
    quantidade: -50,
    motivo: "Ajuste de inventário - Avaria",
    responsavel: "João Oliveira",
    timestamp: "2024-01-15 11:20"
  }
];

const GestaoEstoque = () => {
  const [itens, setItens] = useState<ItemEstoque[]>(itensIniciais);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>(movimentacoesIniciais);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [metricas, setMetricas] = useState({
    valorTotalEstoque: 285420.50,
    itensAtivos: 156,
    alertasBaixoEstoque: 8,
    alertasExcesso: 3,
    giroEstoque: 4.2,
    acuracidadeInventario: 98.5
  });

  const itensFiltrados = itens.filter(item => {
    const matchCategoria = filtroCategoria === 'todos' || item.categoria === filtroCategoria;
    const matchStatus = filtroStatus === 'todos' || item.status === filtroStatus;
    const matchBusca = busca === '' || 
      item.nome.toLowerCase().includes(busca.toLowerCase()) ||
      item.codigo.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchStatus && matchBusca;
  });

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'materia_prima': return 'bg-primary text-white';
      case 'produto_acabado': return 'bg-success text-white';
      case 'embalagem': return 'bg-warning text-black';
      case 'insumo': return 'bg-accent-yellow text-foreground';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-success text-white';
      case 'baixo': return 'bg-warning text-black';
      case 'critico': return 'bg-destructive text-white';
      case 'excesso': return 'bg-accent-yellow text-foreground';
      default: return 'bg-muted';
    }
  };

  const getTipoMovimentacaoColor = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return 'text-success';
      case 'saida': return 'text-destructive';
      case 'transferencia': return 'text-primary';
      case 'ajuste': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const calcularPercentualEstoque = (quantidade: number, minimo: number, maximo: number) => {
    return ((quantidade - minimo) / (maximo - minimo)) * 100;
  };

  const gerarRelatorioEstoque = () => {
    // Simula geração de relatório
    const dados = {
      timestamp: new Date().toISOString(),
      itens: itensFiltrados,
      metricas
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_estoque_${new Date().toISOString().split('T')[0]}.json`;
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
              <Package className="w-8 h-8 text-sidebar-foreground" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Gestão de Estoque
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Controle inteligente de inventário com alertas automáticos e otimização
              </p>
            </div>
          </div>
        </div>

        {/* Métricas de Estoque */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Valor Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                R$ {(metricas.valorTotalEstoque / 1000).toFixed(0)}k
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Inventário atual
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-success" />
                Itens Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.itensAtivos}
              </div>
              <p className="text-sm text-success mt-1">
                +5 este mês
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-warning" />
                Baixo Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.alertasBaixoEstoque}
              </div>
              <p className="text-sm text-warning mt-1">
                Requer reposição
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-yellow" />
                Excesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.alertasExcesso}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Acima do máximo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                Giro Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.giroEstoque}x
              </div>
              <p className="text-sm text-success mt-1">
                +0.3 vs. anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-success" />
                Acurácia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.acuracidadeInventario}%
              </div>
              <Progress value={metricas.acuracidadeInventario} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="inventario" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="inventario" className="text-sm">Inventário</TabsTrigger>
            <TabsTrigger value="movimentacoes" className="text-sm">Movimentações</TabsTrigger>
            <TabsTrigger value="alertas" className="text-sm">Alertas</TabsTrigger>
            <TabsTrigger value="relatorios" className="text-sm">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="inventario" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle>Inventário Atual</CardTitle>
                    <CardDescription>
                      Controle detalhado de todos os itens em estoque
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Input
                      placeholder="Buscar por nome ou código..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="w-64"
                    />
                    
                    <select
                      value={filtroCategoria}
                      onChange={(e) => setFiltroCategoria(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-md text-sm"
                    >
                      <option value="todos">Todas as categorias</option>
                      <option value="materia_prima">Matéria Prima</option>
                      <option value="produto_acabado">Produto Acabado</option>
                      <option value="embalagem">Embalagem</option>
                      <option value="insumo">Insumo</option>
                    </select>
                    
                    <select
                      value={filtroStatus}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-md text-sm"
                    >
                      <option value="todos">Todos os status</option>
                      <option value="normal">Normal</option>
                      <option value="baixo">Baixo</option>
                      <option value="critico">Crítico</option>
                      <option value="excesso">Excesso</option>
                    </select>
                    
                    <Button onClick={gerarRelatorioEstoque} variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Relatório
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itensFiltrados.map((item) => (
                    <div key={item.id} className="p-4 bg-background/50 rounded-lg border border-border/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{item.nome}</h4>
                            <Badge className={getCategoriaColor(item.categoria)} variant="secondary">
                              {item.categoria.replace('_', ' ')}
                            </Badge>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <div>Código: {item.codigo}</div>
                            <div>Localização: {item.localizacao}</div>
                            <div>Última mov.: {item.ultimaMovimentacao}</div>
                            <div>Valor unit.: R$ {item.valorUnitario.toFixed(2)}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {item.quantidade.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">{item.unidade}</div>
                          <div className="text-sm font-medium text-primary mt-1">
                            R$ {(item.quantidade * item.valorUnitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Nível de Estoque:</span>
                          <span className="font-medium">
                            {item.estoqueMinimo} - {item.estoqueMaximo} {item.unidade}
                          </span>
                        </div>
                        <Progress 
                          value={Math.max(0, Math.min(100, calcularPercentualEstoque(item.quantidade, item.estoqueMinimo, item.estoqueMaximo)))}
                          className="h-2"
                        />
                      </div>
                      
                      {(item.fornecedor || item.lote || item.validade) && (
                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-2 text-sm">
                          {item.fornecedor && (
                            <div>
                              <span className="text-muted-foreground">Fornecedor: </span>
                              <span className="font-medium">{item.fornecedor}</span>
                            </div>
                          )}
                          {item.lote && (
                            <div>
                              <span className="text-muted-foreground">Lote: </span>
                              <span className="font-medium">{item.lote}</span>
                            </div>
                          )}
                          {item.validade && (
                            <div>
                              <span className="text-muted-foreground">Validade: </span>
                              <span className="font-medium">{item.validade}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movimentacoes" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Movimentações Recentes
                </CardTitle>
                <CardDescription>
                  Histórico de entradas, saídas e ajustes de estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Documento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimentacoes.map((mov) => (
                      <TableRow key={mov.id}>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`${getTipoMovimentacaoColor(mov.tipo)} border-current`}
                          >
                            {mov.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{mov.item}</TableCell>
                        <TableCell className={`font-mono ${getTipoMovimentacaoColor(mov.tipo)}`}>
                          {mov.quantidade > 0 ? '+' : ''}{mov.quantidade}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{mov.motivo}</TableCell>
                        <TableCell>{mov.responsavel}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {mov.timestamp}
                        </TableCell>
                        <TableCell>
                          {mov.documento && (
                            <Badge variant="outline" className="text-xs">
                              {mov.documento}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alertas" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Alertas Críticos
                  </CardTitle>
                  <CardDescription>
                    Itens que requerem ação imediata
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {itens.filter(item => item.status === 'critico').map((item) => (
                      <div key={item.id} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{item.nome}</h4>
                          <Badge variant="destructive">Crítico</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Estoque atual: {item.quantidade} {item.unidade} (Mín: {item.estoqueMinimo})
                        </div>
                        <div className="text-sm text-destructive font-medium mt-1">
                          Reposição urgente necessária
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-warning" />
                    Baixo Estoque
                  </CardTitle>
                  <CardDescription>
                    Itens próximos ao limite mínimo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {itens.filter(item => item.status === 'baixo').map((item) => (
                      <div key={item.id} className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{item.nome}</h4>
                          <Badge variant="outline" className="text-warning border-warning">
                            Baixo
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Estoque atual: {item.quantidade} {item.unidade} (Mín: {item.estoqueMinimo})
                        </div>
                        <div className="text-sm text-warning font-medium mt-1">
                          Programar reposição
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Relatório de Posição</CardTitle>
                  <CardDescription>Situação atual do estoque</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total de itens:</span>
                      <span className="font-medium">{metricas.itensAtivos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Valor total:</span>
                      <span className="font-medium">R$ {(metricas.valorTotalEstoque / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Alertas ativos:</span>
                      <span className="font-medium text-warning">{metricas.alertasBaixoEstoque + metricas.alertasExcesso}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Análise de Giro</CardTitle>
                  <CardDescription>Performance de rotatividade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Giro médio:</span>
                      <span className="font-medium">{metricas.giroEstoque}x/ano</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Itens parados:</span>
                      <span className="font-medium text-warning">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Oportunidade:</span>
                      <span className="font-medium text-success">R$ 45k</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Gerar Análise
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Previsão de Demanda</CardTitle>
                  <CardDescription>IA prevê necessidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Próximas compras:</span>
                      <span className="font-medium">7 dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Valor estimado:</span>
                      <span className="font-medium">R$ 125k</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Precisão IA:</span>
                      <span className="font-medium text-success">94.2%</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Ver Previsões
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

export default GestaoEstoque;