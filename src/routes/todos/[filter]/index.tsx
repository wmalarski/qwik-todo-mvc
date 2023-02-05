import { component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import { action$, DocumentHead, loader$, z, zod$ } from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/context";
import { deleteTodo, findTodos, toggleTodo, updateTodo } from "~/server/todos";
import { paths } from "~/utils/paths";
import styles from "./index.css?inline";
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
    complete: z.coerce.boolean(),
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
    title: z.string().min(1),
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
  useStylesScoped$(styles);

  const todos = todosLoader.use();
  const workaround = useSignal(0);

  return (
    <section class="main">
      {/* This hidden button is required for reloading loader somehow */}
      <button
        class="hidden"
        onClick$={() => (workaround.value = todos.value?.length || 0)}
      />
      <ul class="todo-list">
        {todos.value?.map((todo) => (
          <TodoItem todo={todo} key={todo.id} isNew={false} />
        ))}
      </ul>
    </section>
  );
});

export const head: DocumentHead = {
  title: "TODOS - Qwik TODO MVC",
};
