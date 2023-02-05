import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./layout.css?inline";

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <div class="container">
      <header>
        <h1 class="title">TODOS</h1>
      </header>
      <section class="content">
        <Slot />
      </section>
    </div>
  );
});
