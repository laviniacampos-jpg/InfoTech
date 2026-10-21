import { Router, type Request, type Response } from "express";

import ProdutoController from "./controller/ProdutoController.js";
import MovimentacaoController from "./controller/MovimentacaoController.js"; 
import CategoriaController from "./controller/CategoriaController.js";


const router = Router();


router.get('/', (req: Request, res: Response) => {
    return res
        .status(200) // Status HTTP 200 (OK)
        .json(`Aplicação online. Timestamp: ${new Date()}`);
});

router.post('/api/login', (req: Request, res: Response) => {
    const body = req.body ?? {};
    const email = body.email ?? body.login ?? body.username;
    const senha = body.senha ?? body.password;

    if (!email || !senha) {
        return res.status(400).json({
            message: "Email e senha são obrigatórios."
        });
    }

    return res.status(200).json({
        message: "Login realizado com sucesso",
        token: "dev-token",
        user: {
            email,
        }
    });
});

router.get('/api/produtos', ProdutoController.todos);
router.get('/api/produtos/codigo/:codigo', ProdutoController.cadastrarProduto);
router.get('/api/produtos/:id_produto', ProdutoController.id);
router.post('/api/produtos', ProdutoController.novo);
router.delete('/api/produtos/:id_produto', ProdutoController.deletar);
router.put('/api/produtos/:id_produto', ProdutoController.atualizar);

router.get('/api/movimentacoes', MovimentacaoController.todos);
router.get('/api/movimentacoes/:id_movimentacao', MovimentacaoController.MovimentacaoPorId);
router.post('/api/movimentacoes', MovimentacaoController.novo);
router.delete('/api/movimentacoes/:id_movimentacao', MovimentacaoController.deletar);
router.put('/api/movimentacoes/:id_movimentacao', MovimentacaoController.atualizar);

router.get('/api/categorias', CategoriaController.todos);
router.get('/api/categorias/codigo/:codigo', CategoriaController.categoriaPorId);
router.get('/api/categorias/:id_categoria', CategoriaController.categoriaPorId);
router.post('/api/categorias', CategoriaController.novo);
router.delete('/api/categorias/:id_categoria', CategoriaController.deletar);
router.put('/api/categorias/:id_categoria', CategoriaController.atualizar);

export { router };