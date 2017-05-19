#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: line = require(../utils/line.frag)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main (void) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    float r = line(position, vec2(0.3, 0.4), vec2(0.7, 0.8));
    gl_FragColor = vec4(r, 0, 0, 1.0);
}
