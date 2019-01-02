export interface IContext {
  staticContext: string;
}

export default (): IContext => ({
  staticContext: 'some info',
});
