import { component$, Slot } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getRequestContext } from "~/server/context";
import { paths } from "~/utils/paths";
import { Footer } from "./Footer/Footer";

export const sessionLoader = loader$((event) => {
  const ctx = getRequestContext(event);

  const isInProtected = event.url.pathname.startsWith(paths.todos);

  if (ctx.session && !isInProtected) {
    event.redirect(302, paths.all);
  }

  if (!ctx.session && isInProtected) {
    event.redirect(302, paths.signIn);
  }

  return ctx.session;
});

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
