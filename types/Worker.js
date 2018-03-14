// @flow

declare module "Worker" {
  declare class WebpackWorker extends Worker {
    constructor(): WebpackWorker;
  }
  declare export default typeof WebpackWorker
}
