import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { Form, routeAction$ } from "@builder.io/qwik-city";
import { deleteSession } from "~/server/auth";
import { paths } from "~/utils/paths";
import styles from "./layout.css?inline";

export const useSignOutAction = routeAction$((_data, event) => {
  deleteSession(event);

  event.redirect(302, paths.signIn);
});

export default component$(() => {
  useStylesScoped$(styles);

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
