#!/usr/bin/env bash
$(npm bin)/glsl2png docs/shaders/$1.frag -o docs/thumbnails/$1.frag.png $@
