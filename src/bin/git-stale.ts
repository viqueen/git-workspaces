#! /usr/bin/env node

import { listRecentBranches } from '../lib/list-recent-branches';
import { selectAndDeleteBranches } from '../lib/select-and-delete-branches';

const excludeOperationalBranches = async (branches: string[]) => {
    return branches.filter(
        (branch) =>
            !branch.match(
                /^\d{4}-\d{2}-\d{2} (main|master|production|demo|website|development)$/
            )
    );
};

listRecentBranches()
    .then(excludeOperationalBranches)
    .then(selectAndDeleteBranches(/\d{4}-\d{2}-\d{2} (?<branchName>.*)/));
