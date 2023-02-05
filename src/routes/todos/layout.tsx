import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { action$, loader$, z, zod$ } from "@builder.io/qwik-city";
import { deleteSession } from "~/server/auth";
import { getProtectedRequestContext } from "~/server/context";
import { completeAllTodos, countTodos, createTodo } from "~/server/todos";
import { paths } from "~/utils/paths";
import { CheckAll } from "./CheckAll/CheckAll";
import { CreateItem } from "./CreateItem/CreateItem";
import { Filters } from "./Filters/Filters";
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
    complete: z.coerce.boolean(),
  })
);

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <div class="container">
      <header>
        <h1 class="title">TODOS</h1>
      </header>
      <section class="content">
        <CreateItem />
        <CheckAll />
        <Slot />
        <Filters />
      </section>
    </div>
  );
});
