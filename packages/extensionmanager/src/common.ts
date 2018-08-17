// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

/**
 * Information about an extension.
 */
export interface IEntry {
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
  installed: boolean;

  /**
   * Whether the extension is currently enabled.
   */
  enabled: boolean;

  /**
   * A flag indicating the status of an installed extension.
   */
  status: 'ok' | 'warning' | 'error' | 'deprecated' | null;

  /**
   * The latest version of the extension.
   */
  latest_version: string;

  /**
   * The installed version of the extension.
   */
  installed_version: string;
}
