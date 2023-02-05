import { component$, Slot } from "@builder.io/qwik";
import { action$, Form } from "@builder.io/qwik-city";
import { deleteSession } from "~/server/auth";
import { paths } from "~/utils/paths";
import { CreateInput } from "./CreateItem/CreateItem";
import { Filters } from "./Filters/Filters";

export const signOutAction = action$((_data, event) => {
  deleteSession(event);

  event.redirect(302, paths.signIn);
});

export default component$(() => {
  const signOut = signOutAction.use();

  return (
    <section class="todoapp">
      <header>
        <h1>todos</h1>
        <CreateInput />
      </header>
      <section class="main">
        <Slot />
      </section>
      <Filters />
      <Form action={signOut}>
        <button>Sign Out</button>
      </Form>
    </section>
  );
});
