import type { ParseTree } from "$sb/lib/tree.ts";
import { ParsedQuery } from "$sb/lib/query.ts";

export type AppEvent =
  | "page:click"
  | "editor:complete"
  | "minieditor:complete"
  | "page:load"
  | "editor:init"
  | "editor:pageLoaded"
  | "editor:pageReloaded"
  | "editor:pageSaved"
  | "editor:modeswitch"
  | "plugs:loaded";

export type QueryProviderEvent = {
  query: ParsedQuery;
  pageName: string;
};

export type ClickEvent = {
  page: string;
  pos: number;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
};

export type IndexEvent = {
  name: string;
  text: string;
};

export type IndexTreeEvent = {
  name: string;
  tree: ParseTree;
};

export type PublishEvent = {
  uri: string;
  // Page name
  name: string;
};

export type CompleteEvent = {
  pageName: string;
  linePrefix: string;
  pos: number;
};

export type WidgetContent = {
  html?: string;
  script?: string;
  url?: string;
  height?: number;
  width?: number;
};
