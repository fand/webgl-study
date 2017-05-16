#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: plot = require(./utils/plot.frag)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main (void) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    float r = plot(position, pow(position.x, 3.0));
    gl_FragColor = vec4(r, 0, 0, 1.0);
}
