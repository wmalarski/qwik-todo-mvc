import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { action$, loader$, z, zod$ } from "@builder.io/qwik-city";
import { deleteSession } from "~/server/auth";
import { getProtectedRequestContext } from "~/server/context";
import { completeAllTodos, countTodos, createTodo } from "~/server/todos";
import { paths } from "~/utils/paths";
import { CheckAll } from "./CheckAll/CheckAll";
import { CreateInput } from "./CreateItem/CreateItem";
import { Filters } from "./Filters/Filters";
import { Footer } from "./Footer/Footer";
import styles from "./layout.css?inline";

export const countsLoader = loader$((event) => {
  const ctx = getProtectedRequestContext(event);

  return countTodos({ ctx });
});

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

export const completeAllTodosAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await completeAllTodos({ ctx, ...data });
  },
  zod$({
    complete: z.boolean(),
  })
);

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <section class="todoapp">
      <header>
        <h1>TODOS</h1>
        <CreateInput />
        <CheckAll />
      </header>
      <Slot />
      <Filters />
      <Footer />
    </section>
  );
});
