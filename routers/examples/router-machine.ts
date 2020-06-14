// Credit to https://spectrum.chat/statecharts/general/routing-with-xstate~51467af4-f834-41af-9dce-75b8059a702e?m=MTU4NzI1MjQwODIzMA==
import Route from "route-parser";
import { MachineConfig } from "xstate";
import { fromEventPattern } from "rxjs";
import { map } from "rxjs/operators";
import { createHashHistory } from "history";

const history = createHashHistory({
  basename: "",
  hashType: "slash",
});

const history$ = fromEventPattern(history.listen);

export const config: MachineConfig<any, any, any> = {
  id: "history",
  initial: "init",
  invoke: {
    src: () =>
      history$.pipe(
        map((location) => {
          return {
            type: "ROUTE_CHANGED",
            value: location,
          };
        })
      ),
  },
  states: {
    init: {
      on: {
        "": [
          {
            target: "details",
            cond: { type: "verifyRoute", location: "details/:id" },
          },
          {
            target: "about",
            cond: { type: "verifyRoute", location: "about" },
          },
          {
            target: "home",
            cond: { type: "verifyRoute", location: "home" },
          },
          { target: "error" },
        ],
      },
    },
    about: {},
    details: {},
    home: {},
    error: {},
  },
  on: {
    ROUTE_CHANGED: [
      {
        target: "details",
        cond: { type: "verifyRoute", location: "details/:id" },
      },
      {
        target: "about",
        cond: { type: "verifyRoute", location: "about" },
      },
      {
        target: "home",
        cond: { type: "verifyRoute", location: "home" },
      },
      { target: "error" },
    ],
  },
};
export const guards = {
  verifyRoute: (context: any, event: any, { cond }: any) => {
    const hash = window.location.hash.slice(2, window.location.hash.length); // remove the # from the string
    const route = new Route(cond.location);
    if (route.match(hash)) {
      return true;
    }
    return false;
  },
};
