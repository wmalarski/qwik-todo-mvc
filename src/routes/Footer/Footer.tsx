import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { DocumentHead, Form } from "@builder.io/qwik-city";
import { sessionLoader, signOutAction } from "../layout";
import styles from "./Footer.css?inline";

export const Footer = component$(() => {
  useStylesScoped$(styles);

  const session = sessionLoader.use();
  const signOut = signOutAction.use();

  return (
    <footer class="footer">
      {session.value ? (
        <Form action={signOut}>
          <button class="signOut" type="submit">
            Sign Out
          </button>
        </Form>
      ) : null}
      <a href="https://github.com/wmalarski/qwik-todo-mvc" target="_blank">
        Made by wmalarski
      </a>
      <a href="http://todomvc.com/" target="_blank">
        Inspired by TodoMVC
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
