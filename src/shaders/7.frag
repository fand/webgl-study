#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

#pragma glslify: line = require(./utils/line.frag)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main (void) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    float t = time * time;

    vec2 center = vec2(0.5);
    vec2 to = center + vec2(cos(t), sin(fract(t) * t)) * 0.1;

    float r = 0.0;
    for (int i = 1; i <= 30; i++) {
        float ii = float(i);
        vec2 from = center + vec2(cos(t * mod(ii, 12.9)), sin(t * ii + 13.8)) * 0.7;
        r += line(position, from, to);
    }

    t *= t;
    float g = 0.0;
    for (int i = 1; i <= 30; i++) {
        float ii = float(i);
        vec2 from = center + vec2(cos(t * mod(ii, 88.9)), sin(t * ii + 2.8)) * 0.7;
        g += line(position, from, to);
    }

    float b = 0.0;
    for (int i = 1; i <= 30; i++) {
        float ii = float(i);
        vec2 from = center + vec2(cos(t * mod(ii, 9.9)), sin(t * ii + 9.8)) * 0.7;
        b += line(position, from, to);
    }

    gl_FragColor = vec4(r, g, b, 1.0);
}
