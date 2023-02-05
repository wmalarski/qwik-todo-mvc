import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { createAction } from "../layout";
import { TodoItem } from "../[filter]/TodoItem/TodoItem";
import styles from "./CreateItem.css?inline";

export const CreateItem = component$(() => {
  useStylesScoped$(styles);

  const create = createAction.use();

  return (
    <>
      <Form action={create}>
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
        {create.isRunning ? (
          <TodoItem
            todo={{
              complete: false,
              id: "new",
              title: create.formData?.get("title") as string,
            }}
            isNew
          />
        ) : null}
      </Form>
    </>
  );
});
