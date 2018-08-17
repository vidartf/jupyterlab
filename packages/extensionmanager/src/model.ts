// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { VDomModel } from '@jupyterlab/apputils';

import { ServerConnection, ServiceManager, Kernel } from '@jupyterlab/services';

import * as semver from 'semver';

import { doBuild } from './build-helper';

import { IEntry } from './common';

import {
  presentCompanions,
  IKernelInstallInfo,
  KernelCompanion
} from './companions';

import { reportInstallError } from './dialog';

import { Searcher, ISearchResult, isJupyterOrg } from './query';

import {
  fetchInstalled,
  IActionReply,
  IInstalledEntry,
  performAction
} from './servercom';

/**
 * Model for an extension list.
 */
export class ListModel extends VDomModel {
  constructor(serviceManager: ServiceManager) {
    super();
    this._installed = [];
    this._searchResult = [];
    this.serviceManager = serviceManager;
    this.serverConnectionSettings = ServerConnection.makeSettings();
  }

  /**
   * A readonly array of the installed extensions.
   */
  get installed(): ReadonlyArray<IEntry> {
    return this._installed;
  }

  /**
   * A readonly array containing the latest search result
   */
  get searchResult(): ReadonlyArray<IEntry> {
    return this._searchResult;
  }

  /**
   * The current NPM repository search query.
   *
   * Setting its value triggers a new search.
   */
  get query(): string | null {
    return this._query;
  }
  set query(value: string | null) {
    this._query = value;
    this.update();
  }

  /**
   * The current NPM repository search page.
   *
   * The npm repository search is paginated by the `pagination` attribute.
   * The `page` value selects which page is used.
   *
   * Setting its value triggers a new search.
   */
  get page(): number {
    return this._page;
  }
  set page(value: number) {
    this._page = value;
    this.update();
  }

  /**
   * The NPM repository search pagination.
   *
   * The npm repository search is paginated by the `pagination` attribute.
   * The `page` value selects which page is used.
   *
   * Setting its value triggers a new search.
   */
  get pagination(): number {
    return this._pagination;
  }
  set pagination(value: number) {
    this._pagination = value;
    this.update();
  }

  /**
   * The total number of results in the current search.
   */
  get totalEntries(): number {
    return this._totalEntries;
  }

  /**
   * Initialize the model.
   */
  initialize() {
    this.update()
      .then(() => {
        this.initialized = true;
        this.stateChanged.emit(undefined);
      })
      .catch(() => {
        this.initialized = true;
        this.stateChanged.emit(undefined);
      });
  }

  /**
   * Whether there are currently any actions pending.
   */
  hasPendingActions(): boolean {
    return this._pendingActions.length > 0;
  }

  /**
   * Install an extension.
   *
   * @param entry An entry indicating which extension to install.
   */
  install(entry: IEntry) {
    if (entry.installed) {
      // Updating
      return this._performAction('install', entry).then(data => {
        if (data.status !== 'ok') {
          reportInstallError(entry.name, data.message);
        }
        this.update();
      });
    }
    this.checkCompanionPackages(entry).then(shouldInstall => {
      if (shouldInstall) {
        return this._performAction('install', entry).then(data => {
          if (data.status !== 'ok') {
            reportInstallError(entry.name, data.message);
          }
          this.update();
        });
      }
    });
  }

  /**
   * Uninstall an extension.
   *
   * @param entry An entry indicating which extension to uninstall.
   */
  uninstall(entry: IEntry) {
    if (!entry.installed) {
      throw new Error(`Not installed, cannot uninstall: ${entry.name}`);
    }
    this._performAction('uninstall', entry).then(data => {
      this.update();
    });
  }

  /**
   * Enable an extension.
   *
   * @param entry An entry indicating which extension to enable.
   */
  enable(entry: IEntry) {
    if (entry.enabled) {
      throw new Error(`Already enabled: ${entry.name}`);
    }
    this._performAction('enable', entry).then(data => {
      this.update();
    });
  }

