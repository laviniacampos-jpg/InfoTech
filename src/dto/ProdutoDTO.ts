export interface ProdutoDTO {
    id_categoria: number;
    codigo: string;
    nome: string;
    descricao?: string;
    preco_unitario: number;
    quantidade_minima: number;
}