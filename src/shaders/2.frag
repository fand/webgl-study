#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: circle = require(./utils/circle.frag)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    vec2 center = vec2(0.5, 0.5);
    float d = circle(position, center, 0.6);

    gl_FragColor = vec4(vec3(d), 1.0);
}
