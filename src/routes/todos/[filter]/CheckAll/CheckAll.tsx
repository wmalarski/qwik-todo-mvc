import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { completeAllAction, countsLoader } from "../index";
import styles from "./CheckAll.css?inline";

export const CheckAll = component$(() => {
  useStylesScoped$(styles);

  const counts = countsLoader.use();
  const completeAll = completeAllAction.use();

  const areAllCompleted = counts.value.complete === counts.value.all;

  return (
    <>
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
    </>
  );
});
