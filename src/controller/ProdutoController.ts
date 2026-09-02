import Produto from "../model/Produto.js";

import type { Request, Response } from "express";

class ProdutoController extends Produto {
    static async todos(req: Request, res: Response): Promise<Response> {
        try {

            const listaProduto: Array<Produto> | null = await Produto.listarProduto();
            return res.status(200).json(listaProduto);
        } catch (error) {
            console.error(`Erro ao consultar modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possivel acessar a lista de produtos." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            console.log(req.body);
            const dadosRecebidosProduto = req.body;
            console.log(dadosRecebidosProduto);
            const respostaModelo = await Produto.cadastrarProduto(dadosRecebidosProduto);

            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Produto cadastrado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar produto." });
            }
        } catch (error) {
            console.error(`Erro no modelo. ${error}`);
            if (
                typeof error === "object" &&
                error !== null &&
                "constraint" in error &&
                error.constraint === "uq_produto_codigo"
            ) {
                return res.status(409).json({ message: "Código de produto já existe." });
            }

            return res.status(400).json({ message: "Erro ao cadastrar produto no banco." });
        }
    }

    static async id(req: Request, res: Response): Promise<Response> {
        try {
            const idProduto: number = parseInt(req.params.idProduto as string);
            const respostaModel = await Produto.listarProdutoId(idProduto);
            return res.status(200).json(respostaModel);
        } catch (error) {
            console.error(`Erro no modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível obter informações do produto." });
        }
    }

   // ...existing code...

static async deletar(req: Request, res: Response): Promise<Response> {
    try {
        const idProduto: number = parseInt(req.params.idProduto as string);

        const respostaModelo = await Produto.removerProduto(idProduto);

        if (respostaModelo) {
            return res.status(200).json({ mensagem: "Produto removido com sucesso." });
        } else {
            return res.status(400).json({ mensagem: "Erro ao remover produto." });
        }
    } catch (error) {
        console.error(`Erro no modelo. ${error}`);
        return res.status(500).json({ mensagem: "Não foi possível remover o produto." });
    }
}
 static async atualizar(req: Request, res: Response): Promise<Response> {
    try {
        const idProduto: number = parseInt(req.params.idProduto as string);
        const dadosAtualizados = req.body;
        const respostaModelo = await Produto.atualizarProduto(idProduto, dadosAtualizados);

        if (respostaModelo) {
            return res.status(200).json({ mensagem: "Produto atualizado com sucesso." });
        } else {
            return res.status(400).json({ mensagem: "Erro ao atualizar produto." });
        }
    } catch (error) {
        console.error(`Erro no modelo. ${error}`);
        return res.status(500).json({ mensagem: "Não foi possível atualizar o produto." });
    }
}
}
export default ProdutoController;