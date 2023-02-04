import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <main>
        <section />
      </main>
      <footer>
        <a href="https://www.builder.io/" target="_blank">
          Made with ♡ by Builder.io
        </a>
      </footer>
    </>
  );
});

export const head: DocumentHead = {
  meta: [
    {
      content: "Qwik site description",
      name: "description",
    },
  ],
  title: "Welcome to Qwik",
};
