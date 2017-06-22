precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
const float PI = 3.1415926535897932384626433;
#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: camera = require('glsl-camera-ray')
vec2 map(vec3 p);
#pragma glslify: raytrace = require('glsl-raytrace', map = map, steps = 90)
#pragma glslify: getNormal = require('glsl-sdf-normal', map = map)
#pragma glslify: hsv2rgb = require('glsl-hsv2rgb')
#pragma glslify: rotate2D = require('../utils/rotate2d')

float t() {
    return (time + 3.) * 1.;
}

float random (in float x) {
    return fract(sin(x *  13456.234));
}

float random (in vec2 p) {
    return fract(sin(dot(p, vec2(34556.,67892.))));
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = smoothstep(0., 1., f);
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec2 opU(in vec2 p, in vec2 q) {
    return p.x < q.x ? p : q;
}

vec2 sdBox(in vec3 p) {
    return vec2(
        length(max(abs(p) - 2., 0.0)),
        noise(vec2(noise(p.xy * p.z * .25 + sin(time * 2.)))) * .4
    );
}

vec2 sdSwirl(in vec3 p) {
    p.xy = rotate2D(p.xy, t());
    p.z = p.z * 1.2 -2.;

    float c = noise(vec2(noise(p.xy * .3), p.z * .3));

    // Random distortion
    p.x += noise(p.xy * 10.) * .03;
    p.y += noise(p.xy * 10. + .3) * .03;

    float d = 99999.;

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        vec3 pi = p;
        p.xy = rotate2D(p.xy, fi * PI * .5);


        pi.x *= clamp(1. - fi * random(fi * 4.) * .4, .3,.7);
        pi.y *= clamp(1. - fi * random(fi * 5.) * .4, .3,.7);

        pi.x += clamp((1. - fi * random(fi + 1.)) * .4 + fi * .3, .7, 1.7);
        pi.y += clamp((1. - fi * random(fi + 2.)) * .4 + fi * .3, .7, 1.7);
        pi.z -= (3. - fi) + fi * 2.0;

        pi *= 3.5;
        float di = min(
            pi.z + 2. - floor(abs(pi.y)),
            pi.z + 2. - floor(abs(pi.x))
            // -abs(p1.y) + 2. + floor(p1.z),
            // -abs(p1.x) + 2. + floor(p1.z)
        );

        di = max(di, -min(
            pi.z + 2. - floor(abs(pi.y * .7)),
            pi.z + 2. - floor(abs(pi.x * .7))
        ));

        // Create binding box
        float ti = clamp(mod(t(), 2.) - fi * .2, 0., 2.);
        float tt = floor(ti * 20.) * .1;
        di = max(di, length(max(abs(pi / 3.) - tt, 0.0)));

        d = min(d, di);
    }

    d -= .1;

    return vec2(d, c);
}

vec2 map(vec3 p) {
    p.yz = rotate2D(p.zy, .2 * PI + t());
    p.xy = rotate2D(p.xy, .2 * PI + t());
    vec2 v = sdBox(p);

    v = opU(v, sdSwirl(p));
    p.yz = rotate2D(p.yz, PI);
    v = opU(v, sdSwirl(p));

    return v;
}

void main (void) {
    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    vec3 color;

    vec3 rayOrigin = vec3(0., 0., 40.);
    rayOrigin.xz = rotate2D(rayOrigin.xz, t() * 1.0);

    vec3 rayTarget = vec3(0, 0, 0);
    vec3 rayDirection = camera(rayOrigin, rayTarget, square(resolution.xy), 2.);

    vec3 ambient = vec3(.4, .7, .5);
    vec3 lightDir1 = normalize(vec3(-1., 2.3, 10.));
    vec3 light1 = vec3(-.4, .7, 1.) * 1.2;
    vec3 lightDir2 = normalize(vec3(3.,  -3., 3.));
    vec3 light2 = vec3(.8, .8, 6.) * 1.2;

    vec3 lightDir3 = vec3(0, 0., 40.);
    vec3 light3 = vec3(.9, .3, .5) * .7;

    vec2 collision = raytrace(rayOrigin, rayDirection, 70., 0.0001, .3);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = normalize(getNormal(pos));

        vec3 c = ambient;

        float diff1 = clamp(dot(lightDir1, normal), 0., 1.0);
        float phong1 = pow(max(dot(reflect(lightDir1, normal), rayOrigin), 0.0), .8);
        c += light1 * diff1 + phong1 * 1.3;

        float diff2 = clamp(dot(lightDir2, normal), 0., 1.0);
        float phong2 = pow(max(dot(reflect(lightDir2, normal), rayOrigin), 0.0), .8);
        c += light2 * diff2 + phong2 * 1.3;

        float diff3 = clamp(dot(lightDir3, normal), 0., 1.0) * 9.9;
        float phong3 = pow(max(dot(reflect(lightDir3, normal), rayOrigin), 0.0), .3);
        c += light3 * diff3 + phong3;

        float d = length(rayOrigin - pos) + 1.;
        c *= 30. / (d * d);


        c += hsv2rgb(vec3(collision.y, 1, 1)) * .3;

        color = c;
    }
    else {
        float c = 1.5 - length(p *.5);
        color = vec3(c);
    }
    color += vec3(p.x * .1, p.y * .1, 1.);
    gl_FragColor = vec4(color, 1);
}