  /**
   * Disable an extension.
   *
   * @param entry An entry indicating which extension to disable.
   */
  disable(entry: IEntry) {
    if (!entry.enabled) {
      throw new Error(`Already disabled: ${entry.name}`);
    }
    this._performAction('disable', entry).then(data => {
      this.update();
    });
  }

  /**
   * Check for companion packages in kernels or server.
   *
   * @param entry An entry indicating which extension to check.
   */
  checkCompanionPackages(entry: IEntry): Promise<boolean> {
    return this.searcher
      .fetchPackageData(entry.name, entry.latest_version)
      .then(data => {
        if (!data || !data.jupyterlab || !data.jupyterlab.discovery) {
          return true;
        }
        let discovery = data.jupyterlab.discovery;
        let kernelCompanions: KernelCompanion[] = [];
        if (discovery.kernel) {
          // match specs
          for (let kernelInfo of discovery.kernel) {
            let matches = Private.matchSpecs(
              kernelInfo,
              this.serviceManager.specs
            );
            kernelCompanions.push({ kernelInfo, kernels: matches });
          }
        }
        if (kernelCompanions.length < 1 && !discovery.server) {
          return true;
        }
        return presentCompanions(kernelCompanions, discovery.server);
      });
  }

  /**
   * Trigger a build check to incorporate actions taken.
   */
  triggerBuildCheck(): void {
    let builder = this.serviceManager.builder;
    if (builder.isAvailable && !this.promptBuild) {
      const completed = builder.getStatus().then(response => {
        if (response.status === 'building') {
          // Piggy-back onto existing build
          // TODO: Can this cause dialog collision on build completion?
          return doBuild(builder);
        }
        if (response.status !== 'needed') {
          return;
        }
        if (!this.promptBuild) {
          this.promptBuild = true;
          this.stateChanged.emit(undefined);
        }
      });
      this._addPendingAction(completed);
    }
  }

  /**
   * Perform a build on the server
   */
  performBuild(): void {
    if (this.promptBuild) {
      this.promptBuild = false;
      this.stateChanged.emit(undefined);
    }
    const completed = doBuild(this.serviceManager.builder);
    this._addPendingAction(completed);
  }

  /**
   * Ignore a build recommendation
   */
  ignoreBuildRecommendation(): void {
    if (this.promptBuild) {
      this.promptBuild = false;
      this.stateChanged.emit(undefined);
    }
  }

  /**
   * Ignore a build recommendation
   */
  refreshInstalled(): void {
    const refresh = this.update(true);
    this._addPendingAction(refresh);
  }

  /**
   * Translate search results from an npm repository query into entries
   * and remove entries with 'deprecated' in the keyword list
   *
   * @param res Promise to an npm query result.
   */
  protected async translateSearchResult(
    res: Promise<ISearchResult>
  ): Promise<{ [key: string]: IEntry }> {
    let entries: { [key: string]: IEntry } = {};
    for (let obj of (await res).objects) {
      let pkg = obj.package;
      if (pkg.keywords.indexOf('deprecated') >= 0) {
        continue;
      }
      entries[pkg.name] = {
        name: pkg.name,
        description: pkg.description,
        url:
          'homepage' in pkg.links
            ? pkg.links.homepage
            : 'repository' in pkg.links ? pkg.links.repository : pkg.links.npm,
        installed: false,
        enabled: false,
        status: null,
        latest_version: pkg.version,
        installed_version: ''
      };
    }
    return entries;
  }

  /**
   * Translate installed extensions information from the server into entries.
   *
   * @param res Promise to the server reply data.
   */
  protected async translateInstalled(
    res: Promise<IInstalledEntry[]>
  ): Promise<{ [key: string]: IEntry }> {
    const promises = [];
    const entries: { [key: string]: IEntry } = {};
    for (let pkg of await res) {
      promises.push(
        res.then(info => {
          entries[pkg.name] = {
            name: pkg.name,
            description: pkg.description,
            url: pkg.url,
            installed: pkg.installed !== false,
            enabled: pkg.enabled,
            status: pkg.status,
            latest_version: pkg.latest_version,
            installed_version: pkg.installed_version
          };
        })
      );
    }
    return Promise.all(promises).then(() => {
      return entries;
    });
  }

