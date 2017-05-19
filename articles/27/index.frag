precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const float PI = 3.14159265;
#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: camera = require('glsl-camera-ray')
#pragma glslify: sdTorus = require('glsl-sdf-primitives/sdTorus')

vec2 doModel(vec3 p) {
    // return vec2(sdTorus(p, vec2(0.5, 0.2)), 0.0);
    return vec2(sdTorus(mod(p, 4.) - 2., vec2(0.5, 0.2)), 0.0);
}

#pragma glslify: raytrace = require('glsl-raytrace', map = doModel, steps = 90)
#pragma glslify: getNormal = require('glsl-sdf-normal', map = doModel)

vec3 trans (vec3 p) {
    return mod(p, 4.0) - 2.0;
}

void main (void) {
    // Bootstrap
    float cameraAngle  = 0.8 * time;
    vec3  rayOrigin    = vec3(3.5 * sin(cameraAngle), 3.0, 3.5 * cos(cameraAngle));
    vec3  rayTarget    = vec3(0, 0, 0);
    vec2  screenPos    = square(resolution.xy);
    // screenPos = mod(screenPos, 4.0) - 2.0;
    float lensLength   = 2.0;
    vec3  rayDirection = camera(rayOrigin, rayTarget, screenPos, lensLength);

    vec3 lightDir = vec3(0, 0, 0.577);
    lightDir.x = cos(time * PI) * (sqrt(3.) * 2. / 3.);
    lightDir.y = sin(time * PI) * (sqrt(3.) * 2. / 3.);
    vec3 light = vec3(1., 0.3, 0.2);
    vec3 ambient = vec3(0, 0.3, 1.);

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
