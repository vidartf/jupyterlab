import * as path from 'path';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';

const DEFAULT_CONFIG_PATH = path.join(__dirname, '../../api-extractor.json');

export function createApiReport(
  projectPath: string,
  configPath = DEFAULT_CONFIG_PATH
): string[] {
  // Load and parse the api-extractor.json file
  const configObject = ExtractorConfig.loadFile(configPath);
  configObject.projectFolder = projectPath;
  const extractorConfig = ExtractorConfig.prepare({
    configObject,
    configObjectFullPath: configPath,
    packageJson: undefined,
    packageJsonFullPath: path.join(projectPath, 'package.json')
  });

  const messages: string[] = [];

  // Invoke API Extractor
  Extractor.invoke(extractorConfig, {
    // Equivalent to the "--local" command-line parameter
    localBuild: true,

    messageCallback: message => {
      messages.push(message.formatMessageWithoutLocation());
    }
  });

  return messages;
}
