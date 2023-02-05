import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { DocumentHead, Form } from "@builder.io/qwik-city";
import { signOutAction } from "../layout";
import styles from "./Footer.css?inline";

export const Footer = component$(() => {
  useStylesScoped$(styles);

  const signOut = signOutAction.use();

  return (
    <footer>
      <Form action={signOut}>
        <button>Sign Out</button>
      </Form>
      <a href="https://www.builder.io/" target="_blank">
        Made with ♡ by wmalarski
      </a>
    </footer>
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
