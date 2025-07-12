const express = require('express');
const path = require('path');
const fs = require('fs'); // Para ler arquivos JSON

const app = express();
const PORT = 3000;

// Middleware para processar dados do formulário e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Adicionado para APIs JSON

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Função para ler dados do JSON
function lerDadosLanches() {
    try {
        const dados = fs.readFileSync(path.join(__dirname, 'public', 'data', 'lanches.json'), 'utf8');
        return JSON.parse(dados);
    } catch (error) {
        console.error('Erro ao ler arquivo JSON:', error);
        return { lanches: [], categorias: [] };
    }
}

// === ROTAS DA WEB (HTML) ===

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rota para a página de contato
app.get('/contato', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contato.html'));
});

// === ROTAS DA API (JSON) ===

// API: Buscar todos os lanches
app.get('/api/lanches', (req, res) => {
    const dados = lerDadosLanches();
    res.json(dados.lanches);
});

// API: Buscar lanche por ID
app.get('/api/lanches/:id', (req, res) => {
    const dados = lerDadosLanches();
    const id = parseInt(req.params.id);
    const lanche = dados.lanches.find(l => l.id === id);
    
    if (!lanche) {
        return res.status(404).json({ erro: 'Lanche não encontrado' });
    }
    
    res.json(lanche);
});

// API: Buscar lanches por categoria
app.get('/api/lanches/categoria/:categoria', (req, res) => {
    const dados = lerDadosLanches();
    const categoria = req.params.categoria;
    const lanches = dados.lanches.filter(l => l.categoria === categoria);
    
    res.json(lanches);
});

// API: Buscar todas as categorias
app.get('/api/categorias', (req, res) => {
    const dados = lerDadosLanches();
    res.json(dados.categorias);
});

// API: Buscar lanches disponíveis
app.get('/api/lanches/disponiveis', (req, res) => {
    const dados = lerDadosLanches();
    const disponveis = dados.lanches.filter(l => l.disponivel === true);
    res.json(disponveis);
});

// === ROTAS DE FORMULÁRIOS ===

// Rota para processar o formulário de sugestão
app.post('/sugestao', (req, res) => {
        const { nome, opcao, ingredientes } = req.body;
        
        // Validação básica
        if (!nome || !opcao || !ingredientes) {
            return res.status(400).sendFile(path.join(__dirname, 'public', '404.html'));
        }
        
        console.log(`Sugestão recebida: Nome - ${nome}, Opção - ${opcao}, Ingredientes - ${ingredientes}`);
        res.sendFile(path.join(__dirname, 'views', 'obrigado.html'));
        
});

// Rota para processar o formulário de contato
app.post('/contato', (req, res) => {
        const { nome, email, mensagem } = req.body;
        
        if (!nome || !email || !mensagem) {
            return res.status(400).sendFile(path.join(__dirname, 'public', '404.html'));
        }
        
        console.log(`Contato recebido: Nome - ${nome}, Email - ${email}, Mensagem - ${mensagem}`);
        res.sendFile(path.join(__dirname, 'views', 'obrigado.html'));
        
});

// Rota específica para 404
app.get('/404', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Middleware para capturar rotas não encontradas
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Middleware de tratamento de erros globais
app.use((err, req, res, next) => {
    console.error('Erro interno do servidor:', err);
    res.status(500).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
    console.log(`API disponível em:`);
    console.log(`- GET /api/lanches - Todos os lanches`);
    console.log(`- GET /api/lanches/:id - Lanche específico`);
    console.log(`- GET /api/lanches/categoria/:categoria - Por categoria`);
    console.log(`- GET /api/categorias - Todas as categorias`);
    console.log(`- GET /api/lanches/disponiveis - Apenas disponíveis`);
});