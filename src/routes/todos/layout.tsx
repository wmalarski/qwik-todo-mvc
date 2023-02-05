import { component$, Slot } from "@builder.io/qwik";
import { action$, Form, z, zod$ } from "@builder.io/qwik-city";
import { deleteSession } from "~/server/auth";
import { getProtectedRequestContext } from "~/server/context";
import { completeAllTodos, createTodo } from "~/server/todos";
import { paths } from "~/utils/paths";
import { CreateInput } from "./CreateItem/CreateItem";
import { Filters } from "./Filters/Filters";

export const signOutAction = action$((_data, event) => {
  deleteSession(event);

  event.redirect(302, paths.signIn);
});

export const createTodoAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await createTodo({ ctx, ...data });
  },
  zod$({
    title: z.string(),
  })
);

export const completeAllTodosAction = action$(async (_data, event) => {
  const ctx = getProtectedRequestContext(event);

  await completeAllTodos({ ctx });
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
