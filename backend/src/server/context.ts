// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { SchemaLink } from "@apollo/client/link/schema";
import { NextFunction, Request, Response } from "express";

// import { schema } from "@src/server/schema";

import "dotenv/config";

export type ContextParams = {
  // prisma: PrismaClient;
  neo4j: string;
};

export const initContext = () => {
  // const prisma = new PrismaClient();

  return new Context({ neo4j: "placeholder" });
};

export const attachContext = (context: Context) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.ctx = context;
    next();
  };
};

export class Context {
  // prisma: PrismaClient;
  neo4j: string;
  // private _apollo: ApolloClient<unknown> | null;

  constructor(params: ContextParams) {
    // this.prisma = params.prisma;
    this.neo4j = params.neo4j;
    // this._apollo = null;
  }

  /**
   * Add back later if we need to query our own schema
   * Example: Elasticsearch
   */
  // get apollo(): ApolloClient<unknown> {
  //   if (!this._apollo) {
  //     this._apollo = new ApolloClient({
  //       cache: new InMemoryCache(),
  //       link: new SchemaLink({
  //         schema,
  //         context: this,
  //       }),
  //     });
  //   }
  //   return this._apollo;
  // }
}
