#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define r3 1.7320508

void main (void) {
    vec2 p = (gl_FragCoord.xy) / min(resolution.x, resolution.y);
    p = mat2(1., 0, -r3 / 3., 1. /(0.5 * r3)) * p;
    float u = 2. / r3;
    p /= u * (1. -cos(fract(time * 0.8) * 3.141592) * 0.5 + 0.5);

    float c = 1.;
    float z = 1.;
    for (int i = 0; i < 9; i++) {
        p = mod(p, z);
        c *= (1. - step(z, p.x +p.y));
        z *= 0.5;
    }

    c *= step(0., p.x);

    gl_FragColor = vec4(c, c, c, 1.0);
}
