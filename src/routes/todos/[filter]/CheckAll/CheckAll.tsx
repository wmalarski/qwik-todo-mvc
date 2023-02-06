import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { completeAllAction, countsLoader } from "../index";
import styles from "./CheckAll.css?inline";

type Props = {
  completeAll: ReturnType<(typeof completeAllAction)["use"]>;
};

export const CheckAll = component$<Props>((props) => {
  useStylesScoped$(styles);

  const counts = countsLoader.use();

  const areAllActivating =
    props.completeAll.isRunning && !props.completeAll.formData?.get("complete");

  const areAllCompleting =
    props.completeAll.isRunning &&
    !!props.completeAll.formData?.get("complete");

  const areAllCompleted =
    (areAllCompleting || counts.value.complete === counts.value.all) &&
    !areAllActivating;

  return (
    <>
      {counts.value.all > 0 ? (
        <Form action={props.completeAll}>
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