  /**
   * Make a request to the server for info about its installed extensions.
   */
  protected fetchInstalled(
    refreshInstalled = false
  ): Promise<IInstalledEntry[]> {
    const request = fetchInstalled(
      refreshInstalled,
      this.serverConnectionSettings
    );
    request.then(
      () => {
        this.serverConnectionError = null;
      },
      reason => {
        this.serverConnectionError = reason.toString();
      }
    );
    return request;
  }

  /**
   * Search with current query.
   *
   * Sets searchError and totalEntries as appropriate.
   *
   * @returns {Promise<{ [key: string]: IEntry; }>} The search result as a map of entries.
   */
  protected async performSearch(): Promise<{ [key: string]: IEntry }> {
    if (this.query === null) {
      this._searchResult = [];
      this._totalEntries = 0;
      this.searchError = null;
      return {};
    }

    // Start the search without waiting for it:
    let search = this.searcher.searchExtensions(
      this.query,
      this.page,
      this.pagination
    );
    let searchMapPromise = this.translateSearchResult(search);

    let searchMap: { [key: string]: IEntry };
    try {
      searchMap = await searchMapPromise;
      this.searchError = null;
    } catch (reason) {
      searchMap = {};
      this.searchError = reason.toString();
    }

    try {
      this._totalEntries = (await search).total;
    } catch (error) {
      this._totalEntries = 0;
    }

    return searchMap;
  }

  /**
   * Query the installed extensions.
   *
   * Sets installedError as appropriate.
   *
   * @returns {Promise<{ [key: string]: IEntry; }>} A map of installed extensions.
   */
  protected async queryInstalled(
    refreshInstalled: boolean
  ): Promise<{ [key: string]: IEntry }> {
    let installedMap;
    try {
      installedMap = await this.translateInstalled(
        this.fetchInstalled(refreshInstalled)
      );
      this.installedError = null;
    } catch (reason) {
      installedMap = {};
      this.installedError = reason.toString();
    }
    return installedMap;
  }

  /**
   * Update the current model.
   *
   * This will query the NPM repository, and the notebook server.
   *
   * Emits the `stateChanged` signal on successful completion.
   */
  protected async update(refreshInstalled = false) {
    // Start both queries before awaiting:
    const searchMapPromise = this.performSearch();
    const installedMapPromise = this.queryInstalled(refreshInstalled);

    // Await results:
    const searchMap = await searchMapPromise;
    const installedMap = await installedMapPromise;

    // Map results to attributes:
    let installed: IEntry[] = [];
    for (let key of Object.keys(installedMap)) {
      installed.push(installedMap[key]);
    }
    this._installed = installed.sort(Private.comparator);

    let searchResult: IEntry[] = [];
    for (let key of Object.keys(searchMap)) {
      // Filter out installed entries from search results:
      if (installedMap[key] === undefined) {
        searchResult.push(searchMap[key]);
      } else {
        searchResult.push(installedMap[key]);
      }
    }
    this._searchResult = searchResult.sort(Private.comparator);

    // Signal updated state
    this.stateChanged.emit(undefined);
  }

  /**
   * Send a request to the server to perform an action on an extension.
   *
   * @param action A valid action to perform.
   * @param entry The extension to perform the action on.
   */
  protected _performAction(
    action: string,
    entry: IEntry
  ): Promise<IActionReply> {
    const completed = performAction(
      action,
      entry,
      this.serverConnectionSettings
    );
    completed.then(
      () => {
        this.serverConnectionError = null;
        this.triggerBuildCheck();
      },
      reason => {
        this.serverConnectionError = reason.toString();
      }
    );
    this._addPendingAction(completed);
    return completed;
  }

