#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NUM 16.

void main(void) {
    vec2 p = (gl_FragCoord.xy *2.0 - resolution) / min(resolution.x, resolution.y);
    p *= NUM;
    p.y += time * 5.;

    // Generate random
    float i = floor(p.x + NUM) * floor(p.y) * NUM + floor(p.x) + floor(p.y);
    float r = sin(i * 123.456);

    // (s, d) = (1, 0) or (-1, 1)
    float s = step(0., r) * 2. - 1.;  // avoid r = 0
    float d = step(0., -r);

    float x = fract(p.x);
    float y = fract(s * fract(p.y) + d);
    float c = 1.0 - smoothstep(0.0, 0.1, abs(x - y));

    gl_FragColor = vec4(0., c, c, 1);
}
