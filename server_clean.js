const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));
// Rota para processar o formulário de sugestão
app.post('/sugestao', (req, res) => {
    const { opcao, ingredientes } = req.body;
    console.log(`Sugestão recebida: Opção - ${opcao}, Ingredientes - ${ingredientes}`);
    
    // Aqui você pode adicionar lógica para salvar a sugestão em um banco de dados ou arquivo
    
    res.sendFile(path.join(__dirname, 'view', 'obrigado.html'));
});

// Rota para 404
app.get('/404', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
});
