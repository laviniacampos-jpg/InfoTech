import type { Request, Response } from "express";
import Movimentacao from "../model/Movimentacao.js";
import type MovimentacaoDTO from "../dto/MovimentacaoDTO.js";

class MovimentacaoController {
    static async todos(_req: Request, res: Response): Promise<Response> {
        try {
            const lista = await Movimentacao.listarMovimentacoes();
            if (lista !== null) return res.status(200).json(lista);
            return res.status(400).json({ mensagem: "Erro ao buscar a lista de movimentações." });
        } catch (error) {
            console.error(`Erro ao listar movimentações: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async MovimentacaoPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(String(req.params.id_movimentacao ?? ""), 10);
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensagem: "O ID da movimentação fornecido é inválido." });
            }
            const movimentacao: MovimentacaoDTO | null = await Movimentacao.listarMovimentacao(id);
            if (movimentacao) return res.status(200).json(movimentacao);
            return res.status(404).json({ mensagem: "Movimentação não encontrada." });
        } catch (error) {
            console.error(`Erro ao buscar movimentação por ID: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const body = req.body as Partial<MovimentacaoDTO>;
            const idProduto = Number(body.id_produto);
            const quantidade = Number(body.quantidade);
            const preco = Number(body.preco_unitario);
            const tipoInformado = String(body.tipo_movimentacao ?? "").trim().toLocaleUpperCase("pt-BR");
            const tipo = tipoInformado === "SAÍDA" ? "SAIDA" : tipoInformado;
            const motivo = String(body.motivo_movimentacao ?? "").trim().toLocaleUpperCase("pt-BR");
            const motivosPermitidos = ["RECEBIMENTO", "VENDA", "USO_INTERNO", "PERDA", "DANIFICADO"];

            if (!Number.isInteger(idProduto) || idProduto <= 0 || !["ENTRADA", "SAIDA"].includes(tipo) || !motivosPermitidos.includes(motivo) || !Number.isInteger(quantidade) || quantidade <= 0) {
                return res.status(400).json({ mensagem: "Informe produto, tipo, motivo e quantidade positiva válidos." });
            }

            if ((motivo === "RECEBIMENTO" && tipo !== "ENTRADA") || (motivo === "VENDA" && tipo !== "SAIDA")) {
                return res.status(400).json({ mensagem: "O motivo selecionado não é compatível com o tipo da movimentação." });
            }

            if (motivo === "VENDA" && (!Number.isFinite(preco) || preco < 0)) {
                return res.status(400).json({ mensagem: "Informe um preço unitário válido para registrar uma venda." });
            }

            const nova = new Movimentacao(
                0,
                idProduto,
                undefined,
                motivo,
                tipo,
                quantidade,
                motivo === "VENDA" ? preco : 0,
                motivo === "VENDA" ? quantidade * preco : 0,
                String(body.observacao ?? "").trim(),
                body.data_movimentacao ?? new Date(),
                true,
            );

            const sucesso = await Movimentacao.cadastrarMovimentacao(nova);
            if (sucesso) return res.status(201).json({ mensagem: "Movimentação cadastrada com sucesso!" });
            return res.status(400).json({ mensagem: "Não foi possível cadastrar a movimentação no banco de dados." });
        } catch (error) {
            console.error(`Erro ao cadastrar movimentação: ${error}`);
            return res.status(400).json({ mensagem: error instanceof Error ? error.message : "Não foi possível cadastrar a movimentação." });
        }
    }

    static async deletar(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(String(req.params.id_movimentacao ?? ""), 10);
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensagem: "O ID da movimentação fornecido é inválido." });
            }
            const removido = await Movimentacao.removerMovimentacao(id);
            if (removido) return res.status(200).json({ mensagem: "Movimentação removida com sucesso." });
            return res.status(404).json({ mensagem: "Não foi possível remover a movimentação. Verifique se ela existe." });
        } catch (error) {
            console.error(`Erro ao remover movimentação: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(String(req.params.id_movimentacao ?? ""), 10);
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensagem: "O ID da movimentação fornecido é inválido." });
            }

            const body = req.body as Partial<MovimentacaoDTO>;
            const movimentacao = new Movimentacao(
                id,
                Number(body.id_produto),
                body.id_movimentacao_origem,
                String(body.motivo_movimentacao ?? "").trim(),
                String(body.tipo_movimentacao ?? "").trim(),
                Number(body.quantidade),
                Number(body.preco_unitario),
                Number(body.valor_total),
                String(body.observacao ?? "").trim(),
                body.data_movimentacao ?? new Date(),
                body.ativo ?? true,
            );

            if (!movimentacao.getIdProduto() || !movimentacao.getTipoMovimentacao() || movimentacao.getQuantidade() <= 0 || movimentacao.getPrecoUnitario() < 0) {
                return res.status(400).json({ mensagem: "Os dados da movimentação são inválidos." });
            }

            const atualizado = await Movimentacao.atualizarMovimentacao(movimentacao);
            if (atualizado) return res.status(200).json({ mensagem: "Movimentação atualizada com sucesso!" });
            return res.status(404).json({ mensagem: "Não foi possível atualizar a movimentação. Verifique se ela existe." });
        } catch (error) {
            console.error(`Erro ao atualizar movimentação: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }
}

export default MovimentacaoController;
