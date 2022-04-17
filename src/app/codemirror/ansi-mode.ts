/* eslint-disable no-control-regex */
import ansiRegex from 'ansi-regex';
import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple';
import './ansi-mode.scss';

CodeMirror.defineSimpleMode('ansi', {
  start: [
    // { regex: /\u001B\[0;36m/, token: 'ansi-cyan ansi' },
    { regex: ansiRegex({ onlyFirst: true }), token: 'ansi' },
    { regex: /[^\u001B\u009B]+/, token: 'other' },
  ],

  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    dontIndentStates: ['comment'],
    lineComment: '//',
  },
});
