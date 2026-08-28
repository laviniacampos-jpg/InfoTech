import { DatabaseModel } from "./DatabaseModel.js";
import { type ProdutoDTO } from "../dto/ProdutoDTO.js";

const database = new DatabaseModel().pool;

class Produto {
  private idProduto: number = 0;
  private idCategoria: number = 0;
  private codigo: string = "";
  private nome: string;
  private descricao: string = "";
  private preco_unitario: number;
  private quantidade_disponivel: number = 0;
  private quantidade_minima: number;
  private ativo: boolean = true;
  private data_cadastro: Date = new Date();

  constructor(
    idProduto: number,
    _idCategoria: number,
    _codigo: string,
    _nome: string,
    _descricao: string,
    _preco_unitario: number,
    _quantidade_disponivel: number,
    _quantidade_minima: number,
    _ativo: boolean,
    _data_cadastro: Date
  ) {
    this.idProduto = idProduto;
    this.idCategoria = _idCategoria;
    this.codigo = _codigo;
    this.nome = _nome;
    this.descricao = _descricao;
    this.preco_unitario = _preco_unitario;
    this.quantidade_disponivel = _quantidade_disponivel;
    this.quantidade_minima = _quantidade_minima;
    this.ativo = _ativo;
    this.data_cadastro = _data_cadastro;
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
  public setCodigo(_codigo: string): void {
    this.codigo = _codigo;
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

  public getQuantidadeDisponivel(): number {
    return this.quantidade_disponivel;
  }

  public setQuantidadeDisponivel(_quantidade: number): void {
    this.quantidade_disponivel = _quantidade;
  }

  public getAtivo(): boolean {
    return this.ativo;
  }

  public setAtivo(_ativo: boolean): void {
    this.ativo = _ativo;
  }

  public getDataCadastro(): Date {
    return this.data_cadastro;
  }

  public setDataCadastro(_data: Date): void {
    this.data_cadastro = _data;
  }
  public getDescricao(): string {
    return this.descricao;
  }
  public setDescricao(_descricao: string): void {
    this.descricao = _descricao;
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
         produto.quantidade_minima,
         produto.quantidade_disponivel,
          produto.ativo,
          produto.data_cadastro,
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
          produtoBD.id_produto,
          produtoBD.id_categoria,
          produtoBD.codigo,
          produtoBD.nome_produto.toUpperCase(),
          produtoBD.descricao,
          produtoBD.preco_unitario,
          produtoBD.quantidade_minima,
          produtoBD.quantidade_disponivel,
          produtoBD.ativo,
          produtoBD.data_cadastro
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
          respostaBD.rows[0].id_produto,
          respostaBD.rows[0].id_categoria,
          respostaBD.rows[0].codigo,
          respostaBD.rows[0].nome_produto.toUpperCase(),
          respostaBD.rows[0].descricao,
          respostaBD.rows[0].preco_unitario,
          respostaBD.rows[0].quantidade_minima,
          respostaBD.rows[0].quantidade_disponivel,
          respostaBD.rows[0].ativo,
          respostaBD.rows[0].data_cadastro
        );

        novoProduto.setIdProduto(respostaBD.rows[0].id_produto);

      return novoProduto;
    } catch (error) {
      console.error(`Erro na consulta ao banco de dados. ${error}`);


      return null;
    }
  }
  static async removerProduto(id: number): Promise<boolean> { 
    try {
      const queryDeleteProduto = `DELETE FROM produto WHERE id_produto = $1;`;
      const respostaBD = await database.query(queryDeleteProduto, [id]);

      if (respostaBD.rowCount !== null && respostaBD.rowCount > 0) {
        console.info(`Produto removido com sucesso. ID: ${id}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Erro na consulta ao banco de dados. ${error}`);
      return false;
    }
  }
  static async atualizarProduto(id: number, produto: ProdutoDTO): Promise<boolean> {
    try {
      const queryUpdateProduto = `UPDATE produto SET nome_produto = $1, descricao = $2, codigo = $3, preco_unitario = $4, quantidade_minima = $5, quantidade_disponivel = $6, ativo = $7 WHERE id_produto = $8;`;
      const respostaBD = await database.query(queryUpdateProduto, [
        produto.nome.toUpperCase(),
        produto.descricao,
        produto.codigo,
        produto.preco_unitario,
        produto.quantidade_minima,
        produto.quantidade_disponivel,
        produto.ativo,
        id
      ]);

      if (respostaBD.rowCount !== null && respostaBD.rowCount > 0) {
        console.info(`Produto atualizado com sucesso. ID: ${id}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Erro na consulta ao banco de dados. ${error}`);
      return false;
    }
  }
static async produto(id: number): Promise<Produto | null> {
    try {
      const querySelectProduto = `SELECT * FROM produto WHERE id_produto=$1;`;
      const respostaBD = await database.query(querySelectProduto, [id]);

      if (respostaBD.rows.length > 0) {
        const novoProduto: Produto = new Produto(
          respostaBD.rows[0].id_produto,
          respostaBD.rows[0].id_categoria,
          respostaBD.rows[0].codigo,
          respostaBD.rows[0].nome_produto.toUpperCase(),
          respostaBD.rows[0].descricao,
          respostaBD.rows[0].preco_unitario,
          respostaBD.rows[0].quantidade_minima,
          respostaBD.rows[0].quantidade_disponivel,
          respostaBD.rows[0].ativo,
          respostaBD.rows[0].data_cadastro
        );

        novoProduto.setIdProduto(respostaBD.rows[0].id_produto);

        return novoProduto;
      }

      return null;
    } catch (error) {
      console.error(`Erro na consulta ao banco de dados. ${error}`);
      return null;
    }
  }

}

export default Produto;
