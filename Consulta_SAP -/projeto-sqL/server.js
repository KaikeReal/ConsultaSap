const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const dbConfig = {
    user: 'sa',
    password: 'Mapfre@2024',
    server: 'MAPFREPE04ENTL',
    database: 'USUARIOS',
    options: {
        encrypt: false,
        enableArithAbort: true
    }
};

sql.connect(dbConfig, err => {
    if (err) {
        console.log('Erro ao conectar ao SQL Server:', err);
    } else {
        console.log('Conectado ao SQL Server');

        // Iniciar o servidor após a conexão com o banco de dados
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    }
});

// Endpoint para buscar usuários pelo SAP
app.get('/usuarios', async (req, res) => {
    try {
        const { SAP } = req.query;
        console.log(`Recebida requisição para SAP: ${SAP}`);
        const request = new sql.Request();
        const query = `SELECT nome, SAP, E_MAIL FROM tbl_usuarios WHERE SAP = '${SAP}'`;
        console.log(`Executando consulta SQL: ${query}`);
        const result = await request.query(query);
        console.log('Resultado da consulta:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        console.log('Erro na consulta SQL:', err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Endpoint para atualizar os dados do usuário
app.put('/usuarios', async (req, res) => {
    try {
        const { SAP } = req.query; // Obtém o SAP da query string
        const { nome, email } = req.body; // Obtém os novos valores do corpo da requisição
        const request = new sql.Request();
        const query = `UPDATE tbl_usuarios SET nome = '${nome}', E_MAIL = '${email}' WHERE SAP = '${SAP}'`;
        await request.query(query);
        res.send('Usuário atualizado com sucesso');
    } catch (err) {
        console.log('Erro na atualização SQL:', err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Endpoint para inserir um novo usuário
app.post('/usuarios', async (req, res) => {
    try {
        const { nome, SAP, email } = req.body; // Obtém os valores do corpo da requisição
        const request = new sql.Request();
        const query = `INSERT INTO tbl_usuarios (nome, SAP, E_MAIL) VALUES ('${nome}', '${SAP}', '${email}')`;
        await request.query(query);
        res.send('Usuário inserido com sucesso');
    } catch (err) {
        console.log('Erro na inserção SQL:', err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Endpoint para deletar um usuário
app.delete('/usuarios', async (req, res) => {
    try {
        const { SAP } = req.query; // Obtém o SAP da query string
        const request = new sql.Request();
        const query = `DELETE FROM tbl_usuarios WHERE SAP = '${SAP}'`;
        await request.query(query);
        res.send('Usuário deletado com sucesso');
    } catch (err) {
        console.log('Erro na exclusão SQL:', err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Endpoint para buscar informações da tabela tbl_chamados
app.get('/chamados', async (req, res) => {
    try {
        const { sap } = req.query;
        const request = new sql.Request();
        const query = `SELECT CHAMADO, SAP, NOME, DESC_ENCERRAMENTO FROM tbl_chamados WHERE SAP = '${sap}'`;
        console.log(`Executando consulta SQL: ${query}`);
        const result = await request.query(query);
        console.log('Resultado da consulta:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        console.log('Erro na consulta SQL:', err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Endpoint básico para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor está rodando!');
});
