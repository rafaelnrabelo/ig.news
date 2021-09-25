import { ReactElement, cloneElement } from "react";
import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({
  children,
  activeClassName,
  ...linkProps
}: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === linkProps.href ? activeClassName : "";

  return (
    <Link {...linkProps}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
}
