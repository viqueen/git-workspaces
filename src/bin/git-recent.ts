#! /usr/bin/env node

import { selectAndCheckoutBranch } from '../lib/select-and-checkout-branch';
import { listRecentBranches } from '../lib/list-recent-branches';

listRecentBranches().then(
    selectAndCheckoutBranch(/\d{4}-\d{2}-\d{2} (?<branchName>.*)/)
);
