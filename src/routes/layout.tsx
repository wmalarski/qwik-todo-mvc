import { component$, Slot } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getRequestContext } from "~/server/context";
import { paths } from "~/utils/paths";

export const userLoader = loader$((event) => {
  const ctx = getRequestContext(event);

  const isInProtected = event.url.pathname.startsWith(paths.todos);

  if (ctx.session && !isInProtected) {
    event.redirect(302, paths.todos);
  }

  if (!ctx.session && isInProtected) {
    event.redirect(302, paths.signIn);
  }
});

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
