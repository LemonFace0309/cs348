import type { NextPage } from "next";

import { Filter } from "@src/components/filter";
import { Graph } from "@src/components/graph";
import { Layout } from "@src/components/layout";
import { GraphProvider } from "@src/context/graph";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <Layout>
      <GraphProvider>
        <Graph />
        <Filter />
      </GraphProvider>
    </Layout>
  );
};

export default Home;
