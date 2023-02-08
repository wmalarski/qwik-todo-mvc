import { component$, useStylesScoped$ } from "@builder.io/qwik";
import {
  action$,
  DocumentHead,
  Form,
  Link,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { createSession } from "~/server/auth";
import { getRequestContext } from "~/server/context";
import { createUser, getUser } from "~/server/user";
import { paths } from "~/utils/paths";
import styles from "./index.css?inline";

export const signUpAction = action$(
  async (data, event) => {
    const ctx = getRequestContext(event);

    const existing = await getUser({ ctx, email: data.email });

    if (existing) {
      return event.fail(400, {
        fieldErrors: {
          email: ["A user already exists with this email"],
          password: null,
        },
      });
    }

    const user = await createUser({ ctx, ...data });

    createSession(event, user.id);
  },
  zod$({
    email: z.string().email(),
    password: z.string().min(6),
  })
);

export default component$(() => {
  useStylesScoped$(styles);

  const signUp = signUpAction.use();

  const emailError = signUp.value?.fieldErrors.email?.[0];
  const passwordError = signUp.value?.fieldErrors.password?.[0];

  return (
    <Form class="form" action={signUp}>
      <h2 class="title">Sign Up</h2>

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
        Sign Up
      </button>
      <div class="link">
        <Link href={paths.signIn}>Sign In</Link>
      </div>
    </Form>
  );
});

export const head: DocumentHead = {
  title: "Sign Up - Qwik TODO MVC",
};
