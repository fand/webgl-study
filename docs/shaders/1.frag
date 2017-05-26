#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 position = (gl_FragCoord.xy / resolution.xy);
    vec2 center = vec2(0.5, 0.5);
    float d = distance(position, center);

    gl_FragColor = vec4(vec3(smoothstep(d - 0.01, d, 0.4)), 1.0);
}
