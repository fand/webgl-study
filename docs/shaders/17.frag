#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

#define NUM 160.
// https://thebookofshaders.com/10
float random2d(in vec2 pos){
    return fract(sin(dot(pos, vec2(12.9898,78.233)))* 43758.5453123);
}

float lifegame (in vec2 p, in float size) {
    float s = texture2D(backBuffer, p).g;
    float n = (
        texture2D(backBuffer, p + size * vec2(-1., -1.)).g +
        texture2D(backBuffer, p + size * vec2(+0., -1.)).g +
        texture2D(backBuffer, p + size * vec2(+1., -1.)).g +
        texture2D(backBuffer, p + size * vec2(-1., +0.)).g +
        texture2D(backBuffer, p + size * vec2(+1., +0.)).g +
        texture2D(backBuffer, p + size * vec2(-1., +1.)).g +
        texture2D(backBuffer, p + size * vec2(+0., +1.)).g +
        texture2D(backBuffer, p + size * vec2(+1., +1.)).g
    );

    // Birth
    if (s == 0. && n == 3.) {
        return 1.0;
    }

    // Alive
    if (s == 1. && (n == 2. || n == 3.)) {
        return 1.0;
    }

    // Death
    return 0.0;
}

void main(void) {
    vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y);

    // Divide canvas by NUM
    vec2 cellCenter = (floor(p * NUM) + 0.5) / NUM;

    // Initial state
    float r = random2d(floor(p * NUM));
    float state = step(0.6, r);

    vec4 prev = texture2D(backBuffer, p);
    float prevState = prev.g;

    // Use r value as a timer
    float timer = prev.b;

    if (time > .3) {
        if (timer < 0.001) {
            state = lifegame(cellCenter, 1. / NUM);
            timer = 0.1;
        }
        else {
            state = prevState;
            timer *= 0.3;
        }
    }

    gl_FragColor = vec4(0, state, timer, 1.);
}
