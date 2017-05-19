precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
#pragma glslify: rotate2D = require(../utils/rotate2d.frag)

const float PI = 3.14159265;

vec3 trans (vec3 p) {
    return mod(p, 4.0) - 2.0;
}

float sphere (in vec3 p, in float size) {
    return length(trans(p)) - size;
}

vec3 sphereNormal (in vec3 p, in float size) {
    float d = 0.0001;
    return normalize(vec3(
        sphere(p + vec3(  d, 0.0, 0.0), size) - sphere(p + vec3( -d, 0.0, 0.0), size),
        sphere(p + vec3(0.0,   d, 0.0), size) - sphere(p + vec3(0.0,  -d, 0.0), size),
        sphere(p + vec3(0.0, 0.0,   d), size) - sphere(p + vec3(0.0, 0.0,  -d), size)
    ));
}

void main (void) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    p = rotate2D(p, time * 0.25 * PI);

    vec3 cPos = vec3(0.0, 0.0, 2.0);
    cPos.z -= fract(time) * 4.;

    const float sphereSize = 1.0;
    const float fov = PI / 3. * 0.5;  // 60 degree * 0.5

    vec3 lightDir = vec3(0, 0, 0.577);
    lightDir.x = cos(time * PI) * (sqrt(3.) * 2. / 3.);
    lightDir.y = sin(time * PI) * (sqrt(3.) * 2. / 3.);
    vec3 light = vec3(1., 0.3, 0.2);
    vec3 ambient = vec3(0, 0.3, 1.);

    vec3 ray = normalize(vec3(
        sin(fov) * p.x,
        sin(fov) * p.y,
        -cos(fov)
    ));

    // marching loop
    float distance = 0.0;
    float rLen = 0.0;
    vec3  rPos = cPos;

    for (int i = 0; i < 64; i++) {
        distance = sphere(rPos, sphereSize);
        rLen += distance;
        rPos = cPos + ray * rLen;
    }

    // hit check
    if (abs(distance) < 0.001) {
        vec3 normal = sphereNormal(rPos, sphereSize);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(diff * light + ambient, 1.0);
    }
    else {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}
