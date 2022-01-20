#!/bin/bash

packages=( 
  "packages/core" 
  "packages/kit" 
  "packages/ui" 
  "packages/addons/dashboard" 
  "packages/addons/operations"
  )

for p in "${packages[@]}" ; do
  pushd $p
  echo "Publishing $p"
  yarn npm publish --access public
  popd
done
