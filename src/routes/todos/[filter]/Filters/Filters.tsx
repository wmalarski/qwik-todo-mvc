import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form, Link, useLocation } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import { countsLoader, deleteCompletedAction } from "../index";
import styles from "./Filters.css?inline";

export const Filters = component$(() => {
  useStylesScoped$(styles);

  const counts = countsLoader.use();
  const deleteCompleted = deleteCompletedAction.use();

  const location = useLocation();

  return (
    <div class="container">
      <span class="counts">{`${counts.value.active} ${
        counts.value.active === 1 ? "item" : "items"
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
