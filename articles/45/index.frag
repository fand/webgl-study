#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#pragma glslify: rotate = require('../utils/rotate2d')

#define PI 3.141592653589
#define NUM 8.

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    // vec2 u = f * f * (3. - 2. * f);
    vec2 u = smoothstep(0., 1., f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main (void) {
    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    p *= .8;
    p += .3;

    float l = length(p);
    float c = 0.;

    if (l < 3.) {
        vec2 p1 = rotate(p, PI * .25);
        p1.x *= .3;
        p1 = rotate(p1, PI * -.25);
        c = noise(p1 * 10. * l * l - time * 8.);
        c += .3 / l;

        vec2 pp = rotate(p, PI * .25);
        pp.x *= .7;
        pp.y *= .9;
        pp = rotate(pp, PI * -.25);

        c *= 1. - smoothstep(0.3, 0.5, length(pp * .8 - .2));
        c = step(.7, c);
    }

    gl_FragColor = vec4(vec3(1, 1, 0) * c, 1.);
}
