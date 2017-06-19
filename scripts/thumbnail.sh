#!/usr/bin/env bash
glsl2png docs/shaders/$1.frag -o docs/thumbnails/$1.png $@
glsl2gif docs/shaders/$1.frag -o docs/thumbnails/$1.gif $@
