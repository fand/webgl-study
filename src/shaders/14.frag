#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

const float PI = 3.141592;

void main (void) {
    vec2 position = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    float r = length(position);
    float num = floor(r * 30.) + 1.;
    float angle = (atan(position.x, position.y) + PI) / (2. * PI);
    float s = sign(mod(num, 2.) - 0.9);
    angle = angle + s * time / 53. * pow(15. /(num +3.), 1.8);
    float rr = r + s * (angle * -20. * PI * num) * 0.01;
    float c = sin(rr * 100.);

    gl_FragColor = vec4(c, c, c, 1.0);
}
