precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
const float PI = 3.14159265;
#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: camera = require('glsl-camera-ray')
vec2 map(vec3 p);
#pragma glslify: raytrace = require('glsl-raytrace', map = map, steps = 90)
#pragma glslify: getNormal = require('glsl-sdf-normal', map = map)
#define NUM 1.
float t() {
    return time * 1.;
}

float random(in vec2 p) {
    return fract(sin(dot(p.xy, vec2(12.34, 56.78))) * 90.0);
}

float sdGround(in vec3 p) {
    return p.y;
}

float sdBuildings(in vec3 p) {
    vec3 pp = mod(p, 1.) - .5;
    float height = random(p.xz - mod(p.xz, 1.));
    float ratio = 7. * height * (1. / ((floor(p.z) - t()) * 0.2 + 1.));
    pp.y = (p.y / ratio) - .2;
    return length(max(abs(pp) - .25, .0));
}

vec2 map(vec3 p) {
    return vec2(min(sdGround(p), sdBuildings(p)), 0.);
    return vec2(sdBuildings(p), 0.);
}

void main (void) {
    vec3 rayOrigin = vec3(0, 1.5, 0);
    rayOrigin.x += (sin(t() * .7) + cos(t() * .67)) * 0.07;
    rayOrigin.y += (sin(t() * .81) + cos(t() * .8)) * 0.1;
    vec3 rayTarget = vec3(0, 2, 9999999.);
    rayOrigin.z = t();
    vec3 rayDirection = camera(rayOrigin, rayTarget, square(resolution.xy), 2.);

    vec3 lightDir = normalize(vec3(0.3, 3., 2.));
    vec3 light = vec3(.4);
    vec3 ambient = vec3(.4, .3, .5);

    vec2 collision = raytrace(rayOrigin, rayDirection);
    if (collision.x > 0.) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = getNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(diff * light + ambient * 1./pos.y, 1.0);
    }
    else {
        float c = gl_FragCoord.y / resolution.y;
        gl_FragColor = vec4(c * 0.2, 0, c * 0.3, 1);
    }
}
