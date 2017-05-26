#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

float rect(in vec2 pos, in vec2 begin, in vec2 end){
    return (
        smoothstep(begin.x - 0.001, begin.x, pos.x) *
        smoothstep(begin.y - 0.001, begin.y, pos.y) *
        smoothstep(end.x + 0.001, end.x, pos.x) *
        smoothstep(end.y + 0.001, end.y, pos.y)
    );
}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    float d = rect(position, vec2(0.1, 0.2), vec2(0.3, 0.4));

    gl_FragColor = vec4(vec3(d), 1.0);
}
