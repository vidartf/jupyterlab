## API Report File for "@jupyterlab/console"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { Cell } from '@jupyterlab/cells';
import { CellModel } from '@jupyterlab/cells';
import { CodeCell } from '@jupyterlab/cells';
import { CodeCellModel } from '@jupyterlab/cells';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { IClientSession } from '@jupyterlab/apputils';
import { ICodeCellModel } from '@jupyterlab/cells';
import { IDisposable } from '@phosphor/disposable';
import { IEditorMimeTypeService } from '@jupyterlab/codeeditor';
import { IObservableList } from '@jupyterlab/observables';
import { IRawCellModel } from '@jupyterlab/cells';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ISignal } from '@phosphor/signaling';
import { IWidgetTracker } from '@jupyterlab/apputils';
import { JSONObject } from '@phosphor/coreutils';
import { KernelMessage } from '@jupyterlab/services';
import { Message } from '@phosphor/messaging';
import { nbformat } from '@jupyterlab/coreutils';
import { Panel } from '@phosphor/widgets';
import { RawCell } from '@jupyterlab/cells';
import { ServiceManager } from '@jupyterlab/services';
import { Token } from '@phosphor/coreutils';
import { Widget } from '@phosphor/widgets';

// @public
export class CodeConsole extends Widget {
  constructor(options: CodeConsole.IOptions);
  addBanner(): void;
  addCell(cell: CodeCell, msgId?: string): void;
  readonly cells: IObservableList<Cell>;
  clear(): void;
  readonly contentFactory: CodeConsole.IContentFactory;
  createCodeCell(): CodeCell;
  dispose(): void;
  execute(force?: boolean, timeout?: number): Promise<void>;
  readonly executed: ISignal<this, Date>;
  getCell(msgId: string): CodeCell | undefined;
  handleEvent(event: Event): void;
  inject(code: string, metadata?: JSONObject): Promise<void>;
  insertLinebreak(): void;
  readonly modelFactory: CodeConsole.IModelFactory;
  protected newPromptCell(): void;
  protected onActivateRequest(msg: Message): void;
  protected onAfterAttach(msg: Message): void;
  protected onBeforeDetach(msg: Message): void;
  protected onUpdateRequest(msg: Message): void;
  // (undocumented)
  readonly promptCell: CodeCell | null;
  readonly promptCellCreated: ISignal<this, CodeCell>;
  readonly rendermime: IRenderMimeRegistry;
  serialize(): nbformat.ICodeCell[];
  readonly session: IClientSession;
}

// @public
export namespace CodeConsole {
  export class ContentFactory extends Cell.ContentFactory
    implements IContentFactory {
    createCodeCell(options: CodeCell.IOptions): CodeCell;
    createRawCell(options: RawCell.IOptions): RawCell;
  }
  export namespace ContentFactory {
    export interface IOptions extends Cell.IContentFactory {}
  }
  export interface IContentFactory extends Cell.IContentFactory {
    createCodeCell(options: CodeCell.IOptions): CodeCell;
    createRawCell(options: RawCell.IOptions): RawCell;
  }
  export interface IModelFactory {
    readonly codeCellContentFactory: CodeCellModel.IContentFactory;
    createCodeCell(options: CodeCellModel.IOptions): ICodeCellModel;
    createRawCell(options: CellModel.IOptions): IRawCellModel;
  }
  const defaultContentFactory: IContentFactory;
  export interface IModelFactoryOptions {
    codeCellContentFactory?: CodeCellModel.IContentFactory;
  }
  export interface IOptions {
    contentFactory: IContentFactory;
    mimeTypeService: IEditorMimeTypeService;
    modelFactory?: IModelFactory;
    rendermime: IRenderMimeRegistry;
    session: IClientSession;
  }
  export class ModelFactory {
    constructor(options?: IModelFactoryOptions);
    readonly codeCellContentFactory: CodeCellModel.IContentFactory;
    createCodeCell(options: CodeCellModel.IOptions): ICodeCellModel;
    createRawCell(options: CellModel.IOptions): IRawCellModel;
  }
  const defaultModelFactory: ModelFactory;
}

// @public
export class ConsoleHistory implements IConsoleHistory {
  constructor(options: ConsoleHistory.IOptions);
  back(placeholder: string): Promise<string>;
  dispose(): void;
  editor: CodeEditor.IEditor | null;
  forward(placeholder: string): Promise<string>;
  readonly isDisposed: boolean;
  protected onEdgeRequest(
    editor: CodeEditor.IEditor,
    location: CodeEditor.EdgeLocation
  ): void;
  protected onHistory(value: KernelMessage.IHistoryReplyMsg): void;
  protected onTextChange(): void;
  readonly placeholder: string;
  push(item: string): void;
  reset(): void;
  readonly session: IClientSession;
  protected setFilter(filterStr?: string): void;
}

// @public
export namespace ConsoleHistory {
  export interface IOptions {
    session: IClientSession;
  }
}

// @public
export class ConsolePanel extends Panel {
  constructor(options: ConsolePanel.IOptions);
  readonly console: CodeConsole;
  readonly contentFactory: ConsolePanel.IContentFactory;
  dispose(): void;
  protected onActivateRequest(msg: Message): void;
  protected onCloseRequest(msg: Message): void;
  readonly session: IClientSession;
}

// @public
export namespace ConsolePanel {
  export class ContentFactory extends CodeConsole.ContentFactory
    implements IContentFactory {
    createConsole(options: CodeConsole.IOptions): CodeConsole;
  }
  export namespace ContentFactory {
    export interface IOptions extends CodeConsole.ContentFactory.IOptions {}
  }
  export interface IContentFactory extends CodeConsole.IContentFactory {
    createConsole(options: CodeConsole.IOptions): CodeConsole;
  }
  export interface IOptions {
    basePath?: string;
    contentFactory: IContentFactory;
    kernelPreference?: IClientSession.IKernelPreference;
    manager: ServiceManager.IManager;
    mimeTypeService: IEditorMimeTypeService;
    modelFactory?: CodeConsole.IModelFactory;
    name?: string;
    path?: string;
    rendermime: IRenderMimeRegistry;
    setBusy?: () => IDisposable;
  }
  const defaultContentFactory: IContentFactory;
  const IContentFactory: Token<IContentFactory>;
}

// @public
export class ForeignHandler implements IDisposable {
  constructor(options: ForeignHandler.IOptions);
  dispose(): void;
  enabled: boolean;
  readonly isDisposed: boolean;
  protected onIOPubMessage(
    sender: IClientSession,
    msg: KernelMessage.IIOPubMessage
  ): boolean;
  readonly parent: ForeignHandler.IReceiver;
  readonly session: IClientSession;
}

// @public
export namespace ForeignHandler {
  export interface IOptions {
    parent: IReceiver;
    session: IClientSession;
  }
  export interface IReceiver {
    addCell(cell: CodeCell, msgId: string): void;
    createCodeCell(): CodeCell;
    getCell(msgId: string): CodeCell;
    update(): void;
  }
}

// @public
export interface IConsoleHistory extends IDisposable {
  back(placeholder: string): Promise<string>;
  editor: CodeEditor.IEditor | null;
  forward(placeholder: string): Promise<string>;
  readonly placeholder: string;
  push(item: string): void;
  reset(): void;
  readonly session: IClientSession;
}

// @public
export const IConsoleTracker: Token<IConsoleTracker>;

// @public
export interface IConsoleTracker extends IWidgetTracker<ConsolePanel> {}

// (No @packageDocumentation comment for this package)
```