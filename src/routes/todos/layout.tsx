import { component$, Slot } from "@builder.io/qwik";
import { action$, Form, loader$ } from "@builder.io/qwik-city";
import { deleteSession } from "~/server/auth";
import { getRequestContext } from "~/server/context";
import { paths } from "~/utils/paths";

export const signOutAction = action$((_data, event) => {
  deleteSession(event);

  event.redirect(302, paths.signIn);
});

export const protectedLoader = loader$((event) => {
  const ctx = getRequestContext(event);

  if (!ctx.session) {
    event.redirect(302, paths.signIn);
  }
});

export default component$(() => {
  protectedLoader.use();

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
