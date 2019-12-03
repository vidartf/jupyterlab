## API Report File for "@jupyterlab/docmanager"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { Contents } from '@jupyterlab/services';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IDisposable } from '@phosphor/disposable';
import { IDocumentWidget } from '@jupyterlab/docregistry';
import { IMessageHandler } from '@phosphor/messaging';
import { ISignal } from '@phosphor/signaling';
import { JSONObject } from '@phosphor/coreutils';
import { Kernel } from '@jupyterlab/services';
import { Message } from '@phosphor/messaging';
import { ServiceManager } from '@jupyterlab/services';
import { Token } from '@phosphor/coreutils';
import { VDomModel } from '@jupyterlab/apputils';
import { VDomRenderer } from '@jupyterlab/apputils';
import { Widget } from '@phosphor/widgets';

// @public
export class DocumentManager implements IDocumentManager {
  constructor(options: DocumentManager.IOptions);
  readonly activateRequested: ISignal<this, string>;
  autosave: boolean;
  autosaveInterval: number;
  cloneWidget(widget: Widget): IDocumentWidget | undefined;
  closeAll(): Promise<void>;
  closeFile(path: string): Promise<void>;
  contextForWidget(widget: Widget): DocumentRegistry.Context | undefined;
  copy(fromFile: string, toDir: string): Promise<Contents.IModel>;
  createNew(
    path: string,
    widgetName?: string,
    kernel?: Partial<Kernel.IModel>
  ): Widget;
  deleteFile(path: string): Promise<void>;
  dispose(): void;
  findWidget(
    path: string,
    widgetName?: string | null
  ): IDocumentWidget | undefined;
  readonly isDisposed: boolean;
  newUntitled(options: Contents.ICreateOptions): Promise<Contents.IModel>;
  open(
    path: string,
    widgetName?: string,
    kernel?: Partial<Kernel.IModel>,
    options?: DocumentRegistry.IOpenOptions
  ): IDocumentWidget | undefined;
  openOrReveal(
    path: string,
    widgetName?: string,
    kernel?: Partial<Kernel.IModel>,
    options?: DocumentRegistry.IOpenOptions
  ): IDocumentWidget | undefined;
  overwrite(oldPath: string, newPath: string): Promise<Contents.IModel>;
  readonly registry: DocumentRegistry;
  rename(oldPath: string, newPath: string): Promise<Contents.IModel>;
  readonly services: ServiceManager.IManager;
}

// @public
export namespace DocumentManager {
  export interface IOptions {
    manager: ServiceManager.IManager;
    opener: IWidgetOpener;
    registry: DocumentRegistry;
    setBusy?: () => IDisposable;
    when?: Promise<void>;
  }
  export interface IWidgetOpener {
    open(
      widget: IDocumentWidget,
      options?: DocumentRegistry.IOpenOptions
    ): void;
  }
}

// @public
export class DocumentWidgetManager implements IDisposable {
  constructor(options: DocumentWidgetManager.IOptions);
  readonly activateRequested: ISignal<this, string>;
  adoptWidget(context: DocumentRegistry.Context, widget: IDocumentWidget): void;
  cloneWidget(widget: Widget): IDocumentWidget | undefined;
  closeWidgets(context: DocumentRegistry.Context): Promise<void>;
  contextForWidget(widget: Widget): DocumentRegistry.Context | undefined;
  createWidget(
    factory: DocumentRegistry.WidgetFactory,
    context: DocumentRegistry.Context
  ): IDocumentWidget;
  deleteWidgets(context: DocumentRegistry.Context): Promise<void>;
  dispose(): void;
  findWidget(
    context: DocumentRegistry.Context,
    widgetName: string
  ): IDocumentWidget | undefined;
  readonly isDisposed: boolean;
  messageHook(handler: IMessageHandler, msg: Message): boolean;
  protected onClose(widget: Widget): Promise<boolean>;
  protected onDelete(widget: Widget): Promise<void>;
  protected setCaption(widget: Widget): Promise<void>;
}

// @public
export namespace DocumentWidgetManager {
  export interface IOptions {
    registry: DocumentRegistry;
  }
}

// @public
export const IDocumentManager: Token<IDocumentManager>;

// @public
export interface IDocumentManager extends IDisposable {
  readonly activateRequested: ISignal<this, string>;
  autosave: boolean;
  autosaveInterval: number;
  cloneWidget(widget: Widget): IDocumentWidget | undefined;
  closeAll(): Promise<void>;
  closeFile(path: string): Promise<void>;
  contextForWidget(widget: Widget): DocumentRegistry.Context | undefined;
  copy(fromFile: string, toDir: string): Promise<Contents.IModel>;
  createNew(
    path: string,
    widgetName?: string,
    kernel?: Partial<Kernel.IModel>
  ): Widget;
  deleteFile(path: string): Promise<void>;
  findWidget(
    path: string,
    widgetName?: string | null
  ): IDocumentWidget | undefined;
  newUntitled(options: Contents.ICreateOptions): Promise<Contents.IModel>;
  open(
    path: string,
    widgetName?: string,
    kernel?: Partial<Kernel.IModel>,
    options?: DocumentRegistry.IOpenOptions
  ): IDocumentWidget | undefined;
  openOrReveal(
    path: string,
    widgetName?: string,
    kernel?: Partial<Kernel.IModel>,
    options?: DocumentRegistry.IOpenOptions
  ): IDocumentWidget | undefined;
  overwrite(oldPath: string, newPath: string): Promise<Contents.IModel>;
  readonly registry: DocumentRegistry;
  rename(oldPath: string, newPath: string): Promise<Contents.IModel>;
  readonly services: ServiceManager.IManager;
}

// @public
export interface IFileContainer extends JSONObject {
  items: string[];
  path: string;
}

// @public
export function isValidFileName(name: string): boolean;

// @public
export class PathStatus extends VDomRenderer<PathStatus.Model> {
  constructor(opts: PathStatus.IOptions);
  render(): JSX.Element;
}

// @public
export namespace PathStatus {
  export interface IOptions {
    docManager: IDocumentManager;
  }
  export class Model extends VDomModel {
    constructor(docManager: IDocumentManager);
    readonly name: string;
    readonly path: string;
    widget: Widget | null;
  }
}

// @public
export function renameDialog(
  manager: IDocumentManager,
  oldPath: string
): Promise<Contents.IModel | null>;

// @public
export function renameFile(
  manager: IDocumentManager,
  oldPath: string,
  newPath: string
): Promise<Contents.IModel | null>;

// @public
export class SaveHandler implements IDisposable {
  constructor(options: SaveHandler.IOptions);
  dispose(): void;
  readonly isActive: boolean;
  readonly isDisposed: boolean;
  saveInterval: number;
  start(): void;
  stop(): void;
}

// @public
export namespace SaveHandler {
  export interface IOptions {
    context: DocumentRegistry.Context;
    saveInterval?: number;
  }
}

// @public
export class SavingStatus extends VDomRenderer<SavingStatus.Model> {
  constructor(opts: SavingStatus.IOptions);
  render(): JSX.Element;
}

// @public
export namespace SavingStatus {
  export interface IOptions {
    docManager: IDocumentManager;
  }
  export class Model extends VDomModel {
    constructor(docManager: IDocumentManager);
    readonly status: DocumentRegistry.SaveState | null;
    widget: Widget | null;
  }
}

// @public
export function shouldOverwrite(path: string): Promise<boolean>;

// (No @packageDocumentation comment for this package)
```