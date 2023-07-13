import { SpacePrimitives } from "../../common/spaces/space_primitives.ts";
import { FileMeta } from "../../common/types.ts";
import {
  NamespaceOperation,
  PageNamespaceHook,
} from "../hooks/page_namespace.ts";

export class PlugSpacePrimitives implements SpacePrimitives {
  constructor(
    private wrapped: SpacePrimitives,
    private hook: PageNamespaceHook,
    private env?: string,
  ) {}

  // Used e.g. by the sync engine to see if it should sync a certain path (likely not the case when we have a plug space override)
  public isLikelyHandled(path: string): boolean {
    for (
      const { pattern, env } of this.hook.spaceFunctions
    ) {
      if (
        path.match(pattern) &&
        (!this.env || (env && env === this.env))
      ) {
        return true;
      }
    }
    return false;
  }

  performOperation(
    type: NamespaceOperation,
    path: string,
    ...args: any[]
  ): Promise<any> | false {
    for (
      const { operation, pattern, plug, name, env } of this.hook.spaceFunctions
    ) {
      // console.log("Going to match agains pattern", pattern, path);
      if (
        operation === type && path.match(pattern) &&
        (!this.env || (env && env === this.env))
      ) {
        return plug.invoke(name, [path, ...args]);
      }
    }
    return false;
  }

  async fetchFileList(): Promise<FileMeta[]> {
    const allFiles: FileMeta[] = [];
    for (const { plug, name, operation } of this.hook.spaceFunctions) {
      if (operation === "listFiles") {
        try {
          for (const pm of await plug.invoke(name, [])) {
            allFiles.push(pm);
          }
        } catch (e) {
          console.error("Error listing files", e);
        }
      }
    }
    const files = await this.wrapped.fetchFileList();
    for (const pm of files) {
      allFiles.push(pm);
    }
    return allFiles;
  }

  async readFile(
    name: string,
  ): Promise<{ data: Uint8Array; meta: FileMeta }> {
    const result: { data: Uint8Array; meta: FileMeta } | false = await this
      .performOperation(
        "readFile",
        name,
      );
    if (result) {
      return result;
    }
    return this.wrapped.readFile(name);
  }

  getFileMeta(name: string): Promise<FileMeta> {
    const result = this.performOperation("getFileMeta", name);
    if (result) {
      return result;
    }
    return this.wrapped.getFileMeta(name);
  }

  writeFile(
    name: string,
    data: Uint8Array,
    selfUpdate?: boolean,
    meta?: FileMeta,
  ): Promise<FileMeta> {
    const result = this.performOperation(
      "writeFile",
      name,
      data,
      selfUpdate,
      meta,
    );
    if (result) {
      return result;
    }

    return this.wrapped.writeFile(
      name,
      data,
      selfUpdate,
      meta,
    );
  }

  deleteFile(name: string): Promise<void> {
    const result = this.performOperation("deleteFile", name);
    if (result) {
      return result;
    }
    return this.wrapped.deleteFile(name);
  }
}