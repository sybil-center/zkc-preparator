import { GraphLink, GraphNode, TransformationGraph } from "./graph.js";
import sortKeys from "sort-keys";

export type ZKCredential = {
  isr: {
    id: {
      t: number,
      k: string
    };
  },
  sch: number;
  isd: number;
  exd: number;
  sbj: {
    id: {
      t: number,
      k: string
    }
  } & Record<string, any>
}

export type TransCredSchema = {
  isr: {
    id: { t: string[], k: string[] }
  },
  sch: string[],
  isd: string[],
  exd: string[],
  sbj: {
    id: {
      t: string[],
      k: string[]
    }
  } & Record<string, any>
}

export interface IPreparator {
  prepare<
    TOut extends any[] = any [],
    TObj extends ZKCredential = ZKCredential,
    TSchema extends TransCredSchema = TransCredSchema
  >(obj: TObj, schema: TSchema): TOut;

  extendGraph(node: GraphNode[], links: GraphLink[]): void;
}

export class Preparator implements IPreparator {

  private readonly graph = new TransformationGraph();
  extendGraph = this.graph.extend;

  prepare<
    TOut extends any[] = any [],
    TObj extends ZKCredential = ZKCredential,
    TSchema extends TransCredSchema = TransCredSchema
  >(credential: TObj, schema: TSchema): TOut {
    const sortedCred = sort(credential);
    const sortedSchema = sort<TransCredSchema>(schema);
    const pathValueList = toPathValueList(sortedCred);
    return pathValueList.reduce((prev, { value, path }) => {
      const links = getByPath(sortedSchema, path);
      const transformed = this.graph.transform(value, links);
      prev.push(transformed);
      return prev;
    }, ([] as any[]) as TOut);
  }
}

type PathValue = {
  path: string[];
  value: any;
}

export function toPathValueList(obj: Record<string, any>): PathValue[] {
  return Object.keys(obj).reduce((vector, key) => {
    vector.concat(getPathValues(obj, key, vector));
    return vector;
  }, [] as PathValue[]);
}

function getPathValues(
  obj: any,
  key: string,
  vector: PathValue[],
  path?: string[]
): PathValue[] {
  let target = obj[key]!;
  path = !path ? [key] : path;
  if (Array.isArray(target)) target = arrToObj(target as []);
  if (typeof target === "object" && target !== null) {
    Object.keys(target).forEach((localKey) => {
      getPathValues(target, localKey, vector, path!.concat(localKey));
    });
  }
  if (isPrimitive(target)) {
    vector.push({ value: target, path: path });
  }
  return vector;
}

function arrToObj(list: []): Record<string, any> {
  return list.reduce((prev, value, index) => {
    prev[index] = value;
    return prev;
  }, {} as Record<string, any>);
}

function isPrimitive(value: any): boolean {
  return ["string", "number", "bigint", "boolean"].includes(typeof value);
}

function getByPath(obj: any, path: string[]): any {
  let current = obj;
  path.forEach((key) => {
    current = current[key];
  });
  return current;
}

function sort<T extends (ZKCredential | TransCredSchema) = ZKCredential>(credential: T): T {
  const target: Record<string, any> = {};
  target.isr = {
    id: {
      t: credential.isr.id.t,
      k: credential.isr.id.k
    }
  };

  target.sch = credential.sch;
  target.isd = credential.isd;
  target.exd = credential.exd;

  const sbjProps = Object.keys(credential.sbj)
    .filter((key) => key !== "id")
    .reduce((sbjProps, prop) => {
      //@ts-ignore
      sbjProps[prop] = credential.sbj[prop];
      return sbjProps;
    }, {} as Record<string, any>);

  target.sbj = {
    id: {
      t: credential.sbj.id.t,
      k: credential.sbj.id.k
    },
    ...sortKeys(sbjProps, { deep: true })
  };
  return target as T;
}
