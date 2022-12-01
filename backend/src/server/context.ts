// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { SchemaLink } from "@apollo/client/link/schema";
import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from "express";
import neo4j, { Session } from "neo4j-driver";

// import { schema } from "@src/server/schema";

import "dotenv/config";

export type ContextParams = {
  neo4j: Session;
};

export const initContext = () => {
  const driver = neo4j.driver(
    process.env.NEO4J_URI as string,
    neo4j.auth.basic(
      process.env.NEO4J_USERNAME as string,
      process.env.NEO4J_PASSWORD as string
    )
  );
  const session = driver.session({
    database: process.env.NEO4J_DB as string,
    defaultAccessMode: neo4j.session.WRITE,
  });

  return new Context({ neo4j: session });
};

export const attachContext = (context: Context) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.ctx = context;
    next();
  };
};

export class Context {
  neo4j: Session;
  // private _apollo: ApolloClient<unknown> | null;

  constructor(params: ContextParams) {
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
