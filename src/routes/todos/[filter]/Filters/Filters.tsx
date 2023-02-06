import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form, Link, useLocation } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import { countsLoader, deleteCompletedAction } from "../index";
import styles from "./Filters.css?inline";

type Props = {
  deleteCompleted: ReturnType<(typeof deleteCompletedAction)["use"]>;
};

export const Filters = component$<Props>((props) => {
  useStylesScoped$(styles);

  const counts = countsLoader.use();

  const location = useLocation();

  const count = counts.value.active;

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
          <Form action={props.deleteCompleted}>
            <button
              class="clear-completed"
              type="submit"
              disabled={props.deleteCompleted.isRunning}
            >
              Clear completed
            </button>
          </Form>
        </div>
      ) : null}
    </div>
  );
});