  /**
   * Add a pending action.
   *
   * @param pending A promise that resolves when the action is completed.
   */
  protected _addPendingAction(pending: Promise<any>): void {
    // Add to pending actions collection
    this._pendingActions.push(pending);

    // Ensure action is removed when resolved
    const remove = () => {
      const i = this._pendingActions.indexOf(pending);
      this._pendingActions.splice(i, 1);
      this.stateChanged.emit(undefined);
    };
    pending.then(remove, remove);

    // Signal changed state
    this.stateChanged.emit(undefined);
  }

  /**
   * Contains an error message if an error occurred when querying installed extensions.
   */
  installedError: string | null = null;

  /**
   * Contains an error message if an error occurred when searching for extensions.
   */
  searchError: string | null = null;

  /**
   * Contains an error message if an error occurred when querying the server extension.
   */
  serverConnectionError: string | null = null;

  /**
   * Contains an error message if the server has unfulfilled requirements.
   */
  serverRequirementsError: string | null = null;

  /**
   * Whether the model has finished async initialization.
   */
  initialized: boolean = false;

  /**
   * Whether a fresh build should be considered due to actions taken.
   */
  promptBuild: boolean = false;

  /**
   * Settings for connecting to the notebook server.
   */
  protected serverConnectionSettings: ServerConnection.ISettings;

  /**
   * A helper for performing searches of jupyterlab extensions on the NPM repository.
   */
  protected searcher = new Searcher();

  /**
   * The service manager to use for building.
   */
  protected serviceManager: ServiceManager;

  private _query: string | null = null;
  private _page: number = 0;
  private _pagination: number = 250;
  private _totalEntries: number = 0;

  private _installed: IEntry[];
  private _searchResult: IEntry[];
  private _pendingActions: Promise<any>[] = [];
}

/**
 * ListModel statics.
 */
export namespace ListModel {
  /**
   * Utility function to check whether an entry can be updated.
   *
   * @param entry The entry to check.
   */
  export function entryHasUpdate(entry: IEntry): boolean {
    if (!entry.installed || !entry.latest_version) {
      return false;
    }
    return semver.lt(entry.installed_version, entry.latest_version);
  }
}

/**
 * A namespace for private functionality.
 */
namespace Private {
  /**
   * A comparator function that sorts whitelisted orgs to the top.
   */
  export function comparator(a: IEntry, b: IEntry): number {
    if (a.name === b.name) {
      return 0;
    }

    let testA = isJupyterOrg(a.name);
    let testB = isJupyterOrg(b.name);

    if (testA === testB) {
      return a.name.localeCompare(b.name);
    } else if (testA && !testB) {
      return -1;
    } else {
      return 1;
    }
  }

  /**
   * Match kernel specs against kernel spec regexps
   *
   * @param kernelInfo The info containing the regexp patterns
   * @param specs The available kernel specs.
   */
  export function matchSpecs(
    kernelInfo: IKernelInstallInfo,
    specs: Kernel.ISpecModels | null
  ): Kernel.ISpecModel[] {
    if (!specs) {
      return [];
    }
    let matches: Kernel.ISpecModel[] = [];
    let reLang: RegExp | null = null;
    let reName: RegExp | null = null;
    if (kernelInfo.kernel_spec.language) {
      reLang = new RegExp(kernelInfo.kernel_spec.language);
    }
    if (kernelInfo.kernel_spec.display_name) {
      reName = new RegExp(kernelInfo.kernel_spec.display_name);
    }
    for (let key of Object.keys(specs.kernelspecs)) {
      let spec = specs.kernelspecs[key];
      let match = false;
      if (reLang) {
        match = reLang.test(spec.language);
      }
      if (!match && reName) {
        match = reName.test(spec.display_name);
      }
      if (match) {
        matches.push(spec);
        continue;
      }
    }
    return matches;
  }
}
