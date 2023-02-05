import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import type { Todo } from "@prisma/client";
import { CompleteIcon, IncompleteIcon } from "~/components/Icons/Icons";
import { deleteAction, toggleAction, updateAction } from "..";
import styles from "./TodoItem.css?inline";

type Props = {
  isNew: boolean;
  todo: Omit<Todo, "userId" | "updatedAt" | "createdAt">;
  deleteTodo: ReturnType<(typeof deleteAction)["use"]>;
  toggleTodo: ReturnType<(typeof toggleAction)["use"]>;
};

export const TodoItem = component$<Props>((props) => {
  useStylesScoped$(styles);

  const updateTodo = updateAction.use();

  // const isDeleting =
  //   canBeOptimistic(deleteFetcher) || (clearingTodos && todo.complete);
  // const isToggling = canBeOptimistic(toggleFetcher);

  // const optimisticComplete = isToggling
  //   ? toggleFetcher.submission?.formData.get("complete") === "true"
  //   : typeof togglingComplete === "boolean"
  //   ? togglingComplete
  //   : props.todo.complete;

  const optimisticComplete =
    props.toggleTodo.isRunning &&
    props.toggleTodo.formData?.get("id") === props.todo.id
      ? !!props.toggleTodo.formData?.get("complete")
      : props.todo.complete;

  if (
    props.deleteTodo.isRunning &&
    props.deleteTodo.formData?.get("id") === props.todo.id
  ) {
    return null;
  }

  return (
    <li class="todo">
      <Form action={updateTodo}>
        <input type="hidden" name="id" value={props.todo.id} />
        <input
          name="title"
          class={["edit", { completed: optimisticComplete }]}
          value={props.todo.title}
          disabled={props.isNew}
          onBlur$={(event) => {
            const value = event.target.value;
            if (props.todo.title !== value) {
              updateTodo.run({ id: props.todo.id, title: value });
            }
          }}
          aria-invalid={!!updateTodo.fail?.fieldErrors.title}
          aria-describedby={`todo-update-error-${props.todo.id}`}
        />
        {!!updateTodo.fail?.fieldErrors.title && !updateTodo.isRunning ? (
          <div class="error" id={`todo-update-error-${props.todo.id}`}>
            {updateTodo.fail?.fieldErrors.title}
          </div>
        ) : null}
      </Form>
      <Form action={props.toggleTodo}>
        <input type="hidden" name="id" value={props.todo.id} />
        <input
          type="hidden"
          name="complete"
          value={optimisticComplete ? undefined : "1"}
        />
        <button
          type="submit"
          class="toggle"
          disabled={props.isNew || props.toggleTodo.isRunning}
          title={optimisticComplete ? "Mark as incomplete" : "Mark as complete"}
        >
          {optimisticComplete ? <CompleteIcon /> : <IncompleteIcon />}
        </button>
      </Form>
      <Form action={props.deleteTodo}>
        <input type="hidden" name="id" value={props.todo.id} />
        <button
          class="destroy"
          title="Delete todo"
          type="submit"
          disabled={props.isNew || props.deleteTodo.isRunning}
        />
      </Form>
    </li>
  );
});
