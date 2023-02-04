import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return <span>TODOS</span>;
});

export const head: DocumentHead = {
  title: "TODOS - Qwik TODO MVC",
};
