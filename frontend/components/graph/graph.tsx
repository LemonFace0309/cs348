import { FC, MutableRefObject, useEffect, useRef } from "react";

import { NeovisConfig } from "neovis.js/dist/neovis.js";

import { useGraphContext } from "@src/context/graph";

export const Graph: FC = () => {
  const { username } = useGraphContext();
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
          edges: {
            arrows: {
              to: { enabled: true },
            },
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
        // consoleDebug: true,
        initialCypher: "MATCH n=(:User)-[:Follows]->() RETURN n",
      };

      if (username) {
        config.initialCypher = `
          MATCH n=(User {username: "ladygaga"})-[:Follows]-(:User)
          RETURN n
        `;
      }

      const vis = new NeoVis(config);
      vis.render();
    };

    initGraph();
  }, [username]);

  return <div id="graph" ref={graphRef} className="h-full grow" />;
};
