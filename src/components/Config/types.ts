export interface Config {
    api?: {
        account?: string;
    };
}
export interface ConfigState extends ReRequired<Config> {}
