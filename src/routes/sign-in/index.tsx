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
import { verifyLogin } from "~/server/user";
import { paths } from "~/utils/paths";

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

    event.redirect(302, paths.all);

    createSession(event, user.id);
  },
  zod$({
    email: z.string().email(),
    password: z.string().min(6),
  })
);

export default component$(() => {
  const signIn = signInAction.use();

  return (
    <Form class="flex flex-col gap-2" action={signIn}>
      <h2 class="text-xl">Sign In</h2>

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
          {signIn.fail?.fieldErrors.email || signIn.value?.errors?.email}
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
          {signIn.fail?.fieldErrors.password || signIn.value?.errors?.password}
        </span>
      </div>

      <button class="btn btn-primary mt-2" type="submit">
        Sign In
      </button>
      <Link href={paths.signUp}>Sign Up</Link>
    </Form>
  );
});

export const head: DocumentHead = {
  title: "Sign In - Qwik TODO MVC",
};