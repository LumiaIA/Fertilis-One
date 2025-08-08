# Documentação Completa - Projeto Fertilis One

## Visão Geral do Projeto

O **Fertilis One** é uma plataforma digital centralizada para gestão industrial que utiliza **Inteligência Artificial** e **Blockchain** para automatizar o PCP (Planejamento e Controle da Produção) e garantir eficiência total na produção industrial.

### Informações Técnicas
- **Nome do Projeto**: vite_react_shadcn_ts
- **Versão**: 0.0.0
- **Tipo**: Aplicação React com TypeScript
- **Build Tool**: Vite
- **Framework UI**: shadcn/ui + Tailwind CSS

## Arquitetura e Tecnologias

### Stack Tecnológico Principal
- **Frontend**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.11 + shadcn/ui
- **Roteamento**: React Router DOM 6.26.2
- **State Management**: TanStack React Query 5.56.2
- **Formulários**: React Hook Form 7.53.0 + Zod 3.23.8
- **Ícones**: Lucide React 0.462.0
- **Animações**: Tailwind CSS Animate

### Dependências Principais
```json
{
  "@radix-ui/*": "Componentes UI primitivos",
  "@tanstack/react-query": "Gerenciamento de estado servidor",
  "react-router-dom": "Roteamento SPA",
  "tailwindcss": "Framework CSS utilitário",
  "lucide-react": "Biblioteca de ícones",
  "zod": "Validação de esquemas",
  "class-variance-authority": "Variantes de componentes"
}
```

## Estrutura de Arquivos

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes shadcn/ui (42 componentes)
│   ├── FertilisLogo.tsx # Logo da aplicação
│   ├── ModuleCard.tsx   # Card de módulo do sistema
│   └── Sidebar.tsx      # Barra lateral de navegação
├── hooks/               # Hooks customizados
│   ├── use-mobile.tsx   # Hook para detecção mobile
│   └── use-toast.ts     # Hook para notificações
├── lib/                 # Utilitários
│   └── utils.ts         # Função de merge de classes CSS
├── pages/               # Páginas da aplicação
│   ├── Dashboard.tsx    # Página principal do dashboard
│   ├── Index.tsx        # Página inicial (redireciona para Dashboard)
│   └── NotFound.tsx     # Página 404
├── App.tsx              # Componente raiz da aplicação
├── main.tsx             # Ponto de entrada da aplicação
├── index.css            # Estilos globais e design system
└── vite-env.d.ts        # Tipos do Vite
```

## Sistema de Rotas

### Configuração de Rotas (App.tsx)
```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Páginas Disponíveis

1. **Rota Principal (`/`)**
   - **Componente**: `Index.tsx`
   - **Funcionalidade**: Redireciona para o Dashboard
   - **Código**: `return <Dashboard />;`

2. **Página 404 (`*`)**
   - **Componente**: `NotFound.tsx`
   - **Funcionalidade**: Página de erro para rotas inexistentes
   - **Features**: Log de erro no console, link de retorno

## Análise Detalhada das Páginas

### Dashboard.tsx - Página Principal

**Funcionalidades Principais:**
- Dashboard principal do sistema Fertilis One
- Exibição de 8 módulos do sistema
- Estatísticas em tempo real
- Seção de tecnologias avançadas
- Interface responsiva com sidebar

**Estrutura de Dados:**

#### Módulos do Sistema (8 módulos):
1. **Integração Total de Dados** - Conecta ERP, sistemas logísticos via API/IoT
2. **Motor de Sequenciamento Inteligente** - IA para ordem ótima de produção
3. **Execução Operacional Guiada** - Instruções para operadores
4. **Painel de Controle & War Room** - Dashboard customizável com KPIs
5. **Rastreabilidade & Auditoria** - Registro completo de decisões
6. **Aprendizado Contínuo** - IA supervisionada para melhoria
7. **Escalabilidade & Customização** - Expansão multi-planta
8. **Registro Blockchain** - Trilha inviolável de decisões

#### Estatísticas Exibidas:
- **Eficiência Operacional**: 94% (+12%)
- **Redução de Setups**: 67% (+23%)
- **Conformidade**: 99.8% (+5%)
- **Alertas Ativos**: 3 (-45%)

**Layout da Página:**
```typescript
<div className="min-h-screen bg-gradient-subtle flex">
  <Sidebar />                    // Barra lateral
  <main>
    {/* Hero Section */}          // Título e estatísticas
    {/* Modules Grid */}          // Grid de módulos 2x4
    {/* Technology Stack */}      // Seção de tecnologias
  </main>
</div>
```

### NotFound.tsx - Página de Erro

**Funcionalidades:**
- Página 404 simples e funcional
- Log automático de tentativas de acesso
- Link de retorno para página inicial
- Design minimalista

## Análise dos Componentes

### FertilisLogo.tsx
**Propósito**: Logo oficial do sistema
**Elementos**:
- Ícone de folha (Leaf) com gradiente
- Indicador amarelo no canto
- Texto "Fertilis One" + subtítulo
- Totalmente customizável via props

### ModuleCard.tsx
**Propósito**: Card para exibir módulos do sistema
**Props Interface**:
```typescript
interface ModuleCardProps {
  icon: LucideIcon;        // Ícone do módulo
  title: string;           // Título do módulo
  description: string;     // Descrição
  features: string[];      // Lista de funcionalidades
  isActive?: boolean;      // Estado ativo
  onClick?: () => void;    // Callback de clique
  className?: string;      // Classes CSS adicionais
}
```

**Features Visuais**:
- Gradientes suaves no hover
- Indicador de módulo ativo
- Lista de funcionalidades com bullets
- Animações de transição
- Sombras elegantes

