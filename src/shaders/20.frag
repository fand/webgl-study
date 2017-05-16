#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

#pragma glslify: rotate2D = require(./utils/rotate2d.frag)

#define PI 3.14159265358979323846

float polygon(in vec2 p, in float n, in float size, in vec2 start) {
    float ls = length(start);
    float lp = length(p);

    float theta = acos(dot(normalize(p), normalize(start)));
    theta = mod(theta, 2. * PI / n);

    float a = theta + (n - 2.) * PI / n / 2.;
    float d = size * ls *(cos(theta) - cos(a) * sin(theta) / sin(a));

    return 1. - smoothstep(d, d + 0.01, length(p));
}

float polygonLine(in vec2 p, in float n, in float size, in vec2 start) {
    return polygon(p, n, size, start) - polygon(p, n, size, length(start) * 0.99 * normalize(start));
}

void main( void ) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float t = time * 0.7;
    float ti = floor(t);
    float tf = fract(t);

    float n = mod(ti, 4.) + 3.;

    float s = pow(cos(PI *  (tf - 0.5)), 0.3);
    float r = pow(tf * 2. - 1., 5.) * (step(0.5, tf) * 2. - 1.) * PI;

    vec2 center = vec2(0);
    vec2 start = rotate2D(vec2(0, 1), r);
    float size = 0.5 * s;
    float z = 0.4;

    float c = polygonLine(p, n, size, start);

    for (float i = 0.; i < 10.; i++) {
        if (i >= n) { break; }
        vec2 iStart = rotate2D(start, r * 1.5);
        vec2 iCenter = center + rotate2D(start * size, i * 2. * PI / n) * s * 1.2;
        float iSize = size * z;
        c += polygonLine(p - iCenter, n, iSize, iStart);

        for (float j = 0.; j < 10.; j++) {
            if (j >= n) { break; }
            vec2 jStart = rotate2D(iStart, r * 4.);
            vec2 jCenter = iCenter + rotate2D(iStart * iSize, j * 2. * PI / n) * s * 1.2;
            float jSize = iSize * z;
            c += polygonLine(p - jCenter, n, jSize, jStart);
        }
    }

    c *= 30.;

    gl_FragColor = vec4(0, c, c, 1.);
}
