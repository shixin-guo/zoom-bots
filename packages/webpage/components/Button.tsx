import classnames from "classnames";

interface ButtonProps {
  className?: string,
  type?: "button" | "submit" | "reset",
  children?: React.ReactNode
}
export function Button({ className, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      className={classnames(
        "inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none",
        "bg-zinc-600 font-semibold text-zinc-100 hover:bg-zinc-400 active:bg-zinc-800 active:text-zinc-100/70",
        className
      )}
      {...props}
    />
  );
}
