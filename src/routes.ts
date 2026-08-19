import express from "express";
import ProdutoController from "./controller/ProdutoController.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        mensagem: "InfoTech API Online",
        timestamp: new Date().toLocaleString("pt-BR")
    });
});
// Produto
router.get("/api/produtos", ProdutoController.todos);
router.get("/api/produtos/:idProduto", ProdutoController.id);
router.post("/api/produtos", ProdutoController.novo);

export { router };