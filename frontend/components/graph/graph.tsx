import { FC, MutableRefObject, useEffect, useRef } from "react";

import { NeovisConfig } from "neovis.js/dist/neovis.js";

import { useGraphContext } from "@src/context/graph";

export const Graph: FC = () => {
  const { username1 } = useGraphContext();
  const graphRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    const initGraph = async () => {
      const { NeoVis, NEOVIS_ADVANCED_CONFIG } = await import(
        "neovis.js/dist/neovis.js"
      );

      const config: NeovisConfig = {
        containerId: graphRef.current.id,
        neo4j: {
          serverUrl: process.env.NEXT_PUBLIC_NEO4J_URI,
          serverUser: process.env.NEXT_PUBLIC_NEO4J_USERNAME,
          serverPassword: process.env.NEXT_PUBLIC_NEO4J_PASSWORD,
        },
        visConfig: {
          nodes: {
            shape: "dot",
          },
        },
        labels: {
          User: {
            label: "name",
            value: "pagerank",
            group: "community",
            [NEOVIS_ADVANCED_CONFIG]: {
              // static: {
              //   color: "lightblue",
              //   shape: "dot",
              //   font: {
              //     color: "black",
              //     background: "none",
              //     strokeWidth: "0",
              //     size: "20",
              //   },
              // },
            },
          },
        },
        relationships: {
          Follows: {
            // value: "weight",
          },
        },
        consoleDebug: true,
        initialCypher: "MATCH n=(:User)-[:Follows]->() RETURN n",
        // initialCypher:
        //   "MATCH (n:User)-[r:Follows]->(m) WHERE m.pagerank > 0.5 RETURN m, r",
      };

      const vis = new NeoVis(config);
      vis.render();
    };

    initGraph();
  }, []);

  return (
    <div id="graph" ref={graphRef} className="w-screen h-screen bg-slate-100" />
  );
};
