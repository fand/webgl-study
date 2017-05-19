#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: rect = require(../utils/rect.frag)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    float d = rect(position, vec2(0.1, 0.2), vec2(0.3, 0.4));

    gl_FragColor = vec4(vec3(d), 1.0);
}
