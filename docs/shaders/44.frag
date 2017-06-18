#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653589
#define NUM 8.

vec3 hsv2rgb (vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float random (in float x) {
    float s = fract(sin(x * 19.8 + 1803.));
    return fract(sin(x * 1949.8 + s));
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float dumb(in vec2 p) {
    float x = p.x + 2.21;
    float y = floor(p.y * NUM) / NUM;
    float r = (random(y) + 20.) * 20. + y * 10.;
    float speed = random(y) * 3.4 + 1.;

    float s = (x + (time + 10.) * .4 * speed);

    return 1. - step(.4,
        (
            sin(s * 40.) *
            sin(s * .1) *
            sin(s * 20.) +
            sin(s * .8)
        ) *
        random(vec2(s * .00001, y))
    );
}

void main( void ) {
    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    gl_FragColor = vec4(
        dumb(p - vec2(.01, .0)),
        dumb(p),
        dumb(p),
        1.
    );
}
