import { component$, Slot } from "@builder.io/qwik";
import { action$, DocumentHead, loader$, z, zod$ } from "@builder.io/qwik-city";
import { createSession, deleteSession } from "~/server/auth";
import { getRequestContext } from "~/server/context";
import { createUser, getUser, verifyLogin } from "~/server/user";
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

export const signInAction = action$(
  async (data, event) => {
    const ctx = getRequestContext(event);

    const user = await verifyLogin({ ctx, ...data });

    if (!user) {
      event.status(400);
      return {
        errors: {
          email: "Invalid email or password",
          password: null,
        },
      };
    }

    event.redirect(302, paths.todos);

    createSession(event, user.id);
  },
  zod$({
    email: z.string().email(),
    password: z.string().min(6),
  })
);

export const signUpAction = action$(
  async (data, event) => {
    const ctx = getRequestContext(event);

    const existing = await getUser({ ctx, email: data.email });

    if (existing) {
      event.status(400);
      return {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      };
    }

    const user = await createUser({ ctx, ...data });

    createSession(event, user.id);
  },
  zod$({
    email: z.string().email(),
    password: z.string(),
  })
);

export const signOutAction = action$((_data, event) => {
  deleteSession(event);

  event.redirect(302, paths.signIn);
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
