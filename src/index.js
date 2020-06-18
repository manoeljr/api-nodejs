// Exportando o express para controla rotas
const express = require('express');
const { uuid, isUuid } = require('uuidv4');
// Iniciando aplicacao
const app = express();

//Lendo dados no formato JSON 
app.use(express.json());

const projects = [];

/**
 * Middleware, Inteceptadores de requisições que interromper 
 * totalmente a requisição  ou alterar dados da requisição
 */
function logRequests(request, response, next) {
    const { method, url } = request;
    const logLabel = `[${method.toUpperCase}] ${url}`;
    console.log(logLabel);
    return next();
}

function validateProjectId(request, response, next) {
    const { id } = request.params;
    if (!isUuid(id)) {
        return response.status(400).json({ message: "Invalid project ID."})
    }
    return next();
}

// Aplicando o Middleware
app.use(logRequests);
app.use('/projects/:id', validateProjectId)

// Controlando rotas
app.get('/projects', (request, response) => {
    const { title } = request.query;
    const results = title 
        ? projects.filter(project => project.title.includes(title))
        : projects;

    response.json(results);
});

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;
    const project = { id: uuid(), title, owner };
    projects.push(project);
    response.json(project);
});

app.put('/projects/:id', (request, response) => {
    // Pegando parametros na requisição
    const { id } = request.params;
    const { title, owner } = request.body;
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if(projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.'})
    }

    const project = {
        id,
        title,
        owner,
    };  

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    // Pegando parametros na requisição
    const { id } = request.params;
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if(projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.'})
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

// Escutando uma porta na aplicacao
app.listen(3333, () => {
   console.log('Back-end started !') 
});