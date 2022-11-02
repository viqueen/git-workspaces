#! /usr/bin/env node

import { config } from '../config';

config().then(console.info);
