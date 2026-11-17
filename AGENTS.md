

## Local Graphify context
For codebase questions, first query the existing local graph with `graphify query "specific symbols or topic" --budget 1500`. Read only relevant source files afterward. If the graph is stale, empty, or misses a symbol, use a targeted source search; the graph is not proof of correctness. Do not read the full graph JSON into model context.
After code changes, refresh with `graphify update . --no-cluster`. Keep extraction local and code-only; do not initiate semantic/media extraction or paid model calls just to maintain this index. Preserve existing user changes and project instructions.
