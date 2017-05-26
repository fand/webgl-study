#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

vec2 rotate(in vec2 v, in float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

float smoothwave(in float x, in float n) {
    float c = cos(x);
    float s = sign(c);
    return (pow(c - sign(c), n) -1.) * sign(c);
}

#define NUM 128.
#define PI 3.14159265358979323846

float pattern (in float v, in float freq, in float width) {
    float t = 1.0 - width;
    return smoothstep(t - 0.001, t, 1. - abs(1. - fract(v * freq) * 2.));
}

float border (in vec2 p, in float width) {
    return step(0.5, mod(dot(p, vec2(1, -1)) * NUM, width));
}

float move (in float v, in float size) {
    return floor(v) * size;
}

void main(void){
    vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution.xy;
    p = rotate(p, time * PI / 8.) * 1.2;

    float t = time * 1.2;
    float z = 4. - 3. / (smoothwave(t, 4.) + 2.); // Zoom factor

    // Cell size
    float s = 1. / NUM;
    p = (floor(NUM * p) + 0.5) / NUM;

    vec3 gray = vec3(0.0, 0.3, 0.4);

    vec3 black = vec3(-(
        // Thread
        pattern(p.x, 1.5 / z, .5 / z) * border(p, 3.) -
        pattern(p.x, 1.5 / z, .3 / z) * border(p, 3.) * 3. +
        pattern(p.x, 1.5 / z, .1 / z) * border(p, 3.) * 3. +

        // Warp
        pattern(p.y, 1.5 / z, .5 / z) * (1. - border(p, 3.)) -
        pattern(p.y, 1.5 / z, .3 / z) * ((1. - border(p, 3.)) * 3.) +
        pattern(p.y, 1.5 / z, .1 / z) * ((1. - border(p, 3.)) * 3.)
    ));

    vec3 red = vec3(
        (1.0 - pattern(p.x, 1.5 / z, .95)) * border(p, 3.) +
        (1.0 - pattern(p.y, 1.5 / z, .95)) * (1. - border(p, 3.))
    , 0, 0) * 0.7;

    gl_FragColor = vec4(gray + black + red, 1.0);
}
