import { component$, Resource, useSignal } from "@builder.io/qwik";
import { action$, DocumentHead, loader$, z, zod$ } from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/context";
import { deleteTodo, findTodos, toggleTodo, updateTodo } from "~/server/todos";
import { paths } from "~/utils/paths";
import { TodoItem } from "./TodoItem/TodoItem";

export const todosLoader = loader$((event) => {
  const result = z
    .object({
      filter: z.union([
        z.literal("active"),
        z.literal("complete"),
        z.literal("all"),
      ]),
    })
    .safeParse(event.params);

  if (!result.success) {
    event.redirect(302, paths.all);
    return;
  }

  const ctx = getProtectedRequestContext(event);
  return findTodos({ ctx, filter: result.data.filter });
});

export const toggleTodoAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await toggleTodo({ ctx, ...data });
  },
  zod$({
    complete: z.boolean(),
    id: z.string(),
  })
);

export const updateTodoAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await updateTodo({ ctx, ...data });
  },
  zod$({
    id: z.string(),
    title: z.string(),
  })
);

export const deleteTodoAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await deleteTodo({ ctx, ...data });
  },
  zod$({
    id: z.string(),
  })
);

export default component$(() => {
  const todos = todosLoader.use();
  const hack = useSignal(0);

  return (
    <ul class="todo-list">
      <pre>{todos.value?.length}</pre>
      {/* This hidden button is required for reloading loader somehow */}
      <button
        class="hidden"
        onClick$={() => (hack.value = todos.value?.length || 0)}
      />
      <Resource
        value={todos}
        onResolved={(collection) => (
          <>
            {collection?.map((todo) => (
              <TodoItem todo={todo} key={todo.id} isNew={false} />
            ))}
          </>
        )}
      />
    </ul>
  );
});

export const head: DocumentHead = {
  title: "TODOS - Qwik TODO MVC",
};
