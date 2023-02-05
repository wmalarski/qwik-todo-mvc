import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";

export const Filters = component$(() => {
  const location = useLocation();

  const filter = location.params.filter;

  return (
    <ul role="navigation" class="filters">
      <li>
        <Link href={paths.all} class={{ selected: !filter }}>
          All
        </Link>
      </li>
      <li>
        <Link href={paths.active} class={{ selected: filter === "active" }}>
          Active
        </Link>
      </li>
      <li>
        <Link
          href={paths.complete}
          class={{ selected: filter === "completed" }}
        >
          Completed
        </Link>
      </li>
    </ul>
  );
});
