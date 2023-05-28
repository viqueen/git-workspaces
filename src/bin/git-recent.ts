#! /usr/bin/env node

/**
 * Copyright 2023 Hasnae Rehioui
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { listRecentBranches } from '../lib/list-recent-branches';
import { selectAndCheckoutBranch } from '../lib/select-and-checkout-branch';

listRecentBranches()
    .then(selectAndCheckoutBranch(/\d{4}-\d{2}-\d{2} (?<branchName>.*)/))
    .catch(console.error);
