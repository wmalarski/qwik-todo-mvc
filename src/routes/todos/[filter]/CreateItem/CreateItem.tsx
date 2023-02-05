import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { createAction } from "../index";
import styles from "./CreateItem.css?inline";

type Props = {
  action: ReturnType<(typeof createAction)["use"]>;
};

export const CreateItem = component$<Props>((props) => {
  useStylesScoped$(styles);

  return (
    <>
      <Form action={props.action}>
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          name="title"
          aria-invalid={props.action.fail ? true : undefined}
          aria-describedby="new-todo-error"
        />
        {props.action.fail?.fieldErrors.title ? (
          <div class="error" id="new-todo-error">
            {props.action.fail?.fieldErrors.title}
          </div>
        ) : null}
      </Form>
    </>
  );
});
