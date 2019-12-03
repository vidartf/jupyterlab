## API Report File for "@jupyterlab/documentsearch"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import * as CodeMirror from 'codemirror';
import { CodeMirrorEditor } from '@jupyterlab/codemirror';
import { FileEditor } from '@jupyterlab/fileeditor';
import { IDisposable } from '@phosphor/disposable';
import { ISignal } from '@phosphor/signaling';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Token } from '@phosphor/coreutils';
import { Widget } from '@phosphor/widgets';

// @public (undocumented)
export type CMMainAreaWidget = MainAreaWidget<FileEditor> & {
  content: {
    editor: CodeMirrorEditor;
  };
};

// @public (undocumented)
export class CodeMirrorSearchProvider
  implements ISearchProvider<CMMainAreaWidget> {
  static canSearchOn(domain: Widget): domain is CMMainAreaWidget;
  readonly changed: ISignal<this, void>;
  // (undocumented)
  clearSelection(): void;
  // (undocumented)
  readonly currentMatch: ISearchMatch | null;
  readonly currentMatchIndex: number;
  endQuery(removeOverlay?: boolean): Promise<void>;
  endSearch(): Promise<void>;
  getInitialQuery(searchTarget: CMMainAreaWidget): any;
  highlightNext(): Promise<ISearchMatch | undefined>;
  highlightPrevious(): Promise<ISearchMatch | undefined>;
  readonly isReadOnly = false;
  isSubProvider: boolean;
  readonly matches: ISearchMatch[];
  // (undocumented)
  refreshOverlay(): void;
  replaceAllMatches(newText: string): Promise<boolean>;
  replaceCurrentMatch(newText: string): Promise<boolean>;
  startQuery(query: RegExp, searchTarget: Widget): Promise<ISearchMatch[]>;
  startQueryCodeMirror(
    query: RegExp,
    searchTarget: CodeMirrorEditor
  ): Promise<ISearchMatch[]>;
}

// @public (undocumented)
export interface IDisplayState {
  caseSensitive: boolean;
  currentIndex: number;
  errorMessage: string;
  forceFocus: boolean;
  query: RegExp;
  replaceEntryShown: boolean;
  replaceInputFocused: boolean;
  replaceText: string;
  searchInputFocused: boolean;
  searchText: string;
  totalMatches: number;
  useRegex: boolean;
}

// @public (undocumented)
export interface ISearchMatch {
  column: number;
  readonly fragment: string;
  index: number;
  line: number;
  readonly text: string;
}

// @public (undocumented)
export interface ISearchProvider<T extends Widget = Widget> {
  readonly changed: ISignal<ISearchProvider<T>, void>;
  readonly currentMatchIndex: number | null;
  endQuery(): Promise<void>;
  endSearch(): Promise<void>;
  getInitialQuery(searchTarget: T): any;
  highlightNext(): Promise<ISearchMatch | undefined>;
  highlightPrevious(): Promise<ISearchMatch | undefined>;
  readonly isReadOnly: boolean;
  readonly matches: ISearchMatch[];
  replaceAllMatches(newText: string): Promise<boolean>;
  replaceCurrentMatch(newText: string): Promise<boolean>;
  startQuery(query: RegExp, searchTarget: T): Promise<ISearchMatch[]>;
}

// @public
export interface ISearchProviderConstructor<T extends Widget = Widget> {
  // (undocumented)
  new (): ISearchProvider<T>;
  canSearchOn(domain: Widget): domain is T;
}

// @public
export const ISearchProviderRegistry: Token<ISearchProviderRegistry>;

// @public (undocumented)
export interface ISearchProviderRegistry {
  changed: ISignal<ISearchProviderRegistry, void>;
  getProviderForWidget(widget: any): ISearchProvider<any> | undefined;
  register(key: string, provider: ISearchProviderConstructor<any>): IDisposable;
}

// @public (undocumented)
export class NotebookSearchProvider implements ISearchProvider<NotebookPanel> {
  static canSearchOn(domain: Widget): domain is NotebookPanel;
  readonly changed: ISignal<this, void>;
  readonly currentMatchIndex: number;
  endQuery(): Promise<void>;
  endSearch(): Promise<void>;
  getInitialQuery(searchTarget: NotebookPanel): any;
  highlightNext(): Promise<ISearchMatch | undefined>;
  highlightPrevious(): Promise<ISearchMatch | undefined>;
  readonly isReadOnly = false;
  readonly matches: ISearchMatch[];
  replaceAllMatches(newText: string): Promise<boolean>;
  replaceCurrentMatch(newText: string): Promise<boolean>;
  startQuery(
    query: RegExp,
    searchTarget: NotebookPanel
  ): Promise<ISearchMatch[]>;
}

// @public
export class SearchInstance implements IDisposable {
  constructor(widget: Widget, searchProvider: ISearchProvider);
  _displaySearchWidget(): void;
  dispose(): void;
  readonly disposed: ISignal<this, void>;
  focusInput(): void;
  readonly isDisposed: boolean;
  readonly provider: ISearchProvider<Widget>;
  readonly searchWidget: Widget;
  updateIndices(): void;
}

// @public (undocumented)
export class SearchProviderRegistry implements ISearchProviderRegistry {
  readonly changed: ISignal<this, void>;
  getProviderForWidget<T extends Widget = Widget>(
    widget: T
  ): ISearchProvider<T> | undefined;
  register<T extends Widget = Widget>(
    key: string,
    provider: ISearchProviderConstructor<T>
  ): IDisposable;
}

// @public (undocumented)
export class SearchState {
  // (undocumented)
  lastQuery: string;
  // (undocumented)
  posFrom: CodeMirror.Position;
  // (undocumented)
  posTo: CodeMirror.Position;
  // (undocumented)
  query: RegExp;
}

// (No @packageDocumentation comment for this package)
```