### Sidebar.tsx
**Propósito**: Navegação lateral principal
**Funcionalidades**:
- Menu responsivo (mobile + desktop)
- 8 módulos navegáveis
- Estado ativo visual
- Logo no header
- Footer com versão
- Overlay para mobile

**Estrutura**:
```typescript
<div className="sidebar">
  <header>                 // Logo Fertilis
  <nav>                    // Lista de módulos
    {modules.map(...)}     // 8 botões de módulo
  </nav>
  <footer>                 // Versão do sistema
</div>
```

## Design System e Estilos

### Paleta de Cores (HSL)
```css
/* Cores principais */
--background: 0 0% 100%;           /* Branco */
--foreground: 149 45% 17%;         /* Verde escuro texto */
--sidebar-primary: 149 89% 15%;    /* Verde escuro sidebar */
--accent-yellow: 55 100% 85%;      /* Amarelo destaque */

/* Gradientes */
--gradient-primary: linear-gradient(135deg, hsl(149 89% 15%), hsl(149 70% 25%));
--gradient-subtle: linear-gradient(180deg, hsl(0 0% 100%), hsl(149 15% 98%));
--gradient-surface: linear-gradient(135deg, hsl(149 15% 98%), hsl(0 0% 100%), hsl(149 10% 97%));
```

### Sombras Customizadas
```css
--shadow-elegant: 0 10px 30px -10px hsl(149 89% 15% / 0.1);
--shadow-glow: 0 0 40px hsl(55 100% 85% / 0.2);
--shadow-card: 0 4px 20px hsl(149 89% 15% / 0.08);
```

### Transições
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-fast: all 0.15s ease-out;
```

## Configurações do Projeto

### Vite Configuration
- **Servidor**: Host "::" na porta 8080
- **Plugin**: React SWC para build otimizada
- **Alias**: `@` aponta para `./src`
- **Modo desenvolvimento**: Component tagger ativo

### Tailwind Configuration
- **Tema estendido** com cores da marca
- **Gradientes customizados** como background-image
- **Sombras personalizadas** para elementos
- **Animações** para acordeão e transições
- **Plugin**: tailwindcss-animate

### TypeScript Configuration
- **Configuração modular**: app.json + node.json
- **Strict mode** habilitado
- **Path mapping** para imports absolutos
- **Target**: ES2020

## Hooks Customizados

### useIsMobile
**Arquivo**: `src/hooks/use-mobile.tsx`
**Funcionalidade**: Detecta se o dispositivo é mobile (< 768px)
**Uso**: Responsividade condicional em componentes

### useToast
**Arquivo**: `src/hooks/use-toast.ts`
**Funcionalidade**: Sistema de notificações toast
**Integração**: Sonner + Radix UI Toast

## Componentes UI (shadcn/ui)

O projeto utiliza **42 componentes** da biblioteca shadcn/ui:

**Componentes de Layout**:
- `card`, `separator`, `sheet`, `sidebar`

**Componentes de Formulário**:
- `button`, `input`, `textarea`, `checkbox`, `radio-group`, `select`, `slider`, `switch`

**Componentes de Navegação**:
- `breadcrumb`, `menubar`, `navigation-menu`, `pagination`, `tabs`

**Componentes de Feedback**:
- `alert`, `badge`, `progress`, `skeleton`, `toast`, `tooltip`

**Componentes de Overlay**:
- `alert-dialog`, `dialog`, `drawer`, `hover-card`, `popover`

## Funcionalidades Principais

### 1. Sistema Modular
- **8 módulos** principais do sistema industrial
- **Navegação** via sidebar com estados ativos
- **Cards interativos** com hover effects

### 2. Dashboard Responsivo
- **Layout flexível** para desktop e mobile
- **Grid adaptativo** para módulos e estatísticas
- **Sidebar colapsável** em dispositivos móveis

### 3. Design System Consistente
- **Paleta de cores** industrial (verdes + amarelo)
- **Gradientes suaves** em toda interface
- **Tipografia** hierárquica clara
- **Sombras elegantes** para profundidade

### 4. Experiência do Usuário
- **Transições suaves** em todas interações
- **Estados visuais** claros (ativo, hover, focus)
- **Feedback visual** imediato
- **Acessibilidade** via Radix UI primitives

## Pontos de Melhoria Identificados

### Rotas
- **Limitação atual**: Apenas uma rota funcional (`/`)
- **Sugestão**: Implementar rotas específicas para cada módulo
- **Exemplo**: `/modulos/integracao`, `/modulos/sequenciamento`

### Estado Global
- **Atual**: Estado local no Dashboard
- **Sugestão**: Context API ou Zustand para estado global
- **Benefício**: Persistência de seleção entre navegações

### Funcionalidades
- **Atual**: Interface estática
- **Sugestão**: Integração com APIs reais
- **Módulos**: Dados dinâmicos, filtros, busca

## Conclusão

O projeto **Fertilis One** apresenta uma arquitetura sólida e moderna para uma plataforma de gestão industrial. Utiliza as melhores práticas do ecossistema React/TypeScript com um design system bem estruturado e componentes reutilizáveis.

**Pontos Fortes**:
- ✅ Arquitetura moderna e escalável
- ✅ Design system consistente
- ✅ Componentes bem estruturados
- ✅ Interface responsiva
- ✅ Código TypeScript tipado
- ✅ Performance otimizada (Vite + SWC)

**Oportunidades**:
- 🔄 Expansão do sistema de rotas
- 🔄 Integração com APIs backend
- 🔄 Implementação de estado global
- 🔄 Testes automatizados
- 🔄 Documentação de componentes (Storybook)

O projeto está bem preparado para evolução e implementação de funcionalidades mais avançadas, mantendo a qualidade e consistência do código atual.