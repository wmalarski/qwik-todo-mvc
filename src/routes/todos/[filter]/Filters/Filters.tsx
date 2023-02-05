import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form, Link, useLocation } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import {
  countsLoader,
  createAction,
  deleteAction,
  deleteCompletedAction,
  toggleAction,
} from "../index";
import styles from "./Filters.css?inline";

type Props = {
  createTodo: ReturnType<(typeof createAction)["use"]>;
  deleteTodo: ReturnType<(typeof deleteAction)["use"]>;
  toggleTodo: ReturnType<(typeof toggleAction)["use"]>;
};

export const Filters = component$<Props>((props) => {
  useStylesScoped$(styles);

  const counts = countsLoader.use();
  const deleteCompleted = deleteCompletedAction.use();

  const location = useLocation();

  const createShift = props.createTodo.isRunning ? 1 : 0;
  const deleteShift = props.deleteTodo.isRunning ? -1 : 0;
  const toggleShift = !props.toggleTodo.isRunning
    ? 0
    : props.toggleTodo.formData?.get("complete")
    ? -1
    : 1;
  const count = counts.value.active + createShift + deleteShift + toggleShift;

  return (
    <div class="container">
      <span class="counts">{`${count} ${
        count === 1 ? "item" : "items"
      } left`}</span>
      <ul role="navigation" class="filters">
        <li
          class={[
            "link",
            { selected: location.pathname.startsWith(paths.all) },
          ]}
        >
          <Link href={paths.all}>All</Link>
        </li>
        <li
          class={[
            "link",
            { selected: location.pathname.startsWith(paths.active) },
          ]}
        >
          <Link href={paths.active}>Active</Link>
        </li>
        <li
          class={[
            "link",
            { selected: location.pathname.startsWith(paths.complete) },
          ]}
        >
          <Link href={paths.complete}>Completed</Link>
        </li>
      </ul>
      {counts.value.complete > 0 ? (
        <div class="clear">
          <Form action={deleteCompleted}>
            <button class="clear-completed" type="submit">
              Clear completed
            </button>
          </Form>
        </div>
      ) : null}
    </div>
  );
});
