import type { RequestEvent } from "@builder.io/qwik-city";
import type {
  RequestEventAction,
  RequestEventLoader,
} from "@builder.io/qwik-city/middleware/request-handler";

export type ServerRequest =
  | RequestEventLoader
  | RequestEvent
  | RequestEventAction;
