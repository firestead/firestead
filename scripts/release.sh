#!/bin/bash

# Release packages
for p in packages/* ; do
  pushd $p
  echo "Publishing $p"
  yarn npm publish --access public
  popd
done

