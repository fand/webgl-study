#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

// from https://thebookofshaders.com/05/
float plot(in vec2 pos, in float y){
    return (
        smoothstep(y - 0.01, y, pos.y) -
        smoothstep(y, y + 0.01, pos.y)
    );
}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main (void) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    float r = plot(position, pow(position.x, 3.0));
    gl_FragColor = vec4(r, 0, 0, 1.0);
}
