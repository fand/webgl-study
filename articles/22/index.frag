#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

#pragma glslify: rotate2D = require(../utils/rotate2d.frag)
#define PI 3.141592
#define POWER 0.001
#define NUM 100
#define SPEED 0.8

float point(in vec2 p, in vec2 q) {
    return POWER / length(p - q);
}

float react(in vec2 _p, in float size) {
    float c = 0.;
    vec2 p = _p / size;
    for (int i = 0; i < NUM; i++) {
        float a = time + float(i);
        c += point(p, vec2(cos(a), sin(a) * 0.3));

        p = rotate2D(p, PI / 3.);
        c += point(p, vec2(cos(a), sin(a) * 0.3));

        p = rotate2D(p, PI / 3.);
        c += point(p, vec2(cos(a), sin(a) * 0.3));
    }
    c += POWER / length(p) * 35.;
    return c;
}

float redux(vec2 p, in float size) {
    float c = 0.;
    float u = (0.6 * PI / float(NUM));
    float t = time * SPEED;

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < NUM; j++) {
            float tt = 1. - pow(1.0 - (fract(t) - float(j) / float(NUM) * 10.), 2.5) * 0.27;
            float a = -(tt * u + (2. * PI / 3. * float(i)) + 0.05);
            float x = cos(a) - 1.5 * cos(2. * a);
            float y = sin(a) + 1.5 * sin(2. * a);
            c += point(p, vec2(x, y) * 0.5 * size);
        }
    }
    // c += point(p, vec2(0)) * 15.;
    return c;
}

void main( void ) {
    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    vec4 c = vec4(0);
    float size = 0.7;

    float t = time * SPEED;

    float zoom = sin(fract(t) * PI);
    p = rotate2D(p, pow(fract(t) * 2. - 1., 3.) * 2. * PI * sign(fract(t) - 0.5));
    p /= zoom;

    if (mod(time, 2./SPEED) < 1. / SPEED) {
        c = react(p, 0.7) * vec4(0, 1, 1, 1);
    }
    else {
        p = rotate2D(p, 0.5);
        c = redux(p, 0.6) * vec4(1, 0, 1, 1);
    }

    vec4 b = texture2D(backBuffer, gl_FragCoord.xy);
    gl_FragColor = c * 0.5 + b * 0.7;
}
