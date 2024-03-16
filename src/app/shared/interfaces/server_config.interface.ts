import { Success } from "./response.interface"

export interface Config {
  serverTime: number
}
export interface ServerConfigResponse extends Success {
  metaData: Config
}