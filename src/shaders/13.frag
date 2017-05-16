#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

const float PI = 3.141592;

void main (void) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    position = position *2. - 1.;

    float angle = (atan(position.x, position.y) + PI) / (2. * PI);
    angle = angle - time * 3.;
    float c = sin(angle * 2. * PI + length(position) * 100.);
    gl_FragColor = vec4(c, c, c, 1.0);
}
