import { component$, Slot } from "@builder.io/qwik";
import { action$, Form } from "@builder.io/qwik-city";
import { deleteSession } from "~/server/auth";
import { paths } from "~/utils/paths";

export const signOutAction = action$((_data, event) => {
  deleteSession(event);

  event.redirect(302, paths.signIn);
});

export default component$(() => {
  const signOut = signOutAction.use();

  return (
    <>
      <Form action={signOut}>
        <button>Sign Out</button>
      </Form>
      <Slot />
    </>
  );
});
