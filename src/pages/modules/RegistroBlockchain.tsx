import { useState, useEffect } from "react";
import { Shield, Link, Search, Download, Eye, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RegistroBlockchain {
  id: string;
  hash: string;
  timestamp: string;
  tipo: 'producao' | 'qualidade' | 'logistica' | 'auditoria';
  descricao: string;
  status: 'confirmado' | 'pendente' | 'validando';
  bloco: number;
  transacoes: number;
  validadores: number;
}

interface AuditoriaItem {
  id: string;
  acao: string;
  usuario: string;
  timestamp: string;
  detalhes: string;
  impacto: 'baixo' | 'medio' | 'alto';
}

const registrosIniciais: RegistroBlockchain[] = [
  {
    id: "REG001",
    hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    timestamp: "2024-01-15 14:30:25",
    tipo: "producao",
    descricao: "Lote NPK 10-10-10 - Batch #2024001",
    status: "confirmado",
    bloco: 15847,
    transacoes: 3,
    validadores: 5
  },
  {
    id: "REG002",
    hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
    timestamp: "2024-01-15 13:45:12",
    tipo: "qualidade",
    descricao: "Teste de qualidade - Amostra Q2024-015",
    status: "confirmado",
    bloco: 15846,
    transacoes: 2,
    validadores: 4
  },
  {
    id: "REG003",
    hash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
    timestamp: "2024-01-15 12:20:08",
    tipo: "logistica",
    descricao: "Expedição Caminhão TR-001 - Destino SP",
    status: "validando",
    bloco: 15845,
    transacoes: 1,
    validadores: 3
  },
  {
    id: "REG004",
    hash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
    timestamp: "2024-01-15 11:15:33",
    tipo: "auditoria",
    descricao: "Auditoria interna - Processo de mistura",
    status: "pendente",
    bloco: 0,
    transacoes: 0,
    validadores: 0
  }
];

const auditoriaIniciais: AuditoriaItem[] = [
  {
    id: "AUD001",
    acao: "Alteração de fórmula NPK",
    usuario: "João Silva (Supervisor)",
    timestamp: "2024-01-15 14:25:10",
    detalhes: "Ajuste na proporção de nitrogênio de 10% para 10.2%",
    impacto: "medio"
  },
  {
    id: "AUD002",
    acao: "Aprovação de lote",
    usuario: "Maria Santos (Qualidade)",
    timestamp: "2024-01-15 13:40:05",
    detalhes: "Lote #2024001 aprovado após testes de qualidade",
    impacto: "alto"
  },
  {
    id: "AUD003",
    acao: "Manutenção preventiva",
    usuario: "Carlos Oliveira (Manutenção)",
    timestamp: "2024-01-15 09:30:22",
    detalhes: "Calibração do misturador A - Próxima em 30 dias",
    impacto: "baixo"
  }
];

const RegistroBlockchain = () => {
  const [registros, setRegistros] = useState<RegistroBlockchain[]>(registrosIniciais);
  const [auditoria, setAuditoria] = useState<AuditoriaItem[]>(auditoriaIniciais);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [metricas, setMetricas] = useState({
    totalRegistros: 1247,
    registrosHoje: 23,
    integridade: 100,
    validadores: 12,
    tempoMedioValidacao: 2.3
  });

  const registrosFiltrados = registros.filter(registro => {
    const matchTipo = filtroTipo === 'todos' || registro.tipo === filtroTipo;
    const matchBusca = busca === '' || 
      registro.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      registro.hash.toLowerCase().includes(busca.toLowerCase()) ||
      registro.id.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  });

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'producao': return 'bg-primary text-white';
      case 'qualidade': return 'bg-success text-white';
      case 'logistica': return 'bg-warning text-black';
      case 'auditoria': return 'bg-accent-yellow text-foreground';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-success text-white';
      case 'validando': return 'bg-warning text-black';
      case 'pendente': return 'bg-muted text-muted-foreground';
      default: return 'bg-background';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmado': return <CheckCircle className="w-4 h-4" />;
      case 'validando': return <Clock className="w-4 h-4" />;
      case 'pendente': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case 'alto': return 'destructive';
      case 'medio': return 'default';
      case 'baixo': return 'secondary';
      default: return 'outline';
    }
  };

  const exportarRegistros = () => {
    // Simula exportação
    const dados = JSON.stringify(registrosFiltrados, null, 2);
    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registros_blockchain_${new Date().toISOString().split('T')[0]}.json`;
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
                Registro Blockchain
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Rastreabilidade completa e auditoria imutável de todos os processos
              </p>
            </div>
          </div>
        </div>

        {/* Métricas Blockchain */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Link className="w-5 h-5 text-primary" />
                Total Registros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {metricas.totalRegistros.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Desde o início
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-success" />
                Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {metricas.registrosHoje}
              </div>
              <p className="text-sm text-success mt-1">
                +15% vs. ontem
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent-yellow" />
                Integridade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {metricas.integridade}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Dados íntegros
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Validadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {metricas.validadores}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Nós ativos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                Tempo Validação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {metricas.tempoMedioValidacao}s
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Tempo médio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="registros" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="registros" className="text-sm">Registros</TabsTrigger>
            <TabsTrigger value="auditoria" className="text-sm">Auditoria</TabsTrigger>
            <TabsTrigger value="integridade" className="text-sm">Integridade</TabsTrigger>
          </TabsList>

          <TabsContent value="registros" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle>Registros Blockchain</CardTitle>
                    <CardDescription>
                      Todos os eventos registrados de forma imutável na blockchain
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por hash, ID ou descrição..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    
                    <select
                      value={filtroTipo}
                      onChange={(e) => setFiltroTipo(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-md text-sm"
                    >
                      <option value="todos">Todos os tipos</option>
                      <option value="producao">Produção</option>
                      <option value="qualidade">Qualidade</option>
                      <option value="logistica">Logística</option>
                      <option value="auditoria">Auditoria</option>
                    </select>
                    
                    <Button onClick={exportarRegistros} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registrosFiltrados.map((registro) => (
                    <div key={registro.id} className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border/30">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{registro.descricao}</h4>
                          <Badge className={getTipoColor(registro.tipo)} variant="secondary">
                            {registro.tipo}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div>ID: {registro.id}</div>
                          <div>Bloco: #{registro.bloco}</div>
                          <div>{registro.timestamp}</div>
                        </div>
                        
                        <div className="mt-2 font-mono text-xs text-muted-foreground bg-background/50 p-2 rounded border">
                          Hash: {registro.hash}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={getStatusColor(registro.status)}>
                          {getStatusIcon(registro.status)}
                          <span className="ml-1 capitalize">
                            {registro.status}
                          </span>
                        </Badge>
                        
                        <div className="mt-2 text-sm text-muted-foreground">
                          {registro.validadores} validadores
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auditoria" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle>Trilha de Auditoria</CardTitle>
                <CardDescription>
                  Registro completo de todas as ações realizadas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ação</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Detalhes</TableHead>
                      <TableHead>Impacto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditoria.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.acao}</TableCell>
                        <TableCell>{item.usuario}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.timestamp}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {item.detalhes}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getImpactoColor(item.impacto)}>
                            {item.impacto}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integridade" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-success" />
                    Verificação de Integridade
                  </CardTitle>
                  <CardDescription>
                    Status da validação dos dados na blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium">Hash de Blocos</span>
                      </div>
                      <Badge className="bg-success text-white">Válido</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium">Assinaturas Digitais</span>
                      </div>
                      <Badge className="bg-success text-white">Válido</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium">Consenso da Rede</span>
                      </div>
                      <Badge className="bg-success text-white">Ativo</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium">Timestamps</span>
                      </div>
                      <Badge className="bg-success text-white">Sincronizado</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5 text-primary" />
                    Rede Blockchain
                  </CardTitle>
                  <CardDescription>
                    Informações sobre a rede e validadores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-background/50 rounded-lg">
                        <div className="text-2xl font-bold text-foreground">12</div>
                        <div className="text-sm text-muted-foreground">Nós Validadores</div>
                      </div>
                      
                      <div className="text-center p-3 bg-background/50 rounded-lg">
                        <div className="text-2xl font-bold text-foreground">15,847</div>
                        <div className="text-sm text-muted-foreground">Último Bloco</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-background/50 rounded-lg">
                        <div className="text-2xl font-bold text-foreground">2.3s</div>
                        <div className="text-sm text-muted-foreground">Tempo Bloco</div>
                      </div>
                      
                      <div className="text-center p-3 bg-background/50 rounded-lg">
                        <div className="text-2xl font-bold text-foreground">99.9%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-background/50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Último Hash de Bloco</h4>
                      <div className="font-mono text-xs text-muted-foreground break-all">
                        0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890
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

export default RegistroBlockchain;