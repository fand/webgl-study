precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
const float PI = 3.1415926535897932384626433;
#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: camera = require('glsl-camera-ray')
vec2 map(vec3 p);
#pragma glslify: raytrace = require('glsl-raytrace', map = map, steps = 30)
#pragma glslify: getNormal = require('glsl-sdf-normal', map = map)
#pragma glslify: hsv2rgb = require('glsl-hsv2rgb')
#pragma glslify: rotate2D = require('../utils/rotate2d')
#define NUM 1.

float t() {
    return time * .3;
}

float smoothMin(float d1, float d2, float k){
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

vec2 sdSpheres(in vec3 p) {
    vec3 c1 = vec3(0);
    float d1 = length(p - c1) - 2.4;

    float d = 9999.;

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float ti = (1. - pow(1. - fract((t() + fi * .2)), 1.5)) * 8.;

        vec3 u = vec3(rotate2D(vec2(1, 0), (fi + 1.) * .7 * PI), 0);
        u.xy = rotate2D(u.xy, (fi + 1.) * .3);
        u.xz = rotate2D(u.xz, (fi * 2. + 1.) * 1.9);
        vec3 c2 = u * ti;
        float d2 = length(p - c2) - .7;

        float a1 = max(dot(normalize(p - c1), normalize(c2 - c1)), 0.);
        float a2 = max(dot(normalize(p - c2), normalize(c1 - c2)), 0.);

        d = smoothMin(
            d,
            smoothMin(
                d1 * (1.1 - pow(a1, 20.)),
                d2 * (1.1 - pow(a2, 20.)),
                2.2
            ),
            2.5
        );

        for (int j = 0; j < 3; j++) {
            float fj = float(j);
            float tj = (1. - pow(1. - max(ti - 5. + fj * .8, 0.) / 3., 3.)) * 4.;

            vec3 uj = vec3(rotate2D(vec2(1, 0), (fj + 1.) * .4 * PI + 1.5 * PI), 0);
            uj.xy = rotate2D(uj.xy, (fi + 1.) * 1.3);
            uj.xz = rotate2D(uj.xz, (fi * 3. + 1.) * .9);

            vec3 cj = c2 + uj * tj;
            float dj = length(p - cj) - .3;

            float aj1 = max(dot(normalize(p - c2), normalize(cj - c2)), 0.);
            float aj2 = max(dot(normalize(p - cj), normalize(c2 - cj)), 0.);

            d = smoothMin(
                d,
                smoothMin(
                    d2 * (1.1 - pow(aj1, 10.)),
                    dj * (1.1 - pow(aj2, 10.)),
                    4.3
                ),
                3.6
            );
        }
    }

    return vec2(d, 0);
}

vec2 map(vec3 p) {
    return sdSpheres(p);
}

void main (void) {
    vec3 rayOrigin = vec3(0, 5, 10);
    rayOrigin.xy = rotate2D(rayOrigin.xy, t() * 2.7);
    rayOrigin.z = sin(t() * 1.) * 3. + 10.;

    vec3 rayTarget = vec3(0, 0, 0);
    vec3 rayDirection = camera(rayOrigin, rayTarget, square(resolution.xy), 1.);

    vec3 lightDir = normalize(vec3(0, 2, 1.));
    vec3 light = vec3(.4, .2, .4) * 1.6;
    vec3 ambient = vec3(-.3, 0, -.1);

    vec2 collision = raytrace(rayOrigin, rayDirection, 20., 0.001, .8);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = getNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0., 1.0);
        vec3 c = diff * light + ambient;
        gl_FragColor = vec4(c, 1.0);
    }
    else {
        float c = 1. - length(gl_FragCoord.xy / resolution.xy - 0.5);
        gl_FragColor = vec4(c * vec3(0.7, 0.8, 1.), 1);
    }
}
