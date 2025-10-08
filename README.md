# _**M**esquinhômetro **A**utomático e **R**ápido **C**om **I**nteligência **A**rtificial._
![Homepage](https://github.com/kadmielp/MARCIA/raw/main/public/homepage.png)

Uma **aplicação nativa para desktop Windows** divertida que usa IA para analisar o quão mesquinhas são suas reclamações. Compartilhe o que está te incomodando e deixe a IA ser o juiz com humor e sabedoria! Construída com Tauri para uma experiência nativa de desktop.

## Recursos

- 🎯 **Análise de Mesquinhice**: Receba suas reclamações avaliadas em uma escala de 0-100
- 🤖 **Suporte Multi-IA**: Funciona com Claude (Anthropic), OpenAI GPT, Google Gemini, Maritaca e Ollama
- 🇧🇷 **Português Brasileiro**: Interface completamente localizada
- 📊 **Medidor Visual**: Medidor SVG animado mostrando seu nível de mesquinhice
- 📊 **Categorias**: Reclamações são categorizadas de "Mestre Zen" a "Colapso Nuclear"
- 💡 **Conselhos Práticos**: Receba conselhos acionáveis sobre como lidar com suas preocupações
- 🎨 **Interface Moderna**: Interface limpa e responsiva construída com React e Tailwind CSS
- ⚙️ **Painel de Configurações**: Gerenciamento seguro de chaves de API com armazenamento persistente
- 🖥️ **Desktop Nativo**: Construído com Tauri para performance nativa do Windows
- 🔒 **Armazenamento Seguro**: Chaves de API armazenadas com segurança usando a API de sistema de arquivos do Tauri
- 🏗️ **Arquitetura Modular**: Estrutura de código limpa e manutenível com módulos JS separados
- 🎨 **Interface Intuitiva**: Botão de configurações posicionado estrategicamente na parte inferior

## Categorias de Mesquinhice

- 🚨 **Preocupação Legítima** (0-20): *Isso é realmente sério!*
- 😤 **Reclamação Razoável** (21-40): *Justo, isso é irritante*
- 🤔 **Começando a Ficar Mesquinho** (41-60): *Ok, mas talvez respire fundo e siga em frente*
- 😒 **Bem Mesquinho** (61-80): *Vale a pena deixar isso pra lá*
- 🤯 **Pico da Mesquinhice** (81-100): *Sério? Melhor deixar pra lá!*

## Instalação

### Pré-requisitos

- **Rust** (versão estável mais recente) - [Instalar Rust](https://rustup.rs/)
- **Node.js** (v16 ou superior) - [Baixar Node.js](https://nodejs.org/)
- **npm** (vem com Node.js)
- **Chave de API** para seu provedor de IA escolhido

### Configuração

1. **Clone ou baixe este repositório**

2. **Instale as dependências:**
```bash
cd Marcia
npm install
```

3. **Execute o servidor de desenvolvimento:**
```bash
npm run tauri dev
```

4. **Compile o aplicativo de produção:**
```bash
npm run tauri build
```

O executável compilado estará em `src-tauri/target/release/`

## Uso

### Configuração Inicial

1. **Inicie o aplicativo** usando `npm run tauri dev` ou o executável compilado
2. **Clique no botão Configurações** (⚙️) no canto superior direito
3. **Selecione seu provedor de IA** no menu suspenso
4. **Digite sua chave de API** para o provedor selecionado
5. **Salve as configurações** - elas serão armazenadas com segurança no seu sistema

### Provedores de IA Suportados

**🤖 Claude (Anthropic) - Padrão**
- Obter chave de API: [Console Anthropic](https://console.anthropic.com/)
- Modelo: `claude-3-5-sonnet-20241022`

**🤖 OpenAI GPT**
- Obter chave de API: [Plataforma OpenAI](https://platform.openai.com/)
- Modelo: `gpt-4o`

**🤖 Google Gemini**
- Obter chave de API: [Google AI Studio](https://aistudio.google.com/)
- Modelo: `gemini-2.5-flash`

**🤖 Maritaca AI**
- Obter chave de API: [Maritaca AI](https://chat.maritaca.ai/)
- Modelo: `sabia-3.1`

**🤖 Ollama (Local)**
- Instalar: [Ollama](https://ollama.ai/)
- URL padrão: `http://localhost:11434/v1`
- Modelos: `gemma3:1b`, `llama2`, `mistral`, etc.

### Analisando Reclamações

1. Digite ou selecione uma reclamação dos exemplos:
   - Respiração alta
   - Segurar a porta sem agradecer
   - Esquentar peixe no micro-ondas no trabalho
   - Papel higiênico colocado ao contrário

2. Clique em "Medir minha mesquinhice!"

3. Revise seu:
   - **Pontuação de Mesquinhice** (0-100)
   - **Categoria** de classificação
   - **Julgamento** sobre sua reclamação
   - **Conselho** para lidar com isso

## Estrutura do Projeto

```
Marcia/
├── src/
│   ├── index.html              # Ponto de entrada HTML principal (limpo, mínimo)
│   ├── data/
│   │   └── translations.json   # Traduções multilíngues
│   └── js/                     # Arquitetura JavaScript modular
│       ├── lucide-icons.js     # Componentes de ícones
│       ├── ai-service.js       # Lógica dos provedores de IA
│       ├── components-sections.js # Sub-componentes da UI
│       ├── components.js       # Componente React principal
│       └── main.js             # Inicialização do aplicativo
├── src-tauri/
│   ├── src/
│   │   └── main.rs             # Backend Rust (armazenamento de configurações)
│   ├── tauri.conf.json         # Configuração do Tauri
│   ├── Cargo.toml              # Dependências Rust
│   └── icons/                  # Ícones do aplicativo
├── package.json                # Dependências e scripts Node.js
├── .gitignore                  # Padrões de ignore do Git
├── BUILD_INSTRUCTIONS.md       # Instruções detalhadas de compilação
└── README.md                   # Este arquivo
```

## Detalhes Técnicos

### Arquitetura Frontend
- **React 18** (build UMD para compatibilidade com Tauri)
- **JavaScript Modular** - Separação limpa de responsabilidades
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Babel standalone** para transformação JSX
- **Carregamento dinâmico de traduções** de arquivos JSON

### Backend
- **Backend Rust Tauri** para funcionalidade nativa de desktop
- **Armazenamento seguro de configurações** usando a API de sistema de arquivos do Tauri
- **Requisições HTTP** para múltiplos provedores de IA
- **Nenhum servidor local necessário** - chamadas diretas de API

### Organização do Código
- **`lucide-icons.js`** - Definições de componentes de ícones
- **`ai-service.js`** - Configurações de provedores de IA e chamadas de API
- **`components-sections.js`** - Sub-componentes de UI reutilizáveis
- **`components.js`** - Componente principal da aplicação React
- **`main.js`** - Inicialização e orquestração da aplicação

## Configuração

As configurações são armazenadas com segurança usando a API de sistema de arquivos do Tauri:
- **Seleção de provedor de IA** (Claude, OpenAI, Gemini, Maritaca, Ollama)
- **Chaves de API** (armazenamento criptografado por provedor)
- **Configuração do Ollama** (URL e modelo)
- **Interface em português brasileiro** (fixo)

Localização do arquivo de configurações: `%APPDATA%\com.marcia.app\settings.json`

## Integração de API

O aplicativo faz requisições HTTP diretas para provedores de IA:

- **OpenAI**: `https://api.openai.com/v1/chat/completions`
- **Claude**: `https://api.anthropic.com/v1/messages`
- **Gemini**: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- **Maritaca**: `https://chat.maritaca.ai/api/chat/completions`
- **Ollama**: `http://localhost:11434/v1/chat/completions`

## Exemplos

```
Entrada: "Meu colega de quarto respira muito alto"
Saída:
- Pontuação: 15
- Categoria: Preocupação Legítima (0-20)
- Julgamento: "Isso é realmente sério! Respiração alta pode ser um problema médico."
- Conselho: "Converse com seu colega de quarto sobre isso respeitosamente."
```

```
Entrada: "Alguém colocou o papel higiênico ao contrário"
Saída:
- Pontuação: 85
- Categoria: Pico da Mesquinhice (81-100)
- Julgamento: "Sério? Melhor deixar pra lá! Isso é o ápice da mesquinhice."
- Conselho: "Respire fundo e vire o rolo. A vida é muito curta para isso."
```

## Localização

O aplicativo está completamente localizado em português brasileiro:
- 🇧🇷 **Português (pt-BR)** - Interface, textos e respostas da IA

Todas as traduções são carregadas de `src/data/translations.json` em tempo de execução, garantindo uma experiência totalmente nativa para usuários brasileiros.

Construído com:
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Tauri](https://tauri.app/)
- [Anthropic Claude](https://www.anthropic.com/)

## 🙏 **Créditos e Agradecimentos**

### **Inspiração e Código Base**
- **[Claude Artifact](https://claude.ai/artifacts/inspiration/2c85cf8a-4f5e-4f89-af3c-e177bc5327ea)** - Analisador de Mesquinhice original que inspirou esta versão aprimorada

## Aviso Legal

Este aplicativo é para fins de entretenimento. Os julgamentos e conselhos da IA devem ser tomados com humor! 😄
