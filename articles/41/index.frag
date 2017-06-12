precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
const float PI = 3.1415926535897932384626433;
#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: camera = require('glsl-camera-ray')
vec2 map(vec3 p);
#pragma glslify: raytrace = require('glsl-raytrace', map = map, steps = 128)
#pragma glslify: getNormal = require('glsl-sdf-normal', map = map)
#pragma glslify: hsv2rgb = require('glsl-hsv2rgb')

#pragma glslify: rotate2D = require('../utils/rotate2d')
#define NUM 1.

vec2 opU(in vec2 a, in vec2 b) {
    return a.x < b.x ? a : b;
}

float t() {
    return time * 2.5;
}

vec2 row(vec3 p) {
    float n = 5. + sin(time) * 4.;
    vec3 pp = mod(p, n) - n * .5;
    pp.y = 0.;
    pp.z = mod(p.z, 10.) - 5.;
    return vec2(length(max(abs(pp) - .2, .0)), 0.);
}

vec2 column(vec3 p) {
    float n = 5. + cos(time) * 4.;
    vec3 pp = mod(p, n) - n * .5;
    pp.x = 0.;
    pp.z = mod(p.z, 10.) - 5.;
    return vec2(length(max(abs(pp) - .2, .0)), 0.);
}

vec2 map(vec3 p) {
    float zz = floor(p.z / 10.);
    p.xy = rotate2D(p.xy, sin(zz + time) * PI * .41);
    return opU(row(p), column(p));
}

void main (void) {
    vec3 rayOrigin = vec3(0, 0, 0);
    vec3 rayTarget = vec3(0, 0, -9999999.);
    rayOrigin.z = -t() * 8.;

    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    vec3 rayDirection = camera(rayOrigin, rayTarget, square(resolution), 2.);
    float l = pow(length(p), 2.);
    rayDirection.z *= 1. - l * .5;

    vec3 lightDir = normalize(vec3(0, 2, 1.));
    vec3 light = vec3(.7);
    vec3 ambient = vec3(.3, .4, .5);

    vec2 collision = raytrace(rayOrigin, rayDirection, 300., 0.001, .8);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = getNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0., 1.0);
        vec3 c = diff * light + ambient;

        float d = length(rayOrigin - pos);
        c *= d * .02;
        gl_FragColor = vec4(c * vec3(0.2, 1., 0.8), 1.0);
    }
    else {
        float c = 1. - length(gl_FragCoord.xy / resolution.xy - 0.5);
        gl_FragColor = vec4(c, c, c, 1);
    }
}
