export default [
  require("./src/editor/editor.vue"),
  require("./src/input/input.vue")
];

export const meta = {
  name: "test-external-component",
  type: "onereach-studio-plugin",
  label: "Paired Value",
  version: "1.0"
};
