import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { Form, routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { clearRequestSession, deleteSession } from "~/server/auth";
import { getRequestContext } from "~/server/context";
import { paths } from "~/utils/paths";
import styles from "./layout.css?inline";

export const useSessionLoader = routeLoader$((event) => {
  const ctx = getRequestContext(event);

  if (!ctx.session) {
    event.redirect(302, paths.signIn);
  }

  return ctx.session;
});

export const useSignOutAction = routeAction$((_data, event) => {
  clearRequestSession(event);
  deleteSession(event);

  event.redirect(302, paths.signIn);
});

export default component$(() => {
  useStylesScoped$(styles);

  useSessionLoader();

  const signOut = useSignOutAction();

  return (
    <div class="container">
      <header>
        <h1 class="title">TODOS</h1>
      </header>
      <section class="content">
        <Slot />
      </section>
      <div class="signOutBox">
        <Form action={signOut}>
          <button class="signOut" type="submit">
            Sign Out
          </button>
        </Form>
      </div>
    </div>
  );
});
