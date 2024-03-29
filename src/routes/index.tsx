import { component$, useStylesScoped$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  routeLoader$,
  z,
  zod$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { createSession } from "~/server/auth";
import { getRequestContext } from "~/server/context";
import { verifyLogin } from "~/server/user";
import { paths } from "~/utils/paths";
import styles from "./index.css?inline";

export const useSessionLoader = routeLoader$((event) => {
  const ctx = getRequestContext(event);

  if (ctx.session) {
    event.redirect(302, paths.all);
  }

  return ctx.session;
});

export const useSignInAction = routeAction$(
  async (data, event) => {
    const ctx = getRequestContext(event);

    const user = await verifyLogin({ ctx, ...data });

    if (!user) {
      return event.fail(400, {
        fieldErrors: {
          email: ["Invalid email or password"],
          password: null,
        },
      });
    }
    createSession(event, user.id);

    event.redirect(302, paths.all);
  },
  zod$({
    email: z.string().email(),
    password: z.string().min(6),
  })
);

export default component$(() => {
  useStylesScoped$(styles);

  useSessionLoader();

  const signIn = useSignInAction();

  const emailError = signIn.value?.fieldErrors?.email?.[0];
  const passwordError = signIn.value?.fieldErrors?.password?.[0];

  return (
    <Form class="form" action={signIn}>
      <h1 class="title">TodoMVC Sign In</h1>

      <div class="control">
        <label for="email" class="label">
          Email
        </label>
        <input
          aria-invalid={!!emailError}
          class="input"
          id="email"
          placeholder="Email"
          name="email"
          type="email"
        />
        <span class="error">{emailError}</span>
      </div>

      <div class="control">
        <label for="password" class="label">
          Password
        </label>
        <input
          aria-invalid={!!passwordError}
          id="password"
          class="input"
          name="password"
          type="password"
        />
        <span class="error">{passwordError}</span>
      </div>

      <button class="btn" type="submit">
        Sign In
      </button>
      <div class="link">
        <a href={paths.signUp}>Sign Up</a>
      </div>
    </Form>
  );
});

export const head: DocumentHead = {
  title: "Sign In - Qwik TODO MVC",
};
