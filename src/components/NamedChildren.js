import { Children } from "react";

export function Child({ name, children }) {
  return children;
}

/**
 *
 * @param {React.ReactChild} children
 * @returns {{ [key: string]: React.ReactComponentElement}}
 */
export function useChildren(children) {
  const namedChildrenEntries = Children.toArray(children)
    .filter((child) => child?.type === Child && child?.props.name?.length)
    .map((child) => [child.props.name, child.props.children]);

  return Object.fromEntries(namedChildrenEntries);
}
