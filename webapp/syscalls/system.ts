import {SysCallMapping} from "../../plugos/system";
import {Space} from "../space";

export function systemSyscalls(space: Space): SysCallMapping {
  return {
    "system.invokeFunctionOnServer": async (
      ctx,
      name: string,
      ...args: any[]
    ) => {
      if (!ctx.plug) {
        throw Error("No plug associated with context");
      }
      return space.remoteInvoke(ctx.plug, name, args);
    },
  };
}
