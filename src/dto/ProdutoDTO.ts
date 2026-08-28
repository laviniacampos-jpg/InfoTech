export interface ProdutoDTO {
    id_produto?: number;
    id_categoria: number;
    codigo: string;
    nome: string;
    descricao?: string;
    preco_unitario: number;
    quantidade_disponivel?: number;
    quantidade_minima: number;
    ativo?: boolean;
    data_cadastro?: Date;
}




/* id_produto INTEGER GENERATED ALWAYS AS IDENTITY,
    id_categoria INTEGER NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco_unitario NUMERIC(10, 2) NOT NULL,
    quantidade_disponivel INTEGER NOT NULL DEFAULT 0,
    quantidade_minima INTEGER NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,*/