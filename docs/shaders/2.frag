#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

// from https://thebookofshaders.com/07/
float circle(in vec2 pos, in vec2 center, in float radius){
    vec2 dist = pos - center;
    return 1.0 - smoothstep(
        radius - (radius * 0.03),
        radius + (radius * 0.03),
        dot(dist, dist) * 4.0
    );
}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    vec2 center = vec2(0.5, 0.5);
    float d = circle(position, center, 0.6);

    gl_FragColor = vec4(vec3(d), 1.0);
}
