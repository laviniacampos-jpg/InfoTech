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

  public getIdProduto(): number { return this.idProduto; }
  public setIdProduto(_idProduto: number): void { this.idProduto = _idProduto; }
  public getIdCategoria(): number { return this.idCategoria; }
  public setIdCategoria(_idCategoria: number): void { this.idCategoria = _idCategoria; }
  public getCodigo(): string { return this.codigo; }
  public setCodigo(_codigo: string): void { this.codigo = _codigo; }
  public getNome(): string { return this.nome; }
  public setNome(_nome: string): void { this.nome = _nome; }
  public getPrecoUnitario(): number { return this.preco_unitario; }
  public setPrecoUnitario(_preco: number): void { this.preco_unitario = _preco; }
  public getQuantidadeMinima(): number { return this.quantidade_minima; }
  public setQuantidadeMinima(_quantidade: number): void { this.quantidade_minima = _quantidade; }
  public getQuantidadeDisponivel(): number { return this.quantidade_disponivel; }
  public setQuantidadeDisponivel(_quantidade: number): void { this.quantidade_disponivel = _quantidade; }
  public getAtivo(): boolean { return this.ativo; }
  public setAtivo(_ativo: boolean): void { this.ativo = _ativo; }
  public getDataCadastro(): Date { return this.data_cadastro; }
  public setDataCadastro(_data: Date): void { this.data_cadastro = _data; }
  public getDescricao(): string { return this.descricao; }
  public setDescricao(_descricao: string): void { this.descricao = _descricao; }

  static async cadastrarProduto(produto: ProdutoDTO): Promise<boolean> {
    try {
      const queryInsertProduto = `
        INSERT INTO produto (id_categoria, nome, descricao, codigo, preco_unitario, quantidade_minima, quantidade_disponivel, ativo, data_cadastro)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id_produto;
      `;

      const respostaBD = await database.query(queryInsertProduto, [
        produto.id_categoria ?? 1,
        produto.nome ? produto.nome.toUpperCase() : "",
        produto.descricao ?? "",
        produto.codigo ?? "",
        produto.preco_unitario ?? 0,
        produto.quantidade_minima ?? 0,
        produto.quantidade_disponivel ?? 0,
        produto.ativo ?? true,
        produto.data_cadastro ?? new Date(),
      ]);

      if (respostaBD.rows.length > 0) {
        console.info(`Produto cadastrado com sucesso. ID: ${respostaBD.rows[0].id_produto}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Erro na consulta ao banco de dados: ${error}`);
      throw error;
    }
  }

  static async listarProduto(): Promise<Array<Produto> | null> {
    try {
      const listaDeProduto: Array<Produto> = [];
      const querySelectProduto = `SELECT * FROM produto ORDER BY nome ASC;`;
      const respostaBD = await database.query(querySelectProduto);

      respostaBD.rows.forEach((produtoBD) => {
        const novoProduto: Produto = new Produto(
          produtoBD.id_produto,
          produtoBD.id_categoria,
          produtoBD.codigo,
          produtoBD.nome ? produtoBD.nome.toUpperCase() : "",
          produtoBD.descricao,
          produtoBD.preco_unitario,
          produtoBD.quantidade_disponivel,
          produtoBD.quantidade_minima,
          produtoBD.ativo,
          produtoBD.data_cadastro
        );

        listaDeProduto.push(novoProduto);
      });

      return listaDeProduto;
    } catch (error) {
      console.error(`Erro na consulta ao banco de dados: ${error}`);
      return null;
    }
  }

  static async listarProdutoId(idProduto: number): Promise<Produto | null> {
    try {
      const querySelectProduto = `SELECT * FROM produto WHERE id_produto = $1;`;
      const respostaBD = await database.query(querySelectProduto, [idProduto]);

      if (respostaBD.rows.length === 0) return null;

      const row = respostaBD.rows[0];
      return new Produto(
        row.id_produto,
        row.id_categoria,
        row.codigo,
        row.nome ? row.nome.toUpperCase() : "",
        row.descricao,
        row.preco_unitario,
        row.quantidade_disponivel,
        row.quantidade_minima,
        row.ativo,
        row.data_cadastro
      );
    } catch (error) {
      console.error(`Erro na consulta ao banco de dados: ${error}`);
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
      console.error(`Erro na consulta ao banco de dados: ${error}`);
      return false;
    }
  }

  static async atualizarProduto(id: number, produto: ProdutoDTO): Promise<boolean> {
    try {
      const queryUpdateProduto = `
        UPDATE produto 
        SET id_categoria = $1, nome = $2, descricao = $3, codigo = $4, preco_unitario = $5, quantidade_minima = $6, quantidade_disponivel = $7, ativo = $8 
        WHERE id_produto = $9;
      `;
      const respostaBD = await database.query(queryUpdateProduto, [
        produto.id_categoria ?? 1,
        produto.nome ? produto.nome.toUpperCase() : "",
        produto.descricao ?? "",
        produto.codigo ?? "",
        produto.preco_unitario ?? 0,
        produto.quantidade_minima ?? 0,
        produto.quantidade_disponivel ?? 0,
        produto.ativo ?? true,
        id
      ]);

      if (respostaBD.rowCount !== null && respostaBD.rowCount > 0) {
        console.info(`Produto atualizado com sucesso. ID: ${id}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Erro na consulta ao banco de dados: ${error}`);
      return false;
    }
  }

  static async produto(id: number): Promise<Produto | null> {
    return this.listarProdutoId(id);
  }
}

export default Produto;