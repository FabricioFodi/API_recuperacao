const express = require('express');
const app = express();
app.use(express.json());

porta = 3000;

let clientes = [];
let carros = [];
let servicos = [];
let agendamentos = [];
let contadorClienteID = 1;
let contadorCarroID = 1;
let contadorServicoID = 1;
let contadorAgendamentoID = 1;


function validarCliente(req, res, next) {
    const { nome, telefone } = req.body;
    if (!nome || nome.length < 3) {
        return res.status(400).json({
            mensagem: "'Nome' deve ter no mínimo 3 caracteres"
        });
    }
    if (nome.length > 100) {
        return res.status(400).json({
            mensagem: "'Nome' deve ter no máximo 100 caracteres"
        });
    }
    if (!telefone || telefone.length !== 11) {
        return res.status(400).json({
            mensagem: "'Telefone' deve ter 11 dígitos"
        });
    }
    if (!/^d+$/.test(cpf)) {
        return res.status(400).json({
            mensagem: "'Telefone' deve conter apenas números"
        });
    }
    next();
}

function validarCarro(req, res, next) {
    const { marca, modelo, tamanho } = req.body
    if (!marca || marca.length < 3) {
        return res.status(400).json({
            mensagem: "'Marca' deve conter no mínimo 3 caracteres"
        });
    }
    if (marca.length > 50) {
        return res.status(400).json({
            mensagem: "'Marca' deve conter no máximo 50 caracteres"
        });
    }
    if (!modelo || modelo.length < 2) {
        return res.status(400).json({
            mensagem: "'Modelo' deve conter no mínimo 2 caracteres"
        });
    }
    if (modelo.length > 50) {
        return res.status(400).json({
            mensagem: "'Modelo' deve conter no máximo 50 caracteres"
        });
    }
    if (marca !== 'Hatch', 'Sedan', 'SUV', 'Picape') {
        return res.status(400).json({
            mensagem: "'Tamanho' deve ser Hatch, Sedan, SUV ou Picape"
        });
    }
    next();
}

function validarServicos(req, res, next) {
    const { descricao, valores } = req.body;

    if (!descricao || descricao.length < 5) {
        return res.status(400).json({
            mensagem: "'descricao' deve conter no mínimo 5 caracteres"
        });
    }
    if (descricao.length > 100) {
        return res.status(400).json({
            mensagem: "'descricao' deve conter no máximo 100 caracteres"
        });
    }
    if (!valores > 0) {
        return res.status(400).json({
            mensagem: "'Valor' deve ser maior que 0"
        });
    }
    next();
}

function validaAgendamento (req, res, next){
    const { id_carro, id_servico, data_hora } = req.body;
    const carro = carros.find((carro) => carro.id === Number(id));
    const servico = servicos.find((servico) => servico.id === Number(id));
    if(id_carro !== carro){
        return res.status(400).json({
            mensagem:  "'id_carro' não corresponde a um carro cadastrado"
        });
    }
    if(id_servico !== servico){
        return res.status(400).json({
            mensagem: "'id_servico' não corresponde a um serviço cadastrado"
        });
    }
    if(!data_hora){
        return res.status(400).json({
            mensagem: "'data_hora' deve ser informado"
        });
    }
    next();
}
//Clientes

app.get('/clientes', (req, res) => {
    if (!clientes || clientes.length === 0) {
        return res.status(404).json({
            mensagem: 'Nenhum cliente encontrado'
        });
    }
    res.status(200).json(clientes);
});

app.post('/clientes', validarCliente, (req, res) => {
    const { nome, telefone } = req.body
    const id = contadorClienteID++;
    clientes.push({
        id,
        nome,
        telefone
    });
    res.status(201).json({
        mensagem: 'Cliente adicionado com sucesso'
    });
});

app.get('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const cliente = clientes.find((cliente) => cliente.id === Number(id));
    if (!cliente) {
        return res.status(404).json({
            mensagem: 'Cliente não encontrado'
        });
    }
    res.status(200).json(cliente);
});

app.put('/clientes/:id', validarCliente, (req, res) => {
    const { id } = req.params;
    const { nome, telefone } = req.body;
    const cliente = clientes.find((cliente) => cliente.id === Number(id));
    if (!cliente) {
        return res.status(404).json({
            mensagem: "Cliente não encontrado"
        });
    }
    clientes.nome = nome;
    clientes.telefone = telefone;
    res.status(201).json({
        mensagem: "Cliente atualizado com sucesso"
    });
});

