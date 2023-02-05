import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { completeAllTodosAction, countsLoader } from "..";

export const CheckAll = component$(() => {
  const counts = countsLoader.use();
  const completeAllTodos = completeAllTodosAction.use();

  const areAllCompleted = counts.value.complete === counts.value.all;

  return (
    <>
      {counts.value.all > 0 ? (
        <Form action={completeAllTodos}>
          <input
            name="complete"
            type="hidden"
            value={String(areAllCompleted)}
          />
          <button
            class={`toggle-all ${areAllCompleted ? "checked" : ""}`}
            type="submit"
          >
            {"❯"}
          </button>
        </Form>
      ) : null}
    </>
  );
});
