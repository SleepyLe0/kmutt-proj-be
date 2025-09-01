#!/bin/sh

set -e

git pull
npm run deploy:dev

DONE="Success Run."
echo $DONE