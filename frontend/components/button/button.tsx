import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = {
  children: string;
} & ComponentPropsWithoutRef<"button">;

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children, ...otherProps },
  ref
) {
  return (
    <button
      className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
      {...otherProps}
      ref={ref}>
      {children}
    </button>
  );
});
