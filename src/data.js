//export * from './data/testData.js';
import { raw_data as imported_raw_data, defaults as version_defaults } from './data/spaceAge2.0.11.js';
import { defaults as shared_defaults } from './data/defaults.js';
import { ParsedData } from './parsedData.js';

export const raw_data = imported_raw_data;
export const defaults = {...version_defaults, ...shared_defaults};
export const parsed_data = new ParsedData(imported_raw_data);
