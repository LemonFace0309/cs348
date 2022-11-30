import { FC, useState } from "react";

import { Tab } from "@headlessui/react";
import cx from "classnames";

export type TabData = {
  id: number;
  title: string;
  date: string;
  subText?: string;
};

export type Categories = {
  [category: string]: TabData[];
};

type Props = {
  categories: Categories;
};

export const Tabs: FC<Props> = ({ categories }) => {
  return (
    <div className="w-full max-w-md p-4 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-white p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                cx(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"
                )
              }>
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={cx(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}>
              <ul>
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="relative rounded-md p-3 hover:bg-gray-100">
                    <h3 className="text-sm font-medium leading-5">
                      {post.title}
                    </h3>

                    <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                      {/* <li>{post.date}</li> */}
                      {post.subText && (
                        <>
                          {/* <li>&middot;</li> */}
                          <li>{post.subText}</li>
                        </>
                      )}
                    </ul>

                    {/* <a
                      href="#"
                      className={cx(
                        "absolute inset-0 rounded-md",
                        "ring-blue-400 focus:z-10 focus:outline-none focus:ring-2"
                      )}
                    /> */}
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
