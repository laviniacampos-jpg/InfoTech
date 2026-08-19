import { DatabaseModel } from "./DatabaseModel.js";
import { type ProdutoDTO } from "../dto/ProdutoDTO.js";

const database = new DatabaseModel().pool;



/*
export interface ProdutoDTO {
    id_categoria: number;
    codigo: string;
    nome: string;
    descricao?: string;
    preco_unitario: number;
    quantidade_minima: number;
}
*/

class Produto {
  private idProduto: number = 0;
  private idCategoria: number = 0;
  private codigo: string = "";
  private nome: string;
  private descricao: string = "";
  private preco_unitario: number;
  private quantidade_minima: number;

  constructor(
    _idCategoria: number,
    _codigo: string,
    _nome: string,
    _descricao: string,
    _preco_unitario: number,
    _quantidade_minima: number,
  ) {
    this.idCategoria = _idCategoria;
    this.codigo = _codigo;
    this.nome = _nome;
    this.descricao = _descricao;
    this.preco_unitario = _preco_unitario;
    this.quantidade_minima = _quantidade_minima;
  }

  public getIdProduto(): number {
    return this.idProduto;
  }

  public setIdProduto(_idProduto: number): void {
    this.idProduto = _idProduto;
  }

  public getIdCategoria(): number {
    return this.idCategoria;
  }

  public setIdCategoria(_idCategoria: number): void {
    this.idCategoria = _idCategoria;
  }

  public getCodigo(): string {
    return this.codigo;
  }

  public getNome(): string {
    return this.nome;
  }

  public setNome(_nome: string): void {
    this.nome = _nome;
  }
  public getPrecoUnitario(): number {
    return this.preco_unitario;
  }

  public setPrecoUnitario(_preco: number): void {
    this.preco_unitario = _preco;
  }

  public getQuantidadeMinima(): number {
    return this.quantidade_minima;
  }

  public setQuantidadeMinima(_quantidade: number): void {
    this.quantidade_minima = _quantidade;
  }

   static async cadastrarProduto(produto: ProdutoDTO): Promise<boolean> {
     try {
       const queryInsertProduto = `INSERT INTO produto (nome_produto, preco, disponibilidade)
                                 VALUES
                                 ($1, $2, $3)
                                 RETURNING id_produto;`;
 
       const respostaBD = await database.query(queryInsertProduto, [
         produto.nome.toUpperCase(),
         produto.descricao,
         produto.codigo,
         produto.preco_unitario,
         produto.quantidade_minima
       ]);
       if (respostaBD.rows.length > 0) {
         console.info(`Produto cadastrado com sucesso. ID: ${respostaBD.rows[0].idProduto}`);
         return true;
       }
       return false;
     } catch (error) {
       console.error(`Erro na consulta ao banco de dados. ${error}`);
       return false;
     }
   }
 
  static async listarProduto(): Promise<Array<Produto> | null> {
    try {
      let listaDeProduto: Array<Produto> = [];
      const querySelectProduto = `SELECT * FROM produto ORDER BY nome_produto ASC;`;
      const respostaBD = await database.query(querySelectProduto);

      respostaBD.rows.forEach((produtoBD) => {
        const novoProduto: Produto = new Produto(
          produtoBD.id_categoria,
          produtoBD.codigo,
          produtoBD.nome_produto.toUpperCase(),
          produtoBD.descricao,
          produtoBD.preco_unitario,
          produtoBD.quantidade_minima
        );

        novoProduto.setIdProduto(produtoBD.id_produto);

        listaDeProduto.push(novoProduto);
      });

      return listaDeProduto;
    } catch (error) {
      console.error(`Erro na consulta ao banco de dados. ${error}`);


      return null;
    }
  }

     static async listarProdutoId(idProduto: number): Promise<Produto | null> {
    try {
      const querySelectProduto = `SELECT * FROM produto WHERE id_produto=$1;`;
      const respostaBD = await database.query(querySelectProduto, [idProduto]);

        const novoProduto: Produto = new Produto(
          respostaBD.rows[0].id_categoria,
          respostaBD.rows[0].codigo,
          respostaBD.rows[0].nome_produto.toUpperCase(),
          respostaBD.rows[0].descricao,
          respostaBD.rows[0].preco_unitario,
          respostaBD.rows[0].quantidade_minima
        );

        novoProduto.setIdProduto(respostaBD.rows[0].id_produto);

      return novoProduto;
    } catch (error) {
      console.error(`Erro na consulta ao banco de dados. ${error}`);


      return null;
    }
  }
}

export default Produto;