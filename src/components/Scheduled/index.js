export default [
    require('./src/editor/editor.vue'),
    require('./src/input/input.vue')
];

export const meta = {
    name    : 'test-external-component',
    type    : 'onereach-studio-plugin',
    label   : 'Test example',
    version : '1.0'
};
