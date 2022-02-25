#!/bin/bash

packages=( 
  "packages/core" 
  "packages/kit"
  "packages/cli"
  "packages/console"
  "packages/nuxt"
  )

if [ -z "$1" ]
then
  for p in "${packages[@]}" ; do
    pushd $p
    echo "Publishing $p"
    yarn npm publish --access public
    popd
  done
else
  pushd $1
  echo "Publishing $1"
  yarn npm publish --access public
  popd
fi