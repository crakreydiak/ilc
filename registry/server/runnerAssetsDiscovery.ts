import path from "path";

process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../config');
require('newrelic'); //Should be lower then NODE_CONFIG_DIR env var definition

const tmpInterval = Number(process.env.INTERVAL);
const interval = Number.isNaN(tmpInterval) ? undefined : tmpInterval;

import AssetsDiscovery from './common/services/AssetsDiscovery';
new AssetsDiscovery('apps').start(interval);
new AssetsDiscovery('shared_libs').start(interval);
