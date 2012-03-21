#!/bin/bash
scriptdir=`dirname $0`
cd `dirname $scriptdir`
root=`pwd`
# add some directories to lookup modules in
# not quite the same as config.paths, but good enough
export NODE_PATH="$root:$root/lib:$NODE_PATH"

echo `node_modules/vows/bin/vows ./test/* --spec`