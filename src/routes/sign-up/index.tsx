import { component$ } from "@builder.io/qwik";
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

export default component$(() => {
  const signUp = signUpAction.use();

  return (
    <Form class="flex flex-col gap-2" action={signUp}>
      <h2 class="text-xl">Sign Up</h2>

      <div class="form-control w-full">
        <label for="email" class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          class="input input-bordered w-full"
          id="email"
          placeholder="Email"
          name="email"
          type="email"
        />
        <span>
          {signUp.fail?.fieldErrors.email || signUp.value?.errors?.email}
        </span>
      </div>

      <div class="form-control w-full">
        <label for="password" class="label">
          <span class="label-text">Password</span>
        </label>
        <input
          id="password"
          class="input input-bordered w-full"
          name="password"
          type="password"
        />
        <span>
          {signUp.fail?.fieldErrors.password || signUp.value?.errors?.password}
        </span>
      </div>

      <button class="btn btn-primary mt-2" type="submit">
        Sign Up
      </button>
      <Link href={paths.signIn}>Sign In</Link>
    </Form>
  );
});

export const head: DocumentHead = {
  title: "Sign Up - Qwik TODO MVC",
};
