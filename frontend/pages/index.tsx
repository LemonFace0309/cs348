import Head from "next/head";

import type { NextPage } from "next";

import { Filter } from "@src/components/filter";
import { Graph } from "@src/components/graph";
import { Layout } from "@src/components/layout";
import { AuthProvider } from "@src/context/auth";
import { GraphProvider } from "@src/context/graph";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <AuthProvider>
      <Head>
        <title>Social Network Graph</title>
      </Head>
      <Layout>
        <GraphProvider>
          <Graph />
          <Filter />
        </GraphProvider>
      </Layout>
    </AuthProvider>
  );
};

export default Home;
