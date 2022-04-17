/*eslint no-control-regex: "off"*/

import ansiRegex from 'ansi-regex';
import React, { useEffect, useState } from 'react';
import styles from './App.module.scss';
import { Footer } from './Footer';
import { Header } from './Header';
import { TextPane } from './TextPane';
import { timeBlock } from './util';

function App() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState('');
  const [escapeCount, setEscapeCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState<number>();
  const [scrollSpec, setScrollSpec] = useState('0,0');

  const stripAnsi = (input: string) => {
    return timeBlock('Stripping ANSI', () =>
      input.replaceAll(ansiRegex({ onlyFirst: false }), ''),
    );
  };

  const countEscapes = (input: string) => {
    return input.match(ansiRegex())?.length ?? 0;
  };

  useEffect(() => {
    if (input) {
      const [output, elapsedMs] = stripAnsi(input);

      setOutput(output);
      setElapsedMs(elapsedMs);
      setEscapeCount(countEscapes(input));
    } else {
      // Clear output and the input stat
      setOutput('');
      setElapsedMs(undefined);
    }
  }, [input]);

  const formatCountStat = (count: number, elapsedMs: number | undefined) => {
    return elapsedMs !== undefined
      ? `(${count} found in ${elapsedMs.toFixed(1)}ms)`
      : undefined;
  };

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.textContainer}>
        <TextPane
          label="Input"
          stat={formatCountStat(escapeCount, elapsedMs)}
          className={styles.inputText}
          autoFocus={true}
          highlightAnsi={true}
          value={input}
          setValue={setInput}
          scrollSpec={scrollSpec}
          onScroll={(l, t) => setScrollSpec(`${l},${t}`)}
        />
        <TextPane
          label="Output"
          supportsCopy={true}
          className={styles.outputText}
          value={output}
          scrollSpec={scrollSpec}
          onScroll={(l, t) => setScrollSpec(`${l},${t}`)}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
