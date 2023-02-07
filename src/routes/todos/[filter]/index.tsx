import { component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import {
  action$,
  DocumentHead,
  Form,
  loader$,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/context";
import {
  completeAllTodos,
  countTodos,
  createTodo,
  deleteCompletedTodos,
  findTodos,
} from "~/server/todos";
import { paths } from "~/utils/paths";
import { Filters } from "./Filters/Filters";
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

export const countsLoader = loader$((event) => {
  const ctx = getProtectedRequestContext(event);

  return countTodos({ ctx });
});

export const createAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await createTodo({ ctx, ...data });
  },
  zod$({
    title: z.string(),
  })
);

export const completeAllAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await completeAllTodos({ ctx, ...data });
  },
  zod$({
    complete: z.coerce.boolean(),
  })
);

export const deleteCompletedAction = action$(async (_data, event) => {
  const ctx = getProtectedRequestContext(event);

  await deleteCompletedTodos({ ctx });
});

export default component$(() => {
  useStylesScoped$(styles);

  const todos = todosLoader.use();
  const workaround = useSignal(0);

  const create = createAction.use();
  const completeAll = completeAllAction.use();
  const deleteCompleted = deleteCompletedAction.use();

  const counts = countsLoader.use();

  const areAllActivating =
    completeAll.isRunning && !completeAll.formData?.get("complete");

  const areAllCompleting =
    completeAll.isRunning && !!completeAll.formData?.get("complete");

  const areAllCompleted =
    (areAllCompleting || counts.value.complete === counts.value.all) &&
    !areAllActivating;

  return (
    <section class="main">
      <Form action={create} spaReset>
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          name="title"
          aria-invalid={create.fail ? true : undefined}
          aria-describedby="new-todo-error"
        />
        {create.fail?.fieldErrors.title ? (
          <div class="error" id="new-todo-error">
            {create.fail?.fieldErrors.title}
          </div>
        ) : null}
      </Form>
      {counts.value.all > 0 ? (
        <Form action={completeAll}>
          <input
            name="complete"
            type="hidden"
            value={areAllCompleted ? undefined : "1"}
          />
          <button
            class={["toggle-all", { checked: areAllCompleted }]}
            type="submit"
          >
            {"❯"}
          </button>
        </Form>
      ) : null}
      {/* This hidden button is required for reloading loader somehow */}
      <button
        class="hidden"
        // eslint-disable-next-line qwik/valid-lexical-scope
        onClick$={() => (workaround.value = todos.value?.length || 0)}
      />
      <ul class="todo-list">
        {create.isRunning ? (
          <TodoItem
            completeAll={completeAll}
            deleteCompleted={deleteCompleted}
            isNew
            todo={{
              complete: false,
              id: "new",
              title: create.formData?.get("title") as string,
            }}
          />
        ) : null}
        {todos.value?.map((todo) => (
          <TodoItem
            completeAll={completeAll}
            deleteCompleted={deleteCompleted}
            isNew={false}
            key={todo.id}
            todo={todo}
          />
        ))}
      </ul>
      <Filters deleteCompleted={deleteCompleted} />
    </section>
  );
});

export const head: DocumentHead = {
  title: "TODOS - Qwik TODO MVC",
};
