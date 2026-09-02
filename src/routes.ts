// Importa o Router do Express — é ele quem permite criar e organizar as rotas da aplicação
// Request e Response são os tipos TypeScript que representam a requisição e a resposta HTTP
// O "type" antes de Request e Response indica que são importações apenas de tipo (não geram código JS)
import { Router, type Request, type Response } from "express";

// Importa os controllers — cada um é responsável por tratar as requisições de sua entidade
// É o controller quem recebe os dados da requisição, chama o model e devolve a resposta ao cliente
import ProdutoController from "./controller/ProdutoController.js";
import { Auth } from './middlewares/Auth.js';
// Cria uma instância do Router — é neste objeto que todas as rotas serão registradas
// O router é depois exportado e conectado ao servidor principal (geralmente no app.ts ou server.ts)


const router = Router();

router.post('/api/login', Auth.validacaoEmail);

/**
 * Endpoint padrão
 */
// Rota GET na raiz "/" — serve para verificar se a API está no ar (chamada de "health check")
// Quando acessada, retorna uma mensagem simples confirmando que o servidor está funcionando
router.get('/', (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Aplicação online.", timestamp: new Date() });
});

// ==================== ENDPOINTS DE Produto ====================
// Padrão REST: cada operação usa um método HTTP diferente no mesmo recurso (/api/alunos)
// GET    → leitura       POST → criação
// PUT    → atualização   DELETE → remoção

// Lista todos os produtos ativos — o controller chama o model e retorna o array em JSON
router.get('/api/produtos', ProdutoController.todos);

// Busca um produto específico pelo ID informado na URL
// ":id" é um parâmetro dinâmico — ex: GET /api/produtos/3 busca o produto de ID 3
// O valor é lido no controller via req.params.id
router.get('/api/produtos/:id', ProdutoController.produto);

// Cadastra um novo produto — os dados chegam no corpo (body) da requisição em formato JSON
// O body é lido no controller via req.body
router.post('/api/produtos', ProdutoController.novo);

// Remove logicamente o produto com o ID informado — não apaga do banco, apenas desativa (status = FALSE)
// Também desativa todos os empréstimos relacionados ao produto
router.delete('/api/produtos/:id', ProdutoController.removerProduto);

// Atualiza os dados do aluno com o ID informado
// O ID vem pela URL (req.params.id) e os novos dados vêm no body (req.body)
router.put('/api/produtos/:id', ProdutoController.atualizar);


// Exporta o router para que possa ser registrado no servidor principal da aplicação
// O uso de "export { router }" (exportação nomeada) ao invés de "export default" permite
// importar com um nome explícito: import { router } from "./routes.js"

export { router }
