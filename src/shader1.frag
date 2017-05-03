#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 position = (gl_FragCoord.xy / resolution.xy);
    vec2 center = vec2(0.5, 0.5);
    vec2 d = position - center;
    float diff = sqrt(d.x * d.x + d.y * d.y);

    gl_FragColor = vec4(diff, diff, diff, 1.0);
}
