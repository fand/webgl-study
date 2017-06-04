precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
const float PI = 3.14159265;
#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: camera = require('glsl-camera-ray')
vec2 map(vec3 p);
#pragma glslify: raytrace = require('glsl-raytrace', map = map, steps = 256)
#pragma glslify: getNormal = require('glsl-sdf-normal', map = map)
#define NUM 1.


vec2 opU(in vec2 a, in vec2 b) {
    return a.x < b.x ? a : b;
}

float t() {
    return time * 7.;
}

float random(in vec2 p) {
    return fract(sin(dot(p.xy, vec2(12.34, 56.78))) * 90.0);
}

vec2 sdHole(in vec3 p) {
    return vec2(
        min(-abs(p.x) + 6., -abs(p.y + p.z) + 14.),
        1.
    );
}

vec2 sdSteps(in vec3 p) {
    vec3 pp = mod(p, .2) - .1;
    pp.y = p.y;
    pp.x = 0.;
    pp.y = p.y + floor(p.z) + 2.;

    return vec2(
        length(max(abs(pp) - 1.033, .0)),
        0.
    );
}

vec2 map(vec3 p) {
    return opU(sdHole(p), sdSteps(p));
}

void main (void) {
    vec3 rayOrigin = vec3(0, 4, 0);
    rayOrigin.z = -t();
    rayOrigin.y = t() + 7.;
    vec3 rayTarget = vec3(0, 59999., -99999.);
    vec3 rayDirection = camera(rayOrigin, rayTarget, square(resolution.xy), 1.);

    vec3 lightDir = normalize(vec3(.1, .3, -.2));
    vec3 light = vec3(.7);
    vec3 ambient = vec3(.2, .3, .4);

    vec2 collision = raytrace(rayOrigin, rayDirection, 70. * 1.41421356, 0.0001, .1);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = getNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0., 1.0);
        vec3 c = diff * light + ambient;
        c *= pow(3./-(pos.z), .7) * .8 + .3;// darken
        c += (pos.y - t() - 10.) * .015;// grow

        if (collision.y > .5) {
            float i = 20.;
            float a = atan(pos.y+pos.z, pos.x) * 2.;
            a *= step(0., sin(floor(pos.z - .5))) * 2. - 1.;
            c.gb += max(.001 / pow(abs(mod(-pos.z, i) - i * .7), 3.), 0.) * max(sin(a +pos.z + t()), 0.) * 2.;
        }
        else {
            c.r = 0.;
        }

        gl_FragColor = vec4(c, 1.0);
    }
    else {
        float c = gl_FragCoord.y / resolution.y;
        gl_FragColor = vec4(.9, 1, 1, 1);
    }
}
