import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseModel {
    
    private _config: object;

    private _pool: pg.Pool;

    private _client: pg.Client;

    constructor() {
        this._config = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            max: 10,
            idleTimoutMillis: 10000
        }
        this._pool = new pg.Pool(this._config);

        // Inicialização do cliente de conexão
        this._client = new pg.Client(this._config);
    }
    public async testeConexao() {
        try {
            
            await this._client.connect();
            console.log('Database connected!');
            // Encerra a conexão
            this._client.end();
            return true;
        } catch (error) {
            // Em caso de erro, exibe uma mensagem de erro
            console.log('Error to connect database X( ');
            console.log(error);
            // Encerra a conexão
            this._client.end();
            return false;
        }
    }

    /**
     * Getter para o pool de conexões.
     */
    public get pool() {
        return this._pool;
    }
}