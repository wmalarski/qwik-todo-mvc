import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { createTodoAction } from "../layout";
import styles from "./CreateItem.css?inline";

export const CreateItem = component$(() => {
  useStylesScoped$(styles);

  const createTodo = createTodoAction.use();

  // const createInputRef = React.useRef<HTMLInputElement>(null);

  // React.useEffect(() => {
  //   if (!hidden) createInputRef.current?.focus();
  // }, [hidden]);

  return (
    <Form class="create-form" action={createTodo}>
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        name="title"
        aria-invalid={createTodo.fail ? true : undefined}
        aria-describedby="new-todo-error"
      />
      {createTodo.fail?.fieldErrors.title ? (
        <div class="error" id="new-todo-error">
          {createTodo.fail?.fieldErrors.title}
        </div>
      ) : null}
    </Form>
  );
});
