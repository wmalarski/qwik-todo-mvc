import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return <span />;
});

export const head: DocumentHead = {
  title: "Sign In - Qwik TODO MVC",
};
