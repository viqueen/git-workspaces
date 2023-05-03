#! /usr/bin/env node

import { listRecentBranches } from '../lib/list-recent-branches';
import { selectAndCheckoutBranch } from '../lib/select-and-checkout-branch';

listRecentBranches()
    .then(selectAndCheckoutBranch(/\d{4}-\d{2}-\d{2} (?<branchName>.*)/))
    .catch(console.error);
