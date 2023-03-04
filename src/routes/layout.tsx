import { component$, Slot } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Footer } from "./Footer/Footer";

export default component$(() => {
  return (
    <>
      <main>
        <Slot />
      </main>
      <Footer />
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
