#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

vec2 rotate(in vec2 v, in float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

float polkadot(in vec2 pos, in float xnum, in float ynum, in float threshold){
    return smoothstep(
        threshold, threshold + 0.0001,
        sin(6.28 * pos.x * xnum) + sin(6.28 * pos.y * ynum)
    );
}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main (void) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    position.x -= time * 0.2;

    // rotate 45 deg
    position = rotate(position, 3.141592 / 4.0);
    float r = polkadot(position, 8., 8., 0.0);

    position.x += time * 0.1;
    position.y += time * 0.1;
    float g = polkadot(position, 18., 18., 1.0) * 0.8;

    position = rotate(position, 3.141592 / 7.0);
    position *= 0.7;
    position.x -= time * 0.2;
    float b = polkadot(position, 18., 18., 1.0);

    gl_FragColor = vec4(r, g, b, 1.0);
}
