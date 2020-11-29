import { Children } from "react";

export function Child({ name, children }) {
  return children;
}

/**
 *
 * @param {React.ReactChildren} children
 * @returns {{ [key: string]: React.ReactChildren }}
 */
export function useChildren(children) {
  const namedChildrenEntries = Children.toArray(children)
    .filter((child) => child.type === Child && child.props.name?.length)
    .map((child) => [child.props.name, child.props.children]);

  return Object.fromEntries(namedChildrenEntries);
}
