## API Report File for "@jupyterlab/terminal"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { IWidgetTracker } from '@jupyterlab/apputils';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { Message } from '@phosphor/messaging';
import { TerminalSession } from '@jupyterlab/services';
import { Token } from '@phosphor/coreutils';
import { Widget } from '@phosphor/widgets';

// @public
export namespace ITerminal {
  export interface IOptions {
    cursorBlink: boolean;
    fontFamily: string | null;
    fontSize: number;
    initialCommand: string;
    lineHeight: number | null;
    pasteWithCtrlV: boolean;
    screenReaderMode: boolean;
    scrollback: number | null;
    shutdownOnClose: boolean;
    theme: Theme;
  }
  // (undocumented)
  export interface ITerminal extends Widget {
    getOption<K extends keyof IOptions>(option: K): IOptions[K];
    refresh(): Promise<void>;
    session: TerminalSession.ISession;
    setOption<K extends keyof IOptions>(option: K, value: IOptions[K]): void;
  }
  const defaultOptions: IOptions;
  export interface IThemeObject {
    // (undocumented)
    background: string;
    // (undocumented)
    cursor: string;
    // (undocumented)
    cursorAccent: string;
    // (undocumented)
    foreground: string;
    // (undocumented)
    selection: string;
  }
  export type Theme = 'light' | 'dark' | 'inherit';
}

// @public
export interface ITerminalTracker
  extends IWidgetTracker<MainAreaWidget<ITerminal.ITerminal>> {}

// @public
export const ITerminalTracker: Token<ITerminalTracker>;

// @public
export class Terminal extends Widget implements ITerminal.ITerminal {
  constructor(
    session: TerminalSession.ISession,
    options?: Partial<ITerminal.IOptions>
  );
  dispose(): void;
  getOption<K extends keyof ITerminal.IOptions>(
    option: K
  ): ITerminal.IOptions[K];
  protected onActivateRequest(msg: Message): void;
  protected onAfterAttach(msg: Message): void;
  protected onAfterShow(msg: Message): void;
  protected onFitRequest(msg: Message): void;
  protected onResize(msg: Widget.ResizeMessage): void;
  protected onUpdateRequest(msg: Message): void;
  processMessage(msg: Message): void;
  refresh(): Promise<void>;
  readonly session: TerminalSession.ISession;
  setOption<K extends keyof ITerminal.IOptions>(
    option: K,
    value: ITerminal.IOptions[K]
  ): void;
}

// (No @packageDocumentation comment for this package)
```