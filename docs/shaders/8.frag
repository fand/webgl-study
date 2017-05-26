#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

float plasma(in vec2 pos, in float xnum, in float ynum){
    return sin(6.28 * pos.x * xnum) + sin(6.28 * pos.y * ynum);
}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main (void) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    position = (position - 0.5);
    float t = time * 2.0;

    float r = plasma(position, sin(t + 0.1) * 4.3 + 14.0, cos(t - 0.1) * 4.0 + 15.0);
    float g = plasma(position, sin(t + 0.3) * 4.2 + 14.0, cos(t - 0.2) * 4.2 + 15.0);
    float b = plasma(position, sin(t + 0.5) * 4.1 + 14.0, cos(t - 0.3) * 4.4 + 15.0);

    gl_FragColor = vec4(r, g, b, 1.0);
}
