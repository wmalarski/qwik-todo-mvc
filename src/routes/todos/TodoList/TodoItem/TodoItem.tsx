import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import type { Todo } from "@prisma/client";
import { deleteTodoAction, toggleTodoAction, updateTodoAction } from "../..";

type Props = {
  isNew: boolean;
  todo: Omit<Todo, "userId" | "updatedAt">;
};

export const TodoItem = component$<Props>((props) => {
  const deleteTodo = deleteTodoAction.use();
  const updateTodo = updateTodoAction.use();
  const toggleTodo = toggleTodoAction.use();

  // const isDeleting =
  //   canBeOptimistic(deleteFetcher) || (clearingTodos && todo.complete);
  // const isToggling = canBeOptimistic(toggleFetcher);

  // const optimisticComplete = isToggling
  //   ? toggleFetcher.submission?.formData.get("complete") === "true"
  //   : typeof togglingComplete === "boolean"
  //   ? togglingComplete
  //   : props.todo.complete;

  const optimisticComplete = props.todo.complete;

  // const shouldRender =
  //   filter === "all" ||
  //   (filter === "complete" && optimisticComplete) ||
  //   (filter === "active" && !optimisticComplete);

  return (
    <li class={["todo", optimisticComplete ? "completed" : ""]}>
      <div class="view">
        <Form action={toggleTodo}>
          <input type="hidden" name="id" value={props.todo.id} />
          <input
            type="hidden"
            name="complete"
            value={(!optimisticComplete).toString()}
          />
          <button
            type="submit"
            class="toggle"
            disabled={props.isNew}
            title={
              optimisticComplete ? "Mark as incomplete" : "Mark as complete"
            }
          />
        </Form>
        <Form action={updateTodo} class="update-form">
          <input type="hidden" name="id" value={props.todo.id} />
          <input
            name="title"
            class="edit-input"
            value={props.todo.title}
            disabled={props.isNew}
            onBlur$={(event) => {
              const value = event.currentTarget.value;
              if (props.todo.title !== value) {
                updateTodo.run({ id: props.todo.id, title: value });
              }
            }}
            aria-invalid={!!updateTodo.fail?.fieldErrors.title}
            aria-describedby={`todo-update-error-${props.todo.id}`}
          />
          {!!updateTodo.fail?.fieldErrors.title && !updateTodo.isRunning ? (
            <div
              class="error todo-update-error"
              id={`todo-update-error-${props.todo.id}`}
            >
              {updateTodo.fail?.fieldErrors.title}
            </div>
          ) : null}
        </Form>
        <Form action={deleteTodo}>
          <input type="hidden" name="id" value={props.todo.id} />
          <button
            class="destroy"
            title="Delete todo"
            type="submit"
            name="intent"
            value="deleteTodo"
            disabled={props.isNew}
          />
        </Form>
      </div>
    </li>
  );
});
