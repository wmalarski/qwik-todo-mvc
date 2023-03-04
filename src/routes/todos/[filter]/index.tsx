import { component$, useStylesScoped$ } from "@builder.io/qwik";
import {
  action$,
  Form,
  Link,
  loader$,
  useLocation,
  z,
  zod$,
  type DocumentHead,
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
import styles from "./index.css?inline";
import { TodoItem } from "./TodoItem/TodoItem";

export const useTodosLoader = loader$((event) => {
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

export const useCountsLoader = loader$((event) => {
  const ctx = getProtectedRequestContext(event);

  return countTodos({ ctx });
});

export const useCreateAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await createTodo({ ctx, ...data });
  },
  zod$({
    title: z.string(),
  })
);

export const useCompleteAllAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await completeAllTodos({ ctx, ...data });
  },
  zod$({
    complete: z.coerce.boolean(),
  })
);

export const useDeleteCompletedAction = action$(async (_data, event) => {
  const ctx = getProtectedRequestContext(event);

  await deleteCompletedTodos({ ctx });
});

export default component$(() => {
  useStylesScoped$(styles);

  const location = useLocation();

  const todos = useTodosLoader();

  const create = useCreateAction();
  const completeAll = useCompleteAllAction();
  const deleteCompleted = useDeleteCompletedAction();

  const counts = useCountsLoader();

  const areAllActivating =
    completeAll.isRunning && !completeAll.formData?.get("complete");

  const areAllCompleting =
    completeAll.isRunning && !!completeAll.formData?.get("complete");

  const areAllCompleted =
    (areAllCompleting || counts.value.complete === counts.value.all) &&
    !areAllActivating;

  const count = counts.value.active;

  const hideDeleteCompleted =
    counts.value.complete < 1 || deleteCompleted.isRunning;

  return (
    <section class="main">
      <Form action={create} spaReset>
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          name="title"
          aria-invalid={create.value ? true : undefined}
          aria-describedby="new-todo-error"
        />
        {create.value?.fieldErrors?.title ? (
          <div class="error" id="new-todo-error">
            {create.value?.fieldErrors.title?.[0]}
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
      <ul class="todo-list">
        {create.isRunning &&
        !location.url.pathname.startsWith(paths.complete) ? (
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
      <div class="container">
        <span class="counts">{`${count} ${
          count === 1 ? "item" : "items"
        } left`}</span>
        <ul role="navigation" class="filters">
          <li
            class={[
              "link",
              { selected: location.url.pathname.startsWith(paths.all) },
            ]}
          >
            <Link href={paths.all}>All</Link>
          </li>
          <li
            class={[
              "link",
              { selected: location.url.pathname.startsWith(paths.active) },
            ]}
          >
            <Link href={paths.active}>Active</Link>
          </li>
          <li
            class={[
              "link",
              { selected: location.url.pathname.startsWith(paths.complete) },
            ]}
          >
            <Link href={paths.complete}>Completed</Link>
          </li>
        </ul>
        {!hideDeleteCompleted ? (
          <div class="clear">
            <Form action={deleteCompleted}>
              <button
                class="clear-completed"
                type="submit"
                disabled={deleteCompleted.isRunning}
              >
                Clear completed
              </button>
            </Form>
          </div>
        ) : null}
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: "TODOS - Qwik TODO MVC",
};
