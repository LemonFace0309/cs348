import { ComponentPropsWithoutRef, forwardRef } from "react";

import cx from "classnames";

type Props = {
  children: string;
  level?: "normal" | "warn";
} & ComponentPropsWithoutRef<"button">;

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children, level = "normal", ...otherProps },
  ref
) {
  return (
    <button
      className={cx(
        "rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700",
        level == "warn" && "bg-red-500 hover:bg-blue-700"
      )}
      {...otherProps}
      ref={ref}>
      {children}
    </button>
  );
});
