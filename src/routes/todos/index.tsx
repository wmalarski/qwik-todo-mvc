import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead, loader$, z, zod$ } from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/context";
import { createTodo, findTodos } from "~/server/todos";
import { paths } from "~/utils/paths";
import { CreateInput } from "./CreateItem/CreateItem";
import { TodoList } from "./TodoList/TodoList";

export const todosLoader = loader$((event) => {
  const params = new URL(event.request.url).searchParams;
  const entries = Object.fromEntries(params.entries());

  const result = z
    .object({
      filter: z.union([z.literal("active"), z.literal("complete")]).optional(),
    })
    .safeParse(entries);

  if (!result.success) {
    event.redirect(302, paths.todos);
    return;
  }

  const ctx = getProtectedRequestContext(event);
  return findTodos({ ctx, filter: result.data.filter });
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

export default component$(() => {
  return (
    <div>
      <CreateInput />
      <TodoList />
    </div>
  );
});

export const head: DocumentHead = {
  title: "TODOS - Qwik TODO MVC",
};
