import Image from "next/image";
import { FC, MutableRefObject, useEffect, useRef } from "react";

import cx from "classnames";
import { NeovisConfig } from "neovis.js/dist/neovis.js";

import { useGraphContext } from "@src/context/graph";

import styles from "./graph.module.css";

export const Graph: FC = () => {
  const { username, mode, destinationUser } = useGraphContext();
  const graphRef = useRef() as MutableRefObject<HTMLDivElement>;

  // useEffect(() => {
  //   const img = document.createElement("img");
  //   img.setAttribute("src", "/legend.png");
  //   img.setAttribute("src", "/legend.png");
  //   img.setAttribute("height", "100");
  //   img.style.position = "absolute";
  //   img.style.bottom = "0";
  //   img.style.left = "0";
  //   img.style.left = "0";
  //   img.style.left = "0";

  //   const graphDiv = document.getElementById("graph");
  //   graphDiv?.appendChild(img);
  // }, []);

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
          Tweet: {
            label: "text",
          },
        },
        relationships: {
          Follows: {
            // value: "weight",
          },
        },
        // consoleDebug: true,
        initialCypher: "MATCH n=(:User)-[:Follows]->() RETURN n LIMIT 50",
        // initialCypher: "MATCH n=(:User)-[:Follows]->() RETURN n",
      };

      if (username) {
        switch (mode) {
          case "details":
            config.initialCypher = `
              MATCH (n:User {username: "${username}"})
              RETURN n
            `;
            break;
          case "relationships":
            config.initialCypher = `
              MATCH n=(User {username: "${username}"})-[:Follows]-()
              RETURN n
            `;
            break;
          case "tweets":
            config.initialCypher = `
              MATCH n=(User {username: "${username}"})-[:Author]->()
              RETURN n
            `;
            break;
          case "shortest path":
            if (destinationUser) {
              config.initialCypher = `
                MATCH
                  (A:User {username: "${username}"} ),
                  (B:User {username: "${destinationUser}"}),
                  p = allShortestPaths((A)-[r:Follows*]->(B))
                RETURN p
              `;
            } else {
              config.initialCypher = `
                MATCH (n:User {username: "${username}"})
                RETURN n
              `;
            }
            break;
          case "mutual follows":
            if (destinationUser) {
              config.initialCypher = `
                MATCH n=(A:User {username: "${username}"})-[:Follows]->(N:User)<-[:Follows]-(B:User {username: "${destinationUser}"})
                RETURN n
              `;
            } else {
              config.initialCypher = `
                MATCH (n:User {username: "${username}"})
                RETURN n
              `;
            }
            break;
          default:
            config.initialCypher = `
              MATCH n=(User {username: "${username}"})-[:Follows]-()
              RETURN n
            `;
            break;
        }
      }

      const vis = new NeoVis(config);
      vis.render();
    };

    initGraph();
  }, [username, mode, destinationUser]);

  return (
    <div className={cx("h-screen w-full", styles.graph)}>
      <Image
        src="/legend.png"
        alt="legend"
        height="300"
        width="300"
        className="absolute bottom-0 left-0 z-10 m-4"></Image>
      <div id="graph" ref={graphRef} className={cx("h-screen", styles.graph)}>
        <h6 className="text-9xl">Loading...</h6>
      </div>
    </div>
  );
};
