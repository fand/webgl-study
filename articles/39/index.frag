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
    return time * .5;
}

float smoothMin(float d1, float d2, float k){
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

vec2 sdSpheres(in vec3 p) {
    vec3 pp = p;
    pp.xy = rotate2D(pp.xy, t());
    pp.xz = rotate2D(pp.xz, t());

    float d = length(p) - 1.;

    for (int i = 0; i < 8; i++) {
        vec3 p1 = pp;
        float fi = float(i);
        p1.xy = rotate2D(p1.xy, fi);
        p1.xz = rotate2D(p1.xz, fi + 1.);
        p1.yz = rotate2D(p1.yz, fi + 3.);

        p1.y -= sin(t() + float(i) * 13. * PI + float(i) * 2.) * 5.;

        d = smoothMin(d, length(p1) - .5, 2.);
    }

    return vec2(d, 0);
}

vec2 map(vec3 p) {
    return sdSpheres(p);
}

float genShadow(vec3 ro, vec3 rd){
    float h = 0.0;
    float c = 0.001;
    float r = 1.0;
    float shadowCoef = 0.5;
    for(float t = 0.0; t < 40.0; t++){
        h = map(ro + rd * c).x;
        if (h < 0.001){
            return shadowCoef;
        }
        r = min(r, h * 24.0 / c);
        c += h;
    }
    return 1.0 - shadowCoef + r * shadowCoef;
}

void main (void) {
    vec3 rayOrigin = vec3(0, 5, 10);
    vec3 rayTarget = vec3(0, 0, 0);
    vec3 rayDirection = camera(rayOrigin, rayTarget, square(resolution.xy), 2.);

    vec3 lightDir = normalize(vec3(0, 2, 1.));
    vec3 light = vec3(.7);
    vec3 ambient = vec3(.3, .4, .5);

    vec2 collision = raytrace(rayOrigin, rayDirection, 20., 0.001, .8);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = getNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0., 1.0);
        vec3 c = diff * light + ambient;
        gl_FragColor = vec4(c * vec3(0.2, 1., 0.8), 1.0);
    }
    else {
        float c = 1. - length(gl_FragCoord.xy / resolution.xy - 0.5);
        gl_FragColor = vec4(c * vec3(1., 0.7, 0.8), 1);
    }
}
