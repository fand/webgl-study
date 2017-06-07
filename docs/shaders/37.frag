#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define GLSLIFY 1

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dia(in vec2 p) {
    float a = atan(p.y, p.x);
    float s = floor((abs(p.x) + abs(p.y)) * 100.);
    s *= sin(s * 23.4035);
    float s2 = fract(sin(s));

    float c = step(.9, sin(a + s + s2 * time * 2.82) * .5 + .5);

    c *= s2 * .7 + .3;
    return c;
}

void main( void ) {
    vec2 p = (gl_FragCoord.xy / resolution.xy) - .5;
    p.x *= resolution.x / resolution.y;

    float s = sin(time * 10.) * cos(time * 120. + 32.);
    float ss = s > .1 ? s * sin(floor(p.y * 32.) / 32.) * .4 - .2 : 0.;
    ss *= .2;

    gl_FragColor = vec4(
        dia(vec2(p.x + ss * floor(p.y * 16.) / 16.,  p.y)),
        dia(p + .002),
        dia(p),
        1.0
    );

}
