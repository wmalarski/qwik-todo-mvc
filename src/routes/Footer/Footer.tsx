import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import styles from "./Footer.css?inline";

export const Footer = component$(() => {
  useStylesScoped$(styles);

  return (
    <footer class="footer">
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
