/* Default content for the prep tracker.
   Everything here is copied into your saved data on first run,
   so you can edit, add or delete any of it from inside the app. */
window.PREP_DATA = {
  settings: {
    name: 'Aditya',
    start: '2026-11-16',
    end: '2027-03-07',
    reviseDays: 3,
    restDay: 0, // 0 = Sunday
    theme: 'auto', // auto | light | dark
    style: 'mono', // mono (minimal, Vercel-like) | calm (soft, warm)
    accent: 'mono', // mono | sage | ocean | lavender | sand | rose | slate
    density: 'cozy', // cozy | compact
    targets: { dsa: 2, apps: 12, refs: 5, mcWeek: 2 },
    minimum: { dsa: 2, apps: 10 },
    hidden: []
  },

  timetable: [
    { s: '09:30', e: '11:30', t: 'DSA', d: 'New problems from the sheet. Hard stop at 11:30.', k: 'focus' },
    { s: '11:30', e: '11:45', t: 'Break', d: 'Walk, water. No phone scrolling.', k: 'break' },
    { s: '11:45', e: '13:15', t: 'Development', d: '{dev}', k: 'focus' },
    { s: '13:15', e: '14:00', t: 'Lunch', d: '', k: 'break' },
    { s: '14:00', e: '15:30', t: 'Project building', d: 'Flagship project milestones', k: 'focus' },
    { s: '15:30', e: '15:45', t: 'Break', d: '', k: 'break' },
    { s: '15:45', e: '16:45', t: 'Rotating slot', d: '{slot}', k: 'focus' },
    { s: '16:45', e: '17:30', t: 'Job hunt', d: 'Applications, referral messages, reply to recruiters', k: 'focus' }
  ],

  // index = day of week (0 Sun … 6 Sat). custom = show the note instead of the timetable.
  rotation: [
    { custom: true, dev: '', slot: '', note: 'Rest day. Optional: LeetCode weekly contest at 8:00 AM IST.' },
    { custom: false, dev: 'JavaScript in depth', slot: 'CS: DBMS + SQL', note: '' },
    { custom: false, dev: 'React', slot: 'Machine coding (90-min timed build)', note: '' },
    { custom: false, dev: 'Node.js / Express / auth', slot: 'CS: Networks (HTTP, DNS, CORS, cookies)', note: '' },
    { custom: false, dev: 'Next.js / TypeScript', slot: 'Machine coding (90-min timed build)', note: '' },
    { custom: false, dev: 'Databases (MongoDB, SQL)', slot: 'CS: OS + OOP basics', note: '' },
    { custom: true, dev: '', slot: '', note: '10:00–1:00 Mock interview + revise DSA mistakes · 2:00–4:00 Project · 30 min: plan next week and fill the weekly review.' }
  ],

  phases: [
    {
      name: 'Foundation', start: '2026-11-16', end: '2026-12-13',
      focus: 'Arrays, strings, hashing, two pointers, sliding window, binary search · polish existing projects · apply from day one',
      deadlines: [
        ['Naukri profile 100%, GitHub added, project descriptions written', '2026-11-22'],
        ['~45 DSA problems solved', '2026-12-13'],
        ['All projects live with READMEs', '2026-12-13']
      ]
    },
    {
      name: 'Build depth', start: '2026-12-14', end: '2027-01-10',
      focus: 'Linked list, stack/queue, recursion, trees, heaps · flagship project v2 · 2 machine-coding builds a week',
      deadlines: [
        ['Flagship v2 deployed', '2027-01-10'],
        ['~90 DSA problems solved', '2027-01-10'],
        ['8 machine-coding builds done', '2027-01-10']
      ]
    },
    {
      name: 'Interview mode', start: '2027-01-11', end: '2027-02-07',
      focus: 'Graphs, 1D DP, mixed revision · basic system design + LLD · 2 mock interviews a week · 15–20 applications a day',
      deadlines: [
        ['~130 DSA problems solved', '2027-02-07'],
        ['6+ mock interviews done', '2027-02-07']
      ]
    },
    {
      name: 'Convert', start: '2027-02-08', end: '2027-03-07',
      focus: '1h DSA revision only · company-specific prep · mocks · project stories · salary negotiation',
      deadlines: [
        ['Offer in hand', '2027-03-07']
      ]
    }
  ],

  // [title, leetcode-slug, difficulty E/M/H, core(1) ]  — NeetCode 150 grouped by pattern
  dsa: [
    { name: 'Arrays & Hashing', phase: 1, items: [
      ['Contains Duplicate', 'contains-duplicate', 'E', 1],
      ['Valid Anagram', 'valid-anagram', 'E', 1],
      ['Two Sum', 'two-sum', 'E', 1],
      ['Group Anagrams', 'group-anagrams', 'M', 1],
      ['Top K Frequent Elements', 'top-k-frequent-elements', 'M', 1],
      ['Encode and Decode Strings', 'encode-and-decode-strings', 'M', 1],
      ['Product of Array Except Self', 'product-of-array-except-self', 'M', 1],
      ['Valid Sudoku', 'valid-sudoku', 'M', 0],
      ['Longest Consecutive Sequence', 'longest-consecutive-sequence', 'M', 1],
      ['Maximum Number of Balloons', 'maximum-number-of-balloons', 'E', 0]
    ] },
    { name: 'Two Pointers', phase: 1, items: [
      ['Valid Palindrome', 'valid-palindrome', 'E', 1],
      ['Two Sum II – Input Array Is Sorted', 'two-sum-ii-input-array-is-sorted', 'M', 0],
      ['3Sum', '3sum', 'M', 1],
      ['Container With Most Water', 'container-with-most-water', 'M', 1],
      ['Trapping Rain Water', 'trapping-rain-water', 'H', 0]
    ] },
    { name: 'Sliding Window', phase: 1, items: [
      ['Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'E', 1],
      ['Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'M', 1],
      ['Longest Repeating Character Replacement', 'longest-repeating-character-replacement', 'M', 1],
      ['Permutation in String', 'permutation-in-string', 'M', 0],
      ['Minimum Window Substring', 'minimum-window-substring', 'H', 1],
      ['Sliding Window Maximum', 'sliding-window-maximum', 'H', 0]
    ] },
    { name: 'Binary Search', phase: 1, items: [
      ['Binary Search', 'binary-search', 'E', 0],
      ['Search a 2D Matrix', 'search-a-2d-matrix', 'M', 0],
      ['Koko Eating Bananas', 'koko-eating-bananas', 'M', 0],
      ['Find Minimum in Rotated Sorted Array', 'find-minimum-in-rotated-sorted-array', 'M', 1],
      ['Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'M', 1],
      ['Time Based Key-Value Store', 'time-based-key-value-store', 'M', 0],
      ['Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'H', 0]
    ] },
    { name: 'Stack', phase: 2, items: [
      ['Valid Parentheses', 'valid-parentheses', 'E', 1],
      ['Min Stack', 'min-stack', 'M', 0],
      ['Evaluate Reverse Polish Notation', 'evaluate-reverse-polish-notation', 'M', 0],
      ['Generate Parentheses', 'generate-parentheses', 'M', 0],
      ['Daily Temperatures', 'daily-temperatures', 'M', 0],
      ['Car Fleet', 'car-fleet', 'M', 0],
      ['Largest Rectangle in Histogram', 'largest-rectangle-in-histogram', 'H', 0]
    ] },
    { name: 'Linked List', phase: 2, items: [
      ['Reverse Linked List', 'reverse-linked-list', 'E', 1],
      ['Merge Two Sorted Lists', 'merge-two-sorted-lists', 'E', 1],
      ['Linked List Cycle', 'linked-list-cycle', 'E', 1],
      ['Reorder List', 'reorder-list', 'M', 1],
      ['Remove Nth Node From End of List', 'remove-nth-node-from-end-of-list', 'M', 1],
      ['Copy List with Random Pointer', 'copy-list-with-random-pointer', 'M', 0],
      ['Add Two Numbers', 'add-two-numbers', 'M', 0],
      ['Find the Duplicate Number', 'find-the-duplicate-number', 'M', 0],
      ['LRU Cache', 'lru-cache', 'M', 1],
      ['Merge k Sorted Lists', 'merge-k-sorted-lists', 'H', 1],
      ['Reverse Nodes in k-Group', 'reverse-nodes-in-k-group', 'H', 0]
    ] },
    { name: 'Trees', phase: 2, items: [
      ['Invert Binary Tree', 'invert-binary-tree', 'E', 1],
      ['Maximum Depth of Binary Tree', 'maximum-depth-of-binary-tree', 'E', 1],
      ['Diameter of Binary Tree', 'diameter-of-binary-tree', 'E', 0],
      ['Balanced Binary Tree', 'balanced-binary-tree', 'E', 0],
      ['Same Tree', 'same-tree', 'E', 1],
      ['Subtree of Another Tree', 'subtree-of-another-tree', 'E', 1],
      ['Lowest Common Ancestor of a BST', 'lowest-common-ancestor-of-a-binary-search-tree', 'M', 1],
      ['Binary Tree Level Order Traversal', 'binary-tree-level-order-traversal', 'M', 1],
      ['Binary Tree Right Side View', 'binary-tree-right-side-view', 'M', 0],
      ['Count Good Nodes in Binary Tree', 'count-good-nodes-in-binary-tree', 'M', 0],
      ['Validate Binary Search Tree', 'validate-binary-search-tree', 'M', 1],
      ['Kth Smallest Element in a BST', 'kth-smallest-element-in-a-bst', 'M', 1],
      ['Construct Binary Tree from Preorder and Inorder', 'construct-binary-tree-from-preorder-and-inorder-traversal', 'M', 1],
      ['Binary Tree Maximum Path Sum', 'binary-tree-maximum-path-sum', 'H', 1],
      ['Serialize and Deserialize Binary Tree', 'serialize-and-deserialize-binary-tree', 'H', 1]
    ] },
    { name: 'Heap / Priority Queue', phase: 2, items: [
      ['Kth Largest Element in a Stream', 'kth-largest-element-in-a-stream', 'E', 0],
      ['Last Stone Weight', 'last-stone-weight', 'E', 0],
      ['K Closest Points to Origin', 'k-closest-points-to-origin', 'M', 0],
      ['Kth Largest Element in an Array', 'kth-largest-element-in-an-array', 'M', 0],
      ['Task Scheduler', 'task-scheduler', 'M', 0],
      ['Design Twitter', 'design-twitter', 'M', 0],
      ['Find Median from Data Stream', 'find-median-from-data-stream', 'H', 1]
    ] },
    { name: 'Backtracking', phase: 2, items: [
      ['Subsets', 'subsets', 'M', 0],
      ['Combination Sum', 'combination-sum', 'M', 1],
      ['Permutations', 'permutations', 'M', 0],
      ['Subsets II', 'subsets-ii', 'M', 0],
      ['Combination Sum II', 'combination-sum-ii', 'M', 0],
      ['Word Search', 'word-search', 'M', 1],
      ['Palindrome Partitioning', 'palindrome-partitioning', 'M', 0],
      ['Letter Combinations of a Phone Number', 'letter-combinations-of-a-phone-number', 'M', 0],
      ['N-Queens', 'n-queens', 'H', 0]
    ] },
    { name: 'Tries', phase: 3, items: [
      ['Implement Trie (Prefix Tree)', 'implement-trie-prefix-tree', 'M', 1],
      ['Design Add and Search Words Data Structure', 'design-add-and-search-words-data-structure', 'M', 1],
      ['Word Search II', 'word-search-ii', 'H', 1]
    ] },
    { name: 'Graphs', phase: 3, items: [
      ['Number of Islands', 'number-of-islands', 'M', 1],
      ['Max Area of Island', 'max-area-of-island', 'M', 0],
      ['Clone Graph', 'clone-graph', 'M', 1],
      ['Walls and Gates', 'walls-and-gates', 'M', 0],
      ['Rotting Oranges', 'rotting-oranges', 'M', 0],
      ['Pacific Atlantic Water Flow', 'pacific-atlantic-water-flow', 'M', 1],
      ['Surrounded Regions', 'surrounded-regions', 'M', 0],
      ['Course Schedule', 'course-schedule', 'M', 1],
      ['Course Schedule II', 'course-schedule-ii', 'M', 0],
      ['Graph Valid Tree', 'graph-valid-tree', 'M', 1],
      ['Number of Connected Components in an Undirected Graph', 'number-of-connected-components-in-an-undirected-graph', 'M', 1],
      ['Redundant Connection', 'redundant-connection', 'M', 0],
      ['Word Ladder', 'word-ladder', 'H', 0]
    ] },
    { name: 'Advanced Graphs', phase: 3, items: [
      ['Network Delay Time', 'network-delay-time', 'M', 0],
      ['Min Cost to Connect All Points', 'min-cost-to-connect-all-points', 'M', 0],
      ['Cheapest Flights Within K Stops', 'cheapest-flights-within-k-stops', 'M', 0],
      ['Reconstruct Itinerary', 'reconstruct-itinerary', 'H', 0],
      ['Swim in Rising Water', 'swim-in-rising-water', 'H', 0],
      ['Alien Dictionary', 'alien-dictionary', 'H', 1]
    ] },
    { name: '1-D Dynamic Programming', phase: 3, items: [
      ['Climbing Stairs', 'climbing-stairs', 'E', 1],
      ['Min Cost Climbing Stairs', 'min-cost-climbing-stairs', 'E', 0],
      ['House Robber', 'house-robber', 'M', 1],
      ['House Robber II', 'house-robber-ii', 'M', 1],
      ['Longest Palindromic Substring', 'longest-palindromic-substring', 'M', 1],
      ['Palindromic Substrings', 'palindromic-substrings', 'M', 1],
      ['Decode Ways', 'decode-ways', 'M', 1],
      ['Coin Change', 'coin-change', 'M', 1],
      ['Maximum Product Subarray', 'maximum-product-subarray', 'M', 1],
      ['Word Break', 'word-break', 'M', 1],
      ['Longest Increasing Subsequence', 'longest-increasing-subsequence', 'M', 1],
      ['Partition Equal Subset Sum', 'partition-equal-subset-sum', 'M', 0]
    ] },
    { name: '2-D Dynamic Programming', phase: 3, items: [
      ['Unique Paths', 'unique-paths', 'M', 1],
      ['Longest Common Subsequence', 'longest-common-subsequence', 'M', 1],
      ['Best Time to Buy and Sell Stock with Cooldown', 'best-time-to-buy-and-sell-stock-with-cooldown', 'M', 0],
      ['Coin Change II', 'coin-change-ii', 'M', 0],
      ['Target Sum', 'target-sum', 'M', 0],
      ['Interleaving String', 'interleaving-string', 'M', 0],
      ['Edit Distance', 'edit-distance', 'M', 0],
      ['Longest Increasing Path in a Matrix', 'longest-increasing-path-in-a-matrix', 'H', 0],
      ['Distinct Subsequences', 'distinct-subsequences', 'H', 0],
      ['Burst Balloons', 'burst-balloons', 'H', 0],
      ['Regular Expression Matching', 'regular-expression-matching', 'H', 0]
    ] },
    { name: 'Greedy', phase: 3, items: [
      ['Maximum Subarray', 'maximum-subarray', 'M', 1],
      ['Jump Game', 'jump-game', 'M', 1],
      ['Jump Game II', 'jump-game-ii', 'M', 0],
      ['Gas Station', 'gas-station', 'M', 0],
      ['Hand of Straights', 'hand-of-straights', 'M', 0],
      ['Merge Triplets to Form Target Triplet', 'merge-triplets-to-form-target-triplet', 'M', 0],
      ['Partition Labels', 'partition-labels', 'M', 0],
      ['Valid Parenthesis String', 'valid-parenthesis-string', 'M', 0]
    ] },
    { name: 'Intervals', phase: 3, items: [
      ['Insert Interval', 'insert-interval', 'M', 1],
      ['Merge Intervals', 'merge-intervals', 'M', 1],
      ['Non-overlapping Intervals', 'non-overlapping-intervals', 'M', 1],
      ['Meeting Rooms', 'meeting-rooms', 'E', 1],
      ['Meeting Rooms II', 'meeting-rooms-ii', 'M', 1],
      ['Minimum Interval to Include Each Query', 'minimum-interval-to-include-each-query', 'H', 0]
    ] },
    { name: 'Math & Geometry', phase: 4, items: [
      ['Rotate Image', 'rotate-image', 'M', 1],
      ['Spiral Matrix', 'spiral-matrix', 'M', 1],
      ['Set Matrix Zeroes', 'set-matrix-zeroes', 'M', 1],
      ['Happy Number', 'happy-number', 'E', 0],
      ['Plus One', 'plus-one', 'E', 0],
      ['Pow(x, n)', 'powx-n', 'M', 0],
      ['Multiply Strings', 'multiply-strings', 'M', 0],
      ['Detect Squares', 'detect-squares', 'M', 0]
    ] },
    { name: 'Bit Manipulation', phase: 4, items: [
      ['Single Number', 'single-number', 'E', 0],
      ['Number of 1 Bits', 'number-of-1-bits', 'E', 1],
      ['Counting Bits', 'counting-bits', 'E', 1],
      ['Reverse Bits', 'reverse-bits', 'E', 1],
      ['Missing Number', 'missing-number', 'E', 1],
      ['Sum of Two Integers', 'sum-of-two-integers', 'M', 1],
      ['Reverse Integer', 'reverse-integer', 'M', 0]
    ] }
  ],

  // [title, link]  kind: js | mc | other
  fe: [
    { name: 'JavaScript coding (polyfills & utilities)', kind: 'js', link: '', items: [
      ['debounce()'], ['throttle()'], ['Promise.all()'], ['Promise.allSettled()'], ['Promise.race() and Promise.any()'],
      ['Function.prototype.bind()'], ['Function.prototype.call() and apply()'], ['Array.prototype.map / filter / reduce'],
      ['Array.prototype.flat()'], ['deepClone()'], ['deepEqual() / isEqual'], ['curry()'], ['memoize()'],
      ['compose() and pipe()'], ['once()'], ['EventEmitter (on / off / emit / once)'],
      ['Async task queue with concurrency limit', 'https://bigfrontend.dev/problem/async-task-queue'],
      ['retry() with exponential backoff'], ['promisify()'], ['sleep() and a timeout wrapper'],
      ['_.get() – safe nested path access'], ['classNames()'], ['getElementsByClassName / DOM tree traversal'],
      ['LRU cache using Map'], ['setInterval using setTimeout'], ['JSON.stringify (basic version)']
    ] },
    { name: 'Machine coding (90-min React builds)', kind: 'mc', link: '', items: [
      ['Todo app with filters'], ['Tabs'], ['Accordion'], ['Modal with focus trap'], ['Star rating'], ['OTP input'],
      ['Progress bar'], ['Pagination'], ['Autocomplete with debounce'], ['Infinite scroll'], ['Image carousel'],
      ['Form with validation'], ['Sortable & filterable data table'], ['Nested comments'], ['File explorer (tree)'],
      ['Kanban board with drag & drop'], ['Tic-tac-toe'], ['Typeahead with result caching'], ['Stopwatch / countdown timer'],
      ['Toast notifications']
    ] },
    { name: 'Take-home style projects (optional)', kind: 'other', link: 'https://www.techprep.app/projects/take-home-projects', items: [
      ['Pick one take-home brief and finish it in a weekend'], ['Write a README explaining trade-offs']
    ] }
  ],

  topics: [
    { name: 'JavaScript', items: ['Closures & scope', 'Hoisting & temporal dead zone', 'this, call / apply / bind', 'Prototypes & inheritance', 'Event loop: microtasks vs macrotasks', 'Promises & async/await', 'Debounce & throttle', 'Shallow vs deep copy', 'ES6+: destructuring, spread, modules', 'Event bubbling & delegation'] },
    { name: 'React', items: ['useState / useEffect pitfalls', 'useMemo, useCallback, React.memo', 'Reconciliation & keys', 'Custom hooks', 'Context vs Redux / Zustand', 'Controlled vs uncontrolled forms', 'Error boundaries & Suspense', 'Performance: lazy loading, code splitting'] },
    { name: 'Next.js', items: ['SSR vs SSG vs ISR vs CSR', 'Server vs Client Components', 'App Router, layouts, route handlers', 'Data fetching & caching', 'Middleware & auth'] },
    { name: 'Node.js & APIs', items: ['Node event loop & libuv', 'Express middleware & error handling', 'REST design & status codes', 'JWT vs sessions, cookies', 'Security: CORS, XSS, CSRF, injection, rate limiting', 'File uploads & streams', 'Caching with Redis'] },
    { name: 'Databases', items: ['SQL joins & GROUP BY', 'Normalization', 'Indexes (SQL & MongoDB)', 'Transactions & ACID', 'MongoDB aggregation pipeline', 'SQL vs NoSQL trade-offs'] },
    { name: 'CS fundamentals', items: ['What happens when you type a URL', 'HTTP/1.1 vs HTTP/2, HTTPS & TLS', 'TCP vs UDP', 'DNS', 'Process vs thread', 'Deadlock & concurrency basics', 'OOP: 4 pillars', 'SOLID basics'] },
    { name: 'HTML & CSS', items: ['Box model', 'Flexbox', 'Grid', 'Specificity & cascade', 'Responsive design & media queries', 'Accessibility: semantic HTML, ARIA'] },
    { name: 'System design (fresher level)', items: ['Scaling: vertical vs horizontal, load balancer', 'Caching & CDN', 'Replication & sharding basics', 'Design a URL shortener', 'Design a chat app', 'Design a rate limiter', 'LLD: parking lot / library system'] },
    { name: 'Projects & HR', items: ['2-minute pitch for each project', 'Hardest bug story', 'Tell me about yourself', 'Why this company', 'Why IGNOU / correspondence – confident answer', 'Strengths & weaknesses', 'Salary expectation answer'] }
  ],

  // [milestone, due date]
  projects: [
    { name: 'Naukri profile fixes', ms: [
      ['Fix headline (remove broken character, add location + availability)', '2026-11-16'],
      ['Clean up key skills (Next.js, JavaScript, REST APIs, TypeScript…)', '2026-11-16'],
      ['Add preferred salary, set notice period', '2026-11-16'],
      ['Fill IT skills section', '2026-11-18'],
      ['Write project descriptions + fix SkillRoom date mismatch', '2026-11-20'],
      ['Add GitHub, portfolio and live links under Work sample', '2026-11-22'],
      ['Add certifications and Hindi', '2026-11-22']
    ] },
    { name: 'Polish existing projects', ms: [
      ['Deploy every project (live URL works)', '2026-12-06'],
      ['README with screenshots + architecture for each', '2026-12-10'],
      ['Pin best repos on GitHub profile', '2026-12-13']
    ] },
    { name: 'Flagship v2 (Payroll or AI Hiring)', ms: [
      ['Pick the flagship project', '2026-12-15'],
      ['Auth + roles', '2026-12-20'],
      ['Input validation + error handling', '2026-12-24'],
      ['Redis caching + pagination', '2026-12-29'],
      ['Tests for key APIs', '2027-01-02'],
      ['CI with GitHub Actions', '2027-01-05'],
      ['Docker setup', '2027-01-07'],
      ['Deploy v2 + README with architecture diagram', '2027-01-10']
    ] }
  ],

  /* Where each group's links point. {t} = item title, {g} = group name.
     yt   = YouTube search query  → Video button
     site = sites for a Google "site:" search → Learn button (when no exact doc link) / Practice for coding groups */
  groupMeta: {
    'JavaScript': { site: 'javascript.info OR site:developer.mozilla.org', yt: '{t} javascript interview' },
    'React': { site: 'react.dev', yt: 'react {t} explained' },
    'Next.js': { site: 'nextjs.org/docs', yt: 'next.js {t} explained' },
    'Node.js & APIs': { site: 'nodejs.org OR site:expressjs.com OR site:developer.mozilla.org', yt: 'node.js {t} interview' },
    'Databases': { site: 'mongodb.com/docs OR site:postgresql.org/docs', yt: '{t} database interview' },
    'CS fundamentals': { site: 'developer.mozilla.org OR site:geeksforgeeks.org', yt: '{t} explained' },
    'HTML & CSS': { site: 'developer.mozilla.org OR site:css-tricks.com', yt: 'css {t} explained' },
    'System design (fresher level)': { site: 'github.com/donnemartin/system-design-primer OR site:bytebytego.com', yt: '{t} system design for beginners' },
    'Projects & HR': { site: '', yt: '{t} interview answer for freshers' },
    'JavaScript coding (polyfills & utilities)': { site: 'bigfrontend.dev OR site:greatfrontend.com', yt: '{t} javascript polyfill interview' },
    'Machine coding (90-min React builds)': { site: 'greatfrontend.com', yt: '{t} react machine coding round' },
    'Take-home style projects (optional)': { site: 'techprep.app', yt: 'frontend take home assignment tips' }
  },
  // Defaults when a group has no entry above.
  listMeta: {
    dsa: { site: 'neetcode.io OR site:leetcode.com', yt: 'neetcode {t}' },
    fe: { site: 'bigfrontend.dev OR site:greatfrontend.com', yt: '{t} javascript interview' },
    topics: { site: 'developer.mozilla.org', yt: '{t} explained' }
  },

  // Exact "Learn" links for items (by title). Anything missing falls back to a site: search.
  docs: {
    'debounce()': 'https://javascript.info/call-apply-decorators',
    'throttle()': 'https://javascript.info/call-apply-decorators',
    'Promise.all()': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all',
    'Promise.allSettled()': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled',
    'Promise.race() and Promise.any()': 'https://javascript.info/promise-api',
    'Function.prototype.bind()': 'https://javascript.info/bind',
    'Function.prototype.call() and apply()': 'https://javascript.info/call-apply-decorators',
    'Array.prototype.map / filter / reduce': 'https://javascript.info/array-methods',
    'Array.prototype.flat()': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat',
    'deepClone()': 'https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone',
    'curry()': 'https://javascript.info/currying-partials',
    'memoize()': 'https://javascript.info/call-apply-decorators',
    'EventEmitter (on / off / emit / once)': 'https://nodejs.org/api/events.html',
    'promisify()': 'https://javascript.info/promisify',
    'sleep() and a timeout wrapper': 'https://javascript.info/settimeout-setinterval',
    '_.get() – safe nested path access': 'https://lodash.com/docs/#get',
    'classNames()': 'https://github.com/JedWatson/classnames',
    'getElementsByClassName / DOM tree traversal': 'https://javascript.info/dom-navigation',
    'LRU cache using Map': 'https://javascript.info/map-set',
    'setInterval using setTimeout': 'https://javascript.info/settimeout-setinterval',
    'JSON.stringify (basic version)': 'https://javascript.info/json',

    'Closures & scope': 'https://javascript.info/closure',
    'Hoisting & temporal dead zone': 'https://javascript.info/var',
    'this, call / apply / bind': 'https://javascript.info/object-methods',
    'Prototypes & inheritance': 'https://javascript.info/prototype-inheritance',
    'Event loop: microtasks vs macrotasks': 'https://javascript.info/event-loop',
    'Promises & async/await': 'https://javascript.info/async',
    'Debounce & throttle': 'https://javascript.info/call-apply-decorators',
    'Shallow vs deep copy': 'https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy',
    'ES6+: destructuring, spread, modules': 'https://javascript.info/destructuring-assignment',
    'Event bubbling & delegation': 'https://javascript.info/event-delegation',

    'useState / useEffect pitfalls': 'https://react.dev/learn/you-might-not-need-an-effect',
    'useMemo, useCallback, React.memo': 'https://react.dev/reference/react/useMemo',
    'Reconciliation & keys': 'https://react.dev/learn/preserving-and-resetting-state',
    'Custom hooks': 'https://react.dev/learn/reusing-logic-with-custom-hooks',
    'Context vs Redux / Zustand': 'https://react.dev/learn/passing-data-deeply-with-context',
    'Controlled vs uncontrolled forms': 'https://react.dev/reference/react-dom/components/input',
    'Error boundaries & Suspense': 'https://react.dev/reference/react/Suspense',
    'Performance: lazy loading, code splitting': 'https://react.dev/reference/react/lazy',

    'Express middleware & error handling': 'https://expressjs.com/en/guide/error-handling.html',
    'REST design & status codes': 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
    'JWT vs sessions, cookies': 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies',
    'Security: CORS, XSS, CSRF, injection, rate limiting': 'https://owasp.org/www-project-top-ten/',

    'SQL joins & GROUP BY': 'https://www.w3schools.com/sql/sql_join.asp',
    'Indexes (SQL & MongoDB)': 'https://www.mongodb.com/docs/manual/indexes/',
    'MongoDB aggregation pipeline': 'https://www.mongodb.com/docs/manual/aggregation/',

    'What happens when you type a URL': 'https://github.com/alex/what-happens-when',

    'Box model': 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model',
    'Flexbox': 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
    'Grid': 'https://css-tricks.com/snippets/css/complete-guide-grid/',
    'Specificity & cascade': 'https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity',
    'Accessibility: semantic HTML, ARIA': 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA',

    'Scaling: vertical vs horizontal, load balancer': 'https://github.com/donnemartin/system-design-primer',
    'Caching & CDN': 'https://github.com/donnemartin/system-design-primer',
    'Replication & sharding basics': 'https://github.com/donnemartin/system-design-primer'
  },

  // [title, url]
  resources: [
    { name: 'DSA sheets & patterns', items: [
      ['NeetCode 150', 'https://neetcode.io/practice'],
      ['20 essential DSA patterns – hynts', 'https://hynts.in/preparation/20-essential-dsa-patterns/'],
      ['DSA patterns sheet – thita', 'https://thita.ai/dsa-patterns-sheet'],
      ['AlgoMaster DSA course', 'https://algomaster.io/learn/dsa/course-introduction'],
      ['Peralta 75', 'https://jamesperalta.com/peralta75'],
      ['DSA Yatra', 'https://dsayatra.theboringeducation.com/'],
      ['RisingBrain sheet', 'https://risingbrain.org/sheet'],
      ['CodeHelp', 'https://codehelp.in/'],
      ['DSA Animator (visualise)', 'https://dsaanimator.com/#arrays'],
      ['Company-wise problems (GitHub)', 'https://github.com/liquidslr/interview-company-wise-problems'],
      ['GrindMap', 'https://grindmap.xevrion.dev/']
    ] },
    { name: 'Frontend & JavaScript', items: [
      ['BigFrontEnd – problems', 'https://bigfrontend.dev/'],
      ['BFE – async task queue', 'https://bigfrontend.dev/problem/async-task-queue'],
      ['GreatFrontEnd – 3-month plan', 'https://www.greatfrontend.com/interviews/study-plans/three-months'],
      ['HelloFrontend', 'https://hellofrontend.com/signup']
    ] },
    { name: 'Interviews, questions & projects', items: [
      ['Hello Interview – AI coding practice', 'https://www.hellointerview.com/practice/ai-coding'],
      ['PracHub – interview questions', 'https://prachub.com/questions'],
      ['TechPrep – take-home projects', 'https://www.techprep.app/projects/take-home-projects'],
      ['Astra – position resources', 'https://useastra.in/position-resources'],
      ['Internia', 'https://internia.io/'],
      ['Euron', 'https://euron.one/']
    ] },
    { name: 'Job boards', items: [
      ['Naukri – recommended jobs', 'https://www.naukri.com/mnjuser/recommendedjobs'],
      ['LinkedIn Jobs', 'https://www.linkedin.com/jobs/'],
      ['Wellfound (startups)', 'https://wellfound.com/jobs'],
      ['Cutshort', 'https://cutshort.io/jobs'],
      ['Instahyre', 'https://www.instahyre.com/'],
      ['Internshala – fresher jobs', 'https://internshala.com/fresher-jobs/']
    ] }
  ]
};
