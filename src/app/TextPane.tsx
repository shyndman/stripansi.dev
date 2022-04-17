import CodeMirror, { Editor } from 'codemirror';
import 'codemirror/addon/display/placeholder';
import {
  FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
  WheelEvent,
} from 'react';
import '../../node_modules/codemirror/lib/codemirror.css';
import { isPreRender } from '../prerendering';
import { ReactComponent as CopyIcon } from './assets/icon-copy.svg';
import './codemirror/ansi-mode';
import styles from './TextPane.module.scss';

interface TextPaneProps {
  label: string;
  stat?: string;
  className?: string;

  autoFocus?: boolean;
  highlightAnsi?: boolean;
  supportsCopy?: boolean;

  value: string;
  setValue?: (newValue: string) => void;

  scrollSpec: string;
  onScroll?: (left: number, top: number) => void;
}

export function TextPane({
  label,
  stat,
  className,
  autoFocus,
  highlightAnsi,
  supportsCopy,
  value,
  setValue,
  scrollSpec,
  onScroll,
}: TextPaneProps) {
  className ??= '';

  const textAreaId = useId();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [codeMirror, setCodeMirror] = useState<Editor | null>(null);

  useEffect(() => {
    // Prerendering the code mirror stuff inevitably leads to a mismatch during
    // hydration
    if (isPreRender()) return;

    if (
      highlightAnsi &&
      textAreaRef.current != null &&
      textAreaRef.current.style.display !== 'none'
    ) {
      const inputId = textAreaRef.current.id;
      textAreaRef.current.removeAttribute('id');

      const codeMirror = CodeMirror.fromTextArea(textAreaRef.current, {
        mode: 'ansi',
        theme: 'stripansi',
        autofocus: autoFocus,
        extraKeys: {
          Tab: false,
        },
        lineNumbers: false,
        placeholder: 'Paste ANSI-polluted text here',
      });

      // Tweak the accessibility attributes a bit
      const inputField = codeMirror.getInputField();
      inputField.id = inputId;

      if (setValue != null) {
        codeMirror.on('change', (editor) => {
          setValue(editor.getValue());
        });
      }
      if (onScroll) {
        codeMirror.on('scroll', () => {
          const scrollInfo = codeMirror.getScrollInfo();
          onScroll(scrollInfo.left, scrollInfo.top);
        });
      }

      setCodeMirror(codeMirror);
    }
  }, [autoFocus, highlightAnsi, onScroll, setValue, textAreaRef]);

  let headerButtons;
  if (supportsCopy) {
    const copyText = () => navigator.clipboard.writeText(value);
    headerButtons = (
      <button className={styles.headerButton} onClick={copyText}>
        <div className={styles.headerButtonIcon}>
          <CopyIcon {...{ width: 14, height: 14 }}></CopyIcon>
        </div>
        <span className={styles.headerButtonLabel}>Copy</span>
      </button>
    );
  }

  const onInput =
    setValue != null
      ? (e: FormEvent<HTMLTextAreaElement>) => {
          setValue(e.currentTarget.value);
        }
      : undefined;

  const onWheel =
    onScroll != null && !highlightAnsi
      ? (e: WheelEvent<HTMLTextAreaElement>) =>
          onScroll(e.currentTarget.scrollLeft, e.currentTarget.scrollTop)
      : undefined;

  useEffect(() => {
    const scrollPos = scrollSpec.split(',').map(Number.parseFloat);
    if (highlightAnsi && codeMirror) {
      codeMirror.scrollTo(scrollPos[0], scrollPos[1]);
    } else {
      textAreaRef.current?.scroll(scrollPos[0], scrollPos[1]);
    }
  }, [codeMirror, highlightAnsi, scrollSpec]);

  const readOnly = setValue == null;
  const readOnlyStyle = readOnly ? styles.readOnly : '';

  return (
    <div className={`${className} ${styles.container}`}>
      <div className={styles.header}>
        <label className={styles.headerLabel} htmlFor={textAreaId}>
          {label}
        </label>
        <span className={styles.headerStat}>{stat}</span>
        {headerButtons}
      </div>
      <div className={`${styles.textAreaContainer} ${readOnlyStyle}`}>
        <textarea
          id={textAreaId}
          className={styles.textArea}
          autoFocus={autoFocus}
          readOnly={setValue == null}
          value={value}
          wrap="off"
          onInput={onInput}
          onWheel={onWheel}
          ref={textAreaRef}
        ></textarea>
      </div>
    </div>
  );
}
