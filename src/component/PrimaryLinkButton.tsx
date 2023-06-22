import clsx from "clsx";
import Link, { type LinkProps } from "next/link";
import { type ReactNode } from "react";

export function PrimaryLinkButton(
  props: LinkProps & { children: ReactNode; className?: string}
  ) {
    const {className, ...propsWithoutClassname} = props;
    return (
    <Link 
    
    className={clsx(
      "rounded px-4 py-2 bg-blue-400 hover:bg-blue-500", 
      props.className ?? "")} 
      {...propsWithoutClassname}
  >
      {props.children}
    </Link>
  );
}