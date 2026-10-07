// we have to manually declare the types for the API from "jeffsum", since it was written in Vanilla JS, not TS.

declare module "jeffsum" {
  export default function jeffsum(amount: number, type: string);
}