app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const cliente = clientes.find((cliente) => cliente.id === Number(id));
    if (!cliente) {
        return res.status(404).json({
            mensagem: "Cliente não encontrado"
        });
    }
    res.status(200).json({
        mensagem: "Cliente excluido com sucesso"
    });
});

//Carros

app.get('/carros', (req, res) => {
    if (!carros || carros.length === 0) {
        return res.status(404).json({
            mensagem: 'Nenhum carro encontrado'
        });
    }
    res.status(200).json(carros);
});

app.post('/carros', validarCarro, (req, res) => {
    const cliente = clientes.find((cliente) => cliente.id === Number(id));
    const { marca, modelo, tamanho, id_cliente } = req.body
    const id = contadorCarroID++;
    if (cliente !== id_cliente) {
        return res.status(400).json({
            mensagem: "'id_cliente' não corresponde a um cliente cadastrado"
        });
    }
    carros.push({
        id,
        marca,
        modelo,
        tamanho,
        id_cliente
    });
    res.status(201).json({
        mensagem: 'Carro adicionado com sucesso'
    });
});

app.get('/carros/:id', (req, res) => {
    const { id } = req.params;
    const carro = carros.find((carro) => carro.id === Number(id));
    if (!carro) {
        return res.status(404).json({
            mensagem: 'Carro não encontrado'
        });
    }
    res.status(200).json(carro);
});

app.put('/carros/:id', validarCarro, (req, res) => {
    const { id } = req.params;
    const cliente = clientes.find((cliente) => cliente.id === Number(id));
    const { marca, modelo, tamanho, id_cliente } = req.body;
    if (cliente !== id_cliente) {
        return res.status(400).json({
            mensagem: "'id_cliente' não corresponde a um cliente cadastrado"
        });
    }
    carros.marca = marca;
    carros.modelo = modelo;
    carros.tamanho = tamanho;
    carros.id_cliente = id_cliente;
    res.status(201).json({
        mensagem: "Carro atualizado com sucesso"
    });
});

app.delete('/carros/:id', (req, res) => {
    const { id } = req.params;
    const carro = carros.find((carro) => carro.id === Number(id));
    if (!carro) {
        return res.status(404).json({
            mensagem: "Carro não encontrado"
        });
    }
    res.status(200).json({
        mensagem: "Carro excluido com sucesso"
    });
});

//Serviços

app.get('/servicos', (req, res) => {
    if (!servicos || servicos.length === 0) {
        return res.status(404).json({
            mensagem: 'Nenhum carro encontrado'
        });
    }
    res.status(200).json(servicos);
});

app.post('/servicos', validarServicos, (req, res) => {
    const { descricao } = req.body
    const id = contadorServicoID++;
    servicos.push({
        id,
        descricao,
        valores: []
    });
    res.status(201).json({
        mensagem: 'Carro adicionado com sucesso'
    });
});

app.get('/servicos/:id', (req, res) => {
    const { id } = req.params;
    const servico = servicos.find((servico) => servico.id === Number(id));
    if (!servico) {
        return res.status(404).json({
            mensagem: 'Servico não encontrado'
        });
    }
    res.status(200).json(servico);
});

app.put('/servicos/:id', validarServicos, (req, res) => {
    const { id } = req.params;
    const servico = servicos.find((servico) => servico.id === Number(id));
    const { descricao, valores } = req.body;
    if (!servico) {
        return res.status(404).json({
            mensagem: "Serviço não encontrado"
        });
    }
    servicos.descricao = descricao;
    servicos.valores = valores;
    res.status(201).json({
        mensagem: "Serviço atualizado com sucesso"
    });
});

app.delete('/servicos/:id', (req, res) => {
    const { id } = req.params;
    const servico = servicos.find((servico) => servico.id === Number(id));
    if (!servico) {
        return res.status(404).json({
            mensagem: "Servico não encontrado"
        });
    }
    res.status(200).json({
        mensagem: "Servico excluido com sucesso"
    });
});

app.get('/agendamentos', (req, res) => {
    if (!agendamentos || agendamentos.length === 0) {
        return res.status(404).json({
            mensagem: 'Nenhum agendamento encontrado'
        });
    }
    res.status(200).json(agendamentos);
});

app.post('/agendamentos', validaAgendamento, (req, res) => {
    const { id_carro, id_servico, data_hora } = req.body;
    agendamentos.push({
        id,
        id_carro,
        id_servico,
        data_hora
    });
    res.status(201).json({
        mensagem: "Agendamento criado com sucesso"
    });
});


app.listen(porta, () => {
    console.log('Servidor rodando na porta: ', porta);
});

module.exports = { app };