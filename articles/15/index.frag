#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

const float PI = 3.141592653;

#pragma glslify: rotate = require(../utils/rotate2d.frag)

float sunflower (vec2 p) {
    float r = length(p) - time * 0.2;
    float ring = sin(r * 200.);
    float angle = atan(p.x, p.y) + PI + time * 0.2;
    float flash = pow(sin(angle * 20. + r * 20. * PI), 10.);
    return ring * flash;
}

void main (void) {
    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);

    float d = pow(sin(time), 5.);
    float r = sunflower(rotate(p, +d * PI));
    float g = sunflower(rotate(p, -d * PI));
    float b = sunflower(rotate(p, +0.00));

    gl_FragColor = vec4(r, g, b, 1.);
}
