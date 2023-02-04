import { component$, Slot } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <main>
        <Slot />
      </main>
      <footer>
        <a href="https://www.builder.io/" target="_blank">
          Made with ♡ by wmalarski
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
};
