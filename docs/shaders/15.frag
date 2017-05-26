#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

const float PI = 3.141592653;

vec2 rotate(in vec2 v, in float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

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
