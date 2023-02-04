import { component$, Slot } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { signOutAction } from "../layout";

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
