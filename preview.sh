#!/usr/bin/env bash
# Serve the Jekyll site locally to preview changes before deploying.
set -euo pipefail
cd "$(dirname "$0")"

bundle check >/dev/null 2>&1 || bundle install

bundle exec jekyll serve --livereload
