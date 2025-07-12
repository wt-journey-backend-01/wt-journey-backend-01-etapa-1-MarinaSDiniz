const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware para processar dados do formulário e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// === API ===

// API: Buscar todos os lanches
app.get('/api/lanches', (req, res) => {
    const dados = lerDadosLanches();
    res.json(dados.lanches);
});

// === ROTAS DE FORMULÁRIOS ===

// Rota GET para sugestão com query string
app.get('/sugestao', (req, res) => {
    const { opcao, ingredientes } = req.query;
    
    if (opcao && ingredientes) {
        const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Sugestão Recebida - DevBurger</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
        <div class = "class-404">
            <div class = "img-404">
                <img src="/imagens/undraw_super-thank-you_flq2.svg" alt="agradecimento">
            </div>
            <div class="content">
                <h2>Obrigado pela sugestão!</h2>
                <p><strong>Opção sugerida:</strong> ${opcao}</p>
                <p><strong>Ingredientes:</strong> ${ingredientes}</p>
                <a class = "volta" href="/">Voltar para a página inicial</a>
            </div>
        </div>
        </body>
        </html>`;
        
        res.status(200).set('Content-Type', 'text/html').send(html);
    } else {
        res.redirect('/');
    }
});

// Rota POST para processar formulário de sugestão
app.post('/sugestao', (req, res) => {
    const { opcao, ingredientes } = req.body;
    
    if (!opcao || !ingredientes) {
        return res.status(400).sendFile(path.join(__dirname, 'public', '404.html'));
    }
    
    console.log(`Sugestão recebida: Opção - ${opcao}, Ingredientes - ${ingredientes}`);
    res.redirect(`/sugestao?opcao=${encodeURIComponent(opcao)}&ingredientes=${encodeURIComponent(ingredientes)}`);
});

// Rota POST para processar contato
app.post('/contato', (req, res) => {
    const { nome, email, assunto } = req.body;
    
    if (!nome || !email || !assunto) {
        return res.status(400).sendFile(path.join(__dirname, 'public', '404.html'));
    }
    
    console.log(`Contato recebido: Nome - ${nome}, Email - ${email}, Assunto - ${assunto}`);
    
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Contato Recebido - DevBurger</title>
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
    <div class = "class-404">
            <div class = "img-404">
                <img src="/imagens/undraw_super-thank-you_flq2.svg" alt="agradecimento">
            </div>
        <div class="content">
            <h2>Mensagem enviada com sucesso!</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Assunto:</strong> ${assunto}</p>
            <a class = "volta "href="/">Voltar para a página inicial</a>
        </div>
    </div>
    </body>
    </html>`;
    
    res.status(200).set('Content-Type', 'text/html').send(html);
});

// Middleware para capturar rotas não encontradas
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
    console.log(`API disponível: GET /api/lanches`);
});