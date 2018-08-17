// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { ServerConnection } from '@jupyterlab/services';

import { IEntry } from '@jupyterlab/extensionmanager/src/common';

/**
 * Wire format for installed extensions.
 */
export interface IInstalledEntry {
  /**
   * The name of the extension.
   */
  name: string;

  /**
   * A short description of the extension.
   */
  description: string;

  /**
   * A representative link of the package.
   */
  url: string;

  /**
   * Whether the extension is currently installed.
   */
  installed?: boolean;

  /**
   * Whether the extension is currently enabled.
   */
  enabled: boolean;

  /**
   * The latest version of the extension.
   */
  latest_version: string;

  /**
   * The installed version of the extension.
   */
  installed_version: string;

  /**
   * A flag indicating the status of an installed extension.
   */
  status: 'ok' | 'warning' | 'error' | 'deprecated' | null;
}

/**
 * An object representing a server reply to performing an action.
 */
export interface IActionReply {
  /**
   * The status category of the reply.
   */
  status: 'ok' | 'warning' | 'error' | null;

  /**
   * An optional message when the status is not 'ok'.
   */
  message?: string;
}

/**
 * The server API path for querying/modifying installed extensions.
 */
const EXTENSION_API_PATH = 'lab/api/extensions';

/**
 * Extension actions that the server API accepts
 */
export type Action = 'install' | 'uninstall' | 'enable' | 'disable';

/**
 * Make a request to the server for info about its installed extensions.
 *
 * @param refreshInstalled Whether to force a refresh of the installed extensions.
 * @param connectionSettings The connection settings to use for the request.
 */
export function fetchInstalled(
  refreshInstalled: boolean,
  connectionSettings: ServerConnection.ISettings
): Promise<IInstalledEntry[]> {
  const url = new URL(EXTENSION_API_PATH, connectionSettings.baseUrl);
  if (refreshInstalled) {
    url.searchParams.append('refresh', '1');
  }
  return ServerConnection.makeRequest(
    url.toString(),
    {},
    connectionSettings
  ).then(response => {
    handleError(response);
    return response.json() as Promise<IInstalledEntry[]>;
  });
}

/**
 * Send a request to the server to perform an action on an extension.
 *
 * @param action A valid action to perform.
 * @param entry The extension to perform the action on.
 * @param connectionSettings The connection settings to use for the request.
 */
export function performAction(
  action: string,
  entry: IEntry,
  connectionSettings: ServerConnection.ISettings
): Promise<IActionReply> {
  const url = new URL(EXTENSION_API_PATH, connectionSettings.baseUrl);
  let request: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      cmd: action,
      extension_name: entry.name
    })
  };
  return ServerConnection.makeRequest(
    url.toString(),
    request,
    connectionSettings
  ).then(response => {
    handleError(response);
    return response.json() as Promise<IActionReply>;
  });
}

/**
 * Convert a response to an exception on error.
 *
 * @param response The response to inspect.
 */
function handleError(response: Response): Response {
  if (!response.ok) {
    throw new Error(`${response.status} (${response.statusText})`);
  }
  return response;
}
