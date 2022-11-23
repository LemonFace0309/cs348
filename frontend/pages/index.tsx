import Head from "next/head";
import Image from "next/image";

import type { NextPage } from "next";

import { Graph } from "@src/components/graph";
import { GraphProvider } from "@src/context/graph";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <GraphProvider>
      <Graph></Graph>
      {/* <Filter></Filter> */}
    </GraphProvider>
  );
};

export default Home;
