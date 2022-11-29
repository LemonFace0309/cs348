import { FC, useState } from "react";

import { RadioGroup as HRadioGroup } from "@headlessui/react";

export type Option = {
  text: string;
  subtext: string;
};

type Props = {
  options: Option[];
  onClick?: (option: Option) => void;
};

export const RadioGroup: FC<Props> = ({ options, onClick }) => {
  const [selected, setSelected] = useState(options[0]);

  const clickedHandler = (option: Option) => {
    setSelected(option);
    if (onClick) {
      onClick(option);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="mx-auto w-full max-w-md">
        <HRadioGroup value={selected} onChange={clickedHandler}>
          <HRadioGroup.Label className="sr-only">
            Radio Options
          </HRadioGroup.Label>
          <div className="space-y-2">
            {options.map((option) => (
              <HRadioGroup.Option
                key={option.text}
                value={option}
                className={({ active, checked }) =>
                  `${
                    active
                      ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                      : ""
                  }
                  ${
                    checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }>
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <HRadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? "text-white" : "text-gray-900"
                            }`}>
                            {option.text}
                          </HRadioGroup.Label>
                          <HRadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-sky-100" : "text-gray-500"
                            }`}>
                            <span>{option.subtext}</span>
                          </HRadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </HRadioGroup.Option>
            ))}
          </div>
        </HRadioGroup>
      </div>
    </div>
  );
};

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
