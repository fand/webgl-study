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
    return time * 1.2;
}

vec2 sdBuildings(in vec3 p) {
    vec3 p1 = mod(p, 4.5) - 2.25;
    p1.y = p.y * .14;
    // float building = length(max(abs(p1) - .7 * mod(t(), 2.), .0));
    float building = length(max(abs(p1) - mod(t() * .2, 2.), .0));

    vec3 p2 = mod(p, .5) - .25;
    p2.y *= 2.;
    // float windows = length(max(abs(p2) - .15, .0));
    float windows = length(max(abs(p2) - mod(t() * .3, .5), .0));

    return vec2(
        max(building, -windows + .01),
        0.
    );
}

vec2 sdFloors(in vec3 p) {
    return vec2(p.y + 1.5, 0.);
}

vec2 map(vec3 p) {
    return opU(sdBuildings(p), sdFloors(p));
}

void main (void) {
    vec3 rayOrigin = vec3(0, 2, 0);
    vec3 rayTarget = vec3(0, 0, -9999999.);
    // rayOrigin.x += sin(t());
    // rayOrigin.y += cos(t() +.8) * .5 + sin(t() * .3) * .5;
    rayOrigin.z += -t() * 2.;

    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    vec3 rayDirection = camera(rayOrigin, rayTarget, square(resolution), 1.5);
    // rayDirection.xy = rotate2D(rayDirection.xy, sin(t() + 2.4) * .2);

    float l = pow(length(p), 2.);
    rayDirection.z *= 1. - l * .2   ;

    vec3 lightDir = normalize(vec3(0, 2, 1.));
    vec3 light = vec3(.7);
    vec3 ambient = vec3(.3, .4, .5);

    vec2 collision = raytrace(rayOrigin, rayDirection, 30., 0.0001, .9);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = getNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0., 2.0);
        vec3 c = diff * light + ambient;

        float dd = 0.03;
        float edge = clamp((
            max(0., (1. - abs(dot(normal, getNormal(vec3(pos.x + dd, pos.y, pos.z)))))) +
            max(0., (1. - abs(dot(normal, getNormal(vec3(pos.x, pos.y + dd, pos.z)))))) +
            max(0., (1. - abs(dot(normal, getNormal(vec3(pos.x, pos.y, pos.z + dd)))))) +
            max(0., (1. - abs(dot(normal, getNormal(vec3(pos.x - dd, pos.y, pos.z)))))) +
            max(0., (1. - abs(dot(normal, getNormal(vec3(pos.x, pos.y - dd, pos.z)))))) +
            max(0., (1. - abs(dot(normal, getNormal(vec3(pos.x, pos.y, pos.z - dd))))))
        ), 0., 1.);
        c += edge * 10.;

        float d = length(rayOrigin - pos);
        c *= d * .03;

        gl_FragColor = vec4(c * vec3(0.2, 1., 0.8), 1.0);
    }
    else {
        vec3 c = vec3(1) - length(gl_FragCoord.xy / resolution.xy - 0.5) * vec3(0, 1, .3) * .7;
        gl_FragColor = vec4(c, 1);
    }
}
