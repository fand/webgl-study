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
    return time * .3;
}

float stair(in float x) {
    return (cos(x) * .5 + .5) * (1. - step(1., mod(x / PI, 9.)));
}

vec2 sdCubes(in vec3 p) {
    vec3 p2 = p;

    p2.xz = rotate2D(p.xz, .6);

    float t1 = stair(t() * 10. + floor(p2.x + 3.));
    p2.yz = rotate2D(p2.yz, t1 * -PI);

    float t2 = stair(t() * 10. + floor(p2.z + 3.) + 3. * PI);
    p2.xy = rotate2D(p2.xy, t2 * PI);

    float t3 = stair(t() * 10. + floor(p2.y + 3.) + 6. * PI);
    p2.xz = rotate2D(p2.xz, t3 * 2. * PI);

    // Twist each cubes
    vec3 pp = mod(p2, 1.) - .5;
    pp.xy = rotate2D(pp.xy, floor((p2.z + 20.)) * t() * .2);
    pp.xz = rotate2D(pp.xz, floor((p2.y + 20.)) * t() * .2);

    return vec2(
        max(
            length(max(abs(p2) - 3., .0)),
            length(max(abs(pp) - .2, .0)) - .1
        ),
        (t1 + t2 + t3) + 1.
    );
}

vec2 sdFloor(in vec3 p) {
    return vec2(p.y + p.z + 10., 0.);
}

vec2 map(vec3 p) {
    return opU(sdCubes(p), sdFloor(p));
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
    vec3 rayOrigin = vec3(0, 9, 18);
    vec3 rayTarget = vec3(0, 0, 3);
    vec3 rayDirection = camera(rayOrigin, rayTarget, square(resolution.xy), 2.5);

    vec3 lightDir = normalize(vec3(0, 2, 1.));
    vec3 light = vec3(.7);
    vec3 ambient = vec3(.3, .4, .5);

    vec2 collision = raytrace(rayOrigin, rayDirection, 40., 0.001, .5);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = getNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0., 1.0);
        vec3 c = diff * light + ambient;

        if (collision.y > .5) {
            float hue = collision.y - 1.;
            c *= hsv2rgb(vec3(fract(t() + hue), .4, 1));
        }
        else {
            float shadow = genShadow(pos + normal * 0.001, lightDir);

            c *= min(5. / -(pos.z - 10.), 1.) * shadow;
        }

        gl_FragColor = vec4(c, 1.0);
    }
    else {
        float c = gl_FragCoord.y / resolution.y;
        gl_FragColor = vec4(0, 0, 0, 1);
    }
}
