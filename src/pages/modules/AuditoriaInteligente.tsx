import { useState, useEffect } from "react";
import { Shield, Search, FileText, AlertCircle, CheckCircle, Clock, Users, Database, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RegistroAuditoria {
  id: string;
  timestamp: string;
  usuario: string;
  acao: string;
  modulo: string;
  detalhes: string;
  ip: string;
  status: 'sucesso' | 'falha' | 'suspeito';
  risco: 'baixo' | 'medio' | 'alto' | 'critico';
  hashBlockchain?: string;
  dadosAntes?: any;
  dadosDepois?: any;
}

interface RelatorioCompliance {
  id: string;
  nome: string;
  tipo: 'iso9001' | 'mapa' | 'anvisa' | 'sarbanes' | 'lgpd';
  status: 'conforme' | 'nao_conforme' | 'pendente' | 'em_analise';
  ultimaAuditoria: string;
  proximaAuditoria: string;
  pontuacao: number;
  itensVerificados: number;
  naoConformidades: number;
  acoesPendentes: number;
  responsavel: string;
}

interface AlertaSeguranca {
  id: string;
  tipo: 'acesso_suspeito' | 'alteracao_critica' | 'tentativa_invasao' | 'violacao_dados';
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  descricao: string;
  usuario?: string;
  ip?: string;
  timestamp: string;
  status: 'novo' | 'investigando' | 'resolvido' | 'falso_positivo';
  acaoTomada?: string;
}

const registrosIniciais: RegistroAuditoria[] = [
  {
    id: "AUD001",
    timestamp: "2024-01-15 14:30:25",
    usuario: "carlos.mendes@unifertil.com",
    acao: "Alteração de fórmula de produto",
    modulo: "Controle de Qualidade",
    detalhes: "Modificou percentual de nitrogênio no NPK 10-10-10 de 10% para 10.2%",
    ip: "192.168.1.45",
    status: "sucesso",
    risco: "medio",
    hashBlockchain: "0x1a2b3c4d5e6f7890abcdef1234567890",
    dadosAntes: { nitrogenio: 10.0 },
    dadosDepois: { nitrogenio: 10.2 }
  },
  {
    id: "AUD002",
    timestamp: "2024-01-15 13:15:10",
    usuario: "maria.santos@unifertil.com",
    acao: "Aprovação de lote de produção",
    modulo: "Gestão de Estoque",
    detalhes: "Aprovou lote NPK240115001 para expedição",
    ip: "192.168.1.32",
    status: "sucesso",
    risco: "baixo",
    hashBlockchain: "0x2b3c4d5e6f7890abcdef1234567890ab"
  },
  {
    id: "AUD003",
    timestamp: "2024-01-15 11:45:33",
    usuario: "admin@unifertil.com",
    acao: "Tentativa de acesso a dados financeiros",
    modulo: "Sistema Administrativo",
    detalhes: "Múltiplas tentativas de acesso a relatórios financeiros restritos",
    ip: "203.45.67.89",
    status: "falha",
    risco: "alto",
    hashBlockchain: "0x3c4d5e6f7890abcdef1234567890abcd"
  },
  {
    id: "AUD004",
    timestamp: "2024-01-15 09:20:15",
    usuario: "joao.oliveira@unifertil.com",
    acao: "Exportação de dados de clientes",
    modulo: "Rastreabilidade",
    detalhes: "Exportou relatório completo de rastreabilidade para cliente Fazenda São José",
    ip: "192.168.1.28",
    status: "sucesso",
    risco: "baixo",
    hashBlockchain: "0x4d5e6f7890abcdef1234567890abcdef"
  },
  {
    id: "AUD005",
    timestamp: "2024-01-15 08:10:42",
    usuario: "sistema.automatico",
    acao: "Backup automático de dados",
    modulo: "Sistema",
    detalhes: "Backup diário realizado com sucesso - 2.3GB de dados",
    ip: "127.0.0.1",
    status: "sucesso",
    risco: "baixo",
    hashBlockchain: "0x5e6f7890abcdef1234567890abcdef12"
  }
];

const relatoriosIniciais: RelatorioCompliance[] = [
  {
    id: "COMP001",
    nome: "ISO 9001:2015 - Sistema de Gestão da Qualidade",
    tipo: "iso9001",
    status: "conforme",
    ultimaAuditoria: "2023-11-15",
    proximaAuditoria: "2024-11-15",
    pontuacao: 94.5,
    itensVerificados: 127,
    naoConformidades: 2,
    acoesPendentes: 1,
    responsavel: "Dra. Maria Santos"
  },
  {
    id: "COMP002",
    nome: "MAPA - Registro de Fertilizantes",
    tipo: "mapa",
    status: "conforme",
    ultimaAuditoria: "2024-01-10",
    proximaAuditoria: "2024-07-10",
    pontuacao: 98.2,
    itensVerificados: 89,
    naoConformidades: 0,
    acoesPendentes: 0,
    responsavel: "Carlos Mendes"
  },
  {
    id: "COMP003",
    nome: "LGPD - Lei Geral de Proteção de Dados",
    tipo: "lgpd",
    status: "em_analise",
    ultimaAuditoria: "2024-01-05",
    proximaAuditoria: "2024-04-05",
    pontuacao: 87.3,
    itensVerificados: 156,
    naoConformidades: 5,
    acoesPendentes: 8,
    responsavel: "Ana Paula Silva"
  },
  {
    id: "COMP004",
    nome: "ANVISA - Boas Práticas de Fabricação",
    tipo: "anvisa",
    status: "pendente",
    ultimaAuditoria: "2023-09-20",
    proximaAuditoria: "2024-03-20",
    pontuacao: 91.7,
    itensVerificados: 203,
    naoConformidades: 3,
    acoesPendentes: 12,
    responsavel: "Dr. Roberto Lima"
  }
];

const alertasIniciais: AlertaSeguranca[] = [
  {
    id: "SEC001",
    tipo: "acesso_suspeito",
    severidade: "alta",
    descricao: "Múltiplas tentativas de login fora do horário comercial",
    usuario: "admin@unifertil.com",
    ip: "203.45.67.89",
    timestamp: "2024-01-15 02:30:00",
    status: "investigando"
  },
  {
    id: "SEC002",
    tipo: "alteracao_critica",
    severidade: "media",
    descricao: "Alteração em configurações de segurança do sistema",
    usuario: "ti.admin@unifertil.com",
    ip: "192.168.1.10",
    timestamp: "2024-01-15 14:15:00",
    status: "resolvido",
    acaoTomada: "Alteração autorizada pelo gestor de TI"
  },
  {
    id: "SEC003",
    tipo: "tentativa_invasao",
    severidade: "critica",
    descricao: "Tentativas de SQL injection detectadas no módulo de relatórios",
    ip: "45.123.67.89",
    timestamp: "2024-01-15 10:45:00",
    status: "resolvido",
    acaoTomada: "IP bloqueado automaticamente pelo firewall"
  }
];

const AuditoriaInteligente = () => {
  const [registros, setRegistros] = useState<RegistroAuditoria[]>(registrosIniciais);
  const [relatorios, setRelatorios] = useState<RelatorioCompliance[]>(relatoriosIniciais);
  const [alertas, setAlertas] = useState<AlertaSeguranca[]>(alertasIniciais);
  const [filtroModulo, setFiltroModulo] = useState('todos');
  const [filtroRisco, setFiltroRisco] = useState('todos');
  const [busca, setBusca] = useState('');
  const [metricas, setMetricas] = useState({
    registrosAuditoria: 15847,
    conformidadeGeral: 92.4,
    alertasAtivos: 3,
    backupsRealizados: 365,
    integridadeDados: 99.9,
    tempoMedioResposta: 1.2
  });

  const registrosFiltrados = registros.filter(registro => {
    const matchModulo = filtroModulo === 'todos' || registro.modulo.toLowerCase().includes(filtroModulo.toLowerCase());
    const matchRisco = filtroRisco === 'todos' || registro.risco === filtroRisco;
    const matchBusca = busca === '' || 
      registro.usuario.toLowerCase().includes(busca.toLowerCase()) ||
      registro.acao.toLowerCase().includes(busca.toLowerCase()) ||
      registro.detalhes.toLowerCase().includes(busca.toLowerCase());
    return matchModulo && matchRisco && matchBusca;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sucesso': return 'bg-success text-white';
      case 'falha': return 'bg-destructive text-white';
      case 'suspeito': return 'bg-warning text-black';
      default: return 'bg-muted';
    }
  };

  const getRiscoColor = (risco: string) => {
    switch (risco) {
      case 'baixo': return 'bg-success text-white';
      case 'medio': return 'bg-accent-yellow text-foreground';
      case 'alto': return 'bg-warning text-black';
      case 'critico': return 'bg-destructive text-white';
      default: return 'bg-muted';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'conforme': return 'bg-success text-white';
      case 'nao_conforme': return 'bg-destructive text-white';
      case 'pendente': return 'bg-warning text-black';
      case 'em_analise': return 'bg-accent-yellow text-foreground';
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

  const getStatusAlertaColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-destructive text-white';
      case 'investigando': return 'bg-warning text-black';
      case 'resolvido': return 'bg-success text-white';
      case 'falso_positivo': return 'bg-muted text-foreground';
      default: return 'bg-muted';
    }
  };

  const gerarRelatorioAuditoria = () => {
    const dados = {
      timestamp: new Date().toISOString(),
      registros: registrosFiltrados,
      relatoriosCompliance: relatorios,
      alertasSeguranca: alertas,
      metricas
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_completa_${new Date().toISOString().split('T')[0]}.json`;
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
              <Shield className="w-8 h-8 text-sidebar-foreground" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Auditoria Inteligente
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Monitoramento completo, compliance e segurança com blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Métricas de Auditoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Registros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {(metricas.registrosAuditoria / 1000).toFixed(0)}k
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total auditados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Conformidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.conformidadeGeral}%
              </div>
              <Progress value={metricas.conformidadeGeral} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
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
                <Database className="w-5 h-5 text-accent-yellow" />
                Backups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.backupsRealizados}
              </div>
              <p className="text-sm text-success mt-1">
                Este ano
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                Integridade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.integridadeDados}%
              </div>
              <p className="text-sm text-success mt-1">
                Dados íntegros
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Resposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.tempoMedioResposta}s
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Tempo médio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="registros" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="registros" className="text-sm">Registros</TabsTrigger>
            <TabsTrigger value="compliance" className="text-sm">Compliance</TabsTrigger>
            <TabsTrigger value="seguranca" className="text-sm">Segurança</TabsTrigger>
            <TabsTrigger value="relatorios" className="text-sm">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="registros" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle>Log de Auditoria</CardTitle>
                    <CardDescription>
                      Registro completo de todas as ações do sistema
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Input
                      placeholder="Buscar por usuário, ação ou detalhes..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="w-64"
                    />
                    
                    <Select value={filtroModulo} onValueChange={setFiltroModulo}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por módulo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os módulos</SelectItem>
                        <SelectItem value="qualidade">Controle de Qualidade</SelectItem>
                        <SelectItem value="estoque">Gestão de Estoque</SelectItem>
                        <SelectItem value="rastreabilidade">Rastreabilidade</SelectItem>
                        <SelectItem value="sistema">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filtroRisco} onValueChange={setFiltroRisco}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Nível de risco" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os riscos</SelectItem>
                        <SelectItem value="baixo">Baixo</SelectItem>
                        <SelectItem value="medio">Médio</SelectItem>
                        <SelectItem value="alto">Alto</SelectItem>
                        <SelectItem value="critico">Crítico</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button onClick={gerarRelatorioAuditoria} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risco</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Blockchain</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrosFiltrados.map((registro) => (
                      <TableRow key={registro.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {registro.timestamp}
                        </TableCell>
                        <TableCell className="font-medium">
                          {registro.usuario}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium text-sm">{registro.acao}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {registro.detalhes}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{registro.modulo}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(registro.status)}>
                            {registro.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiscoColor(registro.risco)}>
                            {registro.risco}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {registro.ip}
                        </TableCell>
                        <TableCell>
                          {registro.hashBlockchain && (
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-success" />
                              <span className="font-mono text-xs">
                                {registro.hashBlockchain.substring(0, 8)}...
                              </span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Relatórios de Compliance
                </CardTitle>
                <CardDescription>
                  Status de conformidade com regulamentações e normas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {relatorios.map((relatorio) => (
                    <div key={relatorio.id} className="p-6 bg-background/50 rounded-lg border border-border/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-foreground">{relatorio.nome}</h4>
                            <Badge className={getComplianceColor(relatorio.status)}>
                              {relatorio.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Responsável: {relatorio.responsavel}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {relatorio.pontuacao}%
                          </div>
                          <Progress value={relatorio.pontuacao} className="h-2 w-24 mt-1" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-background rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Itens Verificados</div>
                          <div className="text-xl font-bold text-foreground">
                            {relatorio.itensVerificados}
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-background rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Não Conformidades</div>
                          <div className={`text-xl font-bold ${
                            relatorio.naoConformidades === 0 ? 'text-success' : 'text-warning'
                          }`}>
                            {relatorio.naoConformidades}
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-background rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Ações Pendentes</div>
                          <div className={`text-xl font-bold ${
                            relatorio.acoesPendentes === 0 ? 'text-success' : 'text-warning'
                          }`}>
                            {relatorio.acoesPendentes}
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-background rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Próxima Auditoria</div>
                          <div className="text-sm font-medium text-foreground">
                            {relatorio.proximaAuditoria}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-muted-foreground">
                          Última auditoria: {relatorio.ultimaAuditoria}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Detalhes
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Relatório
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguranca" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  Alertas de Segurança
                </CardTitle>
                <CardDescription>
                  Monitoramento em tempo real de ameaças e vulnerabilidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertas.map((alerta) => (
                    <div key={alerta.id} className="p-4 bg-background/50 rounded-lg border border-border/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getSeveridadeColor(alerta.severidade)}`}>
                            <AlertCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-foreground capitalize">
                              {alerta.tipo.replace('_', ' ')}
                            </h5>
                            <div className="text-sm text-muted-foreground">
                              {alerta.timestamp}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getSeveridadeColor(alerta.severidade)}>
                            {alerta.severidade}
                          </Badge>
                          <Badge className={getStatusAlertaColor(alerta.status)}>
                            {alerta.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-foreground mb-2">{alerta.descricao}</p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm">
                          {alerta.usuario && (
                            <div>
                              <span className="text-muted-foreground">Usuário: </span>
                              <span className="font-medium">{alerta.usuario}</span>
                            </div>
                          )}
                          {alerta.ip && (
                            <div>
                              <span className="text-muted-foreground">IP: </span>
                              <span className="font-mono">{alerta.ip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {alerta.acaoTomada && (
                        <div className="p-3 bg-success/10 border border-success/20 rounded-lg mb-3">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Ação tomada: </span>
                            <span className="text-foreground">{alerta.acaoTomada}</span>
                          </div>
                        </div>
                      )}
                      
                      {alerta.status === 'novo' && (
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Investigar
                          </Button>
                          <Button variant="outline" size="sm">
                            Falso Positivo
                          </Button>
                          <Button size="sm">
                            Resolver
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Relatório Executivo</CardTitle>
                  <CardDescription>Resumo geral de auditoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Conformidade geral:</span>
                      <span className="font-medium text-success">{metricas.conformidadeGeral}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Registros auditados:</span>
                      <span className="font-medium">{(metricas.registrosAuditoria / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Alertas ativos:</span>
                      <span className="font-medium text-warning">{metricas.alertasAtivos}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Análise de Riscos</CardTitle>
                  <CardDescription>Avaliação de vulnerabilidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Riscos críticos:</span>
                      <span className="font-medium text-destructive">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Riscos altos:</span>
                      <span className="font-medium text-warning">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Integridade dados:</span>
                      <span className="font-medium text-success">{metricas.integridadeDados}%</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Análise Completa
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Blockchain Audit</CardTitle>
                  <CardDescription>Verificação de integridade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Blocos verificados:</span>
                      <span className="font-medium">15,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Hash válidos:</span>
                      <span className="font-medium text-success">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Última verificação:</span>
                      <span className="font-medium">Agora</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Verificar Blockchain
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

export default AuditoriaInteligente;