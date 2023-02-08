import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { action$, Form, useLocation, z, zod$ } from "@builder.io/qwik-city";
import type { Todo } from "@prisma/client";
import { CompleteIcon, IncompleteIcon } from "~/components/Icons/Icons";
import { getProtectedRequestContext } from "~/server/context";
import { deleteTodo, toggleTodo, updateTodo } from "~/server/todos";
import { completeAllAction, deleteCompletedAction } from "..";
import styles from "./TodoItem.css?inline";

export const toggleAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await toggleTodo({ ctx, ...data });
  },
  zod$({
    complete: z.coerce.boolean(),
    id: z.string(),
  })
);

export const updateAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await updateTodo({ ctx, ...data });
  },
  zod$({
    id: z.string(),
    title: z.string().min(1),
  })
);

export const deleteAction = action$(
  async (data, event) => {
    const ctx = getProtectedRequestContext(event);

    await deleteTodo({ ctx, ...data });
  },
  zod$({
    id: z.string(),
  })
);

type Props = {
  completeAll: ReturnType<(typeof completeAllAction)["use"]>;
  deleteCompleted: ReturnType<(typeof deleteCompletedAction)["use"]>;
  isNew: boolean;
  todo: Omit<Todo, "userId" | "updatedAt" | "createdAt">;
};

export const TodoItem = component$<Props>((props) => {
  useStylesScoped$(styles);

  const location = useLocation();

  const updateTodo = updateAction.use();
  const deleteTodo = deleteAction.use();
  const toggleTodo = toggleAction.use();

  const completed = props.completeAll.isRunning
    ? !!props.completeAll.formData?.get("complete")
    : toggleTodo.isRunning
    ? !!toggleTodo.formData?.get("complete")
    : props.todo.complete;

  const filter = location.params.filter;

  const shouldHide =
    (toggleTodo.isRunning && filter === "complete" && !completed) ||
    (toggleTodo.isRunning && filter === "active" && completed) ||
    (props.deleteCompleted.isRunning && completed) ||
    deleteTodo.isRunning;

  if (shouldHide) {
    return null;
  }

  return (
    <li class="todo">
      <Form action={updateTodo}>
        <input type="hidden" name="id" value={props.todo.id} />
        <input
          name="title"
          class={["edit", { completed }]}
          value={props.todo.title}
          disabled={props.isNew}
          onBlur$={(event) => {
            const value = event.target.value;
            if (props.todo.title !== value) {
              updateTodo.run({ id: props.todo.id, title: value });
            }
          }}
          aria-invalid={!!updateTodo.value?.fieldErrors.title}
          aria-describedby={`todo-update-error-${props.todo.id}`}
        />
        {!!updateTodo.value?.fieldErrors.title && !updateTodo.isRunning ? (
          <div class="error" id={`todo-update-error-${props.todo.id}`}>
            {updateTodo.value?.fieldErrors.title?.[0]}
          </div>
        ) : null}
      </Form>
      <Form action={toggleTodo}>
        <input type="hidden" name="id" value={props.todo.id} />
        <input
          type="hidden"
          name="complete"
          value={completed ? undefined : "1"}
        />
        <button
          type="submit"
          class="toggle"
          disabled={props.isNew || toggleTodo.isRunning}
          title={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed ? <CompleteIcon /> : <IncompleteIcon />}
        </button>
      </Form>
      <Form action={deleteTodo}>
        <input type="hidden" name="id" value={props.todo.id} />
        <button
          class="destroy"
          title="Delete todo"
          type="submit"
          disabled={props.isNew || deleteTodo.isRunning}
        />
      </Form>
    </li>
  );
});
