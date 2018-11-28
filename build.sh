#!/usr/bin/env bash

set -u -e -o pipefail

readonly currentDir=$(cd $(dirname $0); pwd)
source ${currentDir}/scripts/ci/_travis-fold.sh

# TODO(i): wrap into subshell, so that we don't pollute CWD, but not yet to minimize diff collision with Jason
cd ${currentDir}

PACKAGES=(compiler
  core
  common
  animations
  platform-browser
  platform-browser-dynamic
  forms
  http
  platform-server
  platform-webworker
  platform-webworker-dynamic
  upgrade
  router
  compiler-cli
  language-service
  benchpress
  service-worker
  elements)
