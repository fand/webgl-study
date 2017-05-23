precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const float PI = 3.14159265;
#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: camera = require('glsl-camera-ray')
#pragma glslify: sdTorus = require('glsl-sdf-primitives/sdTorus')
#pragma glslify: sdBox = require('glsl-sdf-primitives/sdBox')
#pragma glslify: sdCylinder = require('glsl-sdf-primitives/sdCappedCylinder')
#pragma glslify: opSub = require('glsl-sdf-ops/subtraction')

vec3 rotate(vec3 p, float angle, vec3 axis){
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}

float sdDisc(in vec3 p, in float r, in float width) {
    return max(
        sdCylinder(p, vec2(r, 0.001)),
        -sdCylinder(p, vec2(r - width, 9999.))
    );
}
float sdRing(in vec3 p, in float r, in float width) {
    float hw = width * 0.5;
    return max(
        sdCylinder(p, vec2(r, hw)),
        -sdCylinder(p, vec2(r - 0.001, 9999.))
    );
}

vec2 map(vec3 _p) {
    vec3 x = vec3(1, 0, 0);
    vec3 y = vec3(0, 1, 0);
    vec3 z = vec3(0, 0, 1);
    vec3 p = rotate(_p, 0.5 * PI, vec3(1, 0, 0));

    float rings = min(
        sdDisc(rotate(p, cos(time * 0.3) * 13., z), 1., 0.05),
        sdRing(rotate(rotate(p, sin(time * 0.2) * 5., z), time + 3., 0.4 * x + z), 1., 0.1)
    );

    rings = min(rings, min(
        sdDisc(rotate(p, cos(time * 0.4) * 8., z), 0.95, 0.05),
        sdRing(rotate(rotate(p, cos(time * 0.4) * 5. + 2., z), time + 3., 0.4 * x + z), 1., 0.1)
    ));

    rings = min(rings, min(
        sdDisc(rotate(p, cos(time * 0.4) * 8., z), 0.9, 0.05),
        sdRing(rotate(rotate(p, cos(time * 0.4) * 6. + 2., x), time + 3., 0.4 * x + z), 1., 0.1)
    ));

    vec3 p3 = rotate(p, time, z);
    vec3 p4 = rotate(p3, PI * 0.5, z);
    float plates = min(
        min(
            sdBox(vec3((p3.x + p3.y) * 0.5, p3.y, p3.z), vec3(0.25, 0.25, 0.001)),
            sdBox(vec3((p4.x + p4.y) * 0.5, p4.y, p4.z), vec3(0.25, 0.25, 0.001))
        ),
        sdCylinder(_p, vec2(0.2, 0.05))
    );

    return vec2(
        min(rings, plates),
        0.0
    );
}

#pragma glslify: raytrace = require('glsl-raytrace', map = map, steps = 90)
#pragma glslify: getNormal = require('glsl-sdf-normal', map = map)

void main (void) {
    // Bootstrap
    vec3 rayOrigin = vec3(0, 0.3, 2.5);
    vec3 rayTarget = vec3(0, 0, 0);
    vec2 screenPos = square(resolution.xy);

    float lensLength = 2.0;
    vec3 rayDirection = camera(rayOrigin, rayTarget, screenPos, lensLength);

    vec3 lightDir = vec3(0, 0, 0.577);
    lightDir.x = cos(time * PI) * (sqrt(3.) * 2. / 3.);
    lightDir.y = sin(time * PI) * (sqrt(3.) * 2. / 3.);
    vec3 light = vec3(0.9, 0.7, 0.8);
    vec3 ambient = vec3(0, 0.3, 0.3);

    vec2 collision = raytrace(rayOrigin, rayDirection);

    // If the ray collides, draw the surface
    if (collision.x > -0.5) {
        // Determine the point of collision
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = getNormal(pos);

        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(diff * light + ambient, 1.0);
    }
    else {
        gl_FragColor = vec4(0);
    }
}
