import type { ComponentProps, MouseEvent } from "react";
import { useNav } from "./nav-store";

type Props = Omit<ComponentProps<"a">, "href"> & { href: string; prefetch?: boolean; replace?: boolean };

export default function Link({ href, onClick, children, ...rest }: Props) {
  const navigate = useNav((s) => s.navigate);
  const external = /^https?:/.test(href);
  const token = href === "/" ? "" : href.replace(/^\//, "").split("?")[0];
  return (
    <a
      href={external ? href : `#${token}`}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (external || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
