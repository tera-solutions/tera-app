export interface IValue {
  elements: any;
  targetElement: string;
  outputElement?: string;
  callback?: (newElement: any) => void;
}
