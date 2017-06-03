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

float sdHole(in vec3 p) {
    float t = time * 2. + p.z * 0.2;
    vec2 center = vec2(cos(t), sin(t)) * 2.;
    return 4. - length(p.xy - center);
}

vec2 map(vec3 p) {
    return vec2(sdHole(p), 0.);
}

void main (void) {
    vec3 rayOrigin = vec3(0, 0, 3.);
    vec3 rayTarget = vec3(0, 0, 0);
    vec3 rayDirection = camera(rayOrigin, rayTarget, square(resolution.xy), 1.);

    vec2 collision = raytrace(rayOrigin, rayDirection);

    if (collision.x > 0.) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        float angle = atan(pos.y, pos.x);

        float c = step(0., sin(pos.z * 10.) * sin(angle * 10.));
        c *= 5. / abs(pos.z - 2.);

        gl_FragColor = vec4(c, 0.4, c, 1.0);
    }
    else {
        gl_FragColor = vec4(0, 0.4, 0, 1);
    }
}
