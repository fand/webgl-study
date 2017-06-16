precision mediump float;
#define GLSLIFY 1
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
const float PI = 3.1415926535897932384626433;
vec2 squareFrame(vec2 screenSize) {
  vec2 position = 2.0 * (gl_FragCoord.xy / screenSize.xy) - 1.0;
  position.x *= screenSize.x / screenSize.y;
  return position;
}

vec2 squareFrame(vec2 screenSize, vec2 coord) {
  vec2 position = 2.0 * (coord.xy / screenSize.xy) - 1.0;
  position.x *= screenSize.x / screenSize.y;
  return position;
}

mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
  vec3 rr = vec3(sin(roll), cos(roll), 0.0);
  vec3 ww = normalize(target - origin);
  vec3 uu = normalize(cross(ww, rr));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}

vec3 getRay(mat3 camMat, vec2 screenPos, float lensLength) {
  return normalize(camMat * vec3(screenPos, lensLength));
}

vec3 getRay(vec3 origin, vec3 target, vec2 screenPos, float lensLength) {
  mat3 camMat = calcLookAtMatrix(origin, target, 0.0);
  return getRay(camMat, screenPos, lensLength);
}

vec2 map(vec3 p);
// Originally sourced from https://www.shadertoy.com/view/ldfSWs
// Thank you Iñigo :)

vec2 calcRayIntersection(vec3 rayOrigin, vec3 rayDir, float maxd, float precis, float reduction) {
  float latest = precis * 2.0;
  float dist   = +0.0;
  float type   = -1.0;
  vec2  res    = vec2(-1.0, -1.0);

  for (int i = 0; i < 128; i++) {
    if (latest < precis || dist > maxd) break;

    vec2 result = map(rayOrigin + rayDir * dist);

    latest = result.x;
    type   = result.y;
    dist  += latest * reduction;
  }

  if (dist < maxd) {
    res = vec2(dist, type);
  }

  return res;
}

vec2 calcRayIntersection(vec3 rayOrigin, vec3 rayDir) {
  return calcRayIntersection(rayOrigin, rayDir, 20.0, 0.001, 1.0);
}

// Originally sourced from https://www.shadertoy.com/view/ldfSWs
// Thank you Iñigo :)

vec3 calcNormal(vec3 pos, float eps) {
  const vec3 v1 = vec3( 1.0,-1.0,-1.0);
  const vec3 v2 = vec3(-1.0,-1.0, 1.0);
  const vec3 v3 = vec3(-1.0, 1.0,-1.0);
  const vec3 v4 = vec3( 1.0, 1.0, 1.0);

  return normalize( v1 * map( pos + v1*eps ).x +
                    v2 * map( pos + v2*eps ).x +
                    v3 * map( pos + v3*eps ).x +
                    v4 * map( pos + v4*eps ).x );
}

vec3 calcNormal(vec3 pos) {
  return calcNormal(pos, 0.002);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 rotate(in vec2 v, in float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

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
    vec3 rayDirection = getRay(rayOrigin, rayTarget, squareFrame(resolution), 1.5);
    // rayDirection.xy = rotate2D(rayDirection.xy, sin(t() + 2.4) * .2);

    float l = pow(length(p), 2.);
    rayDirection.z *= 1. - l * .2   ;

    vec3 lightDir = normalize(vec3(0, 2, 1.));
    vec3 light = vec3(.7);
    vec3 ambient = vec3(.3, .4, .5);

    vec2 collision = calcRayIntersection(rayOrigin, rayDirection, 30., 0.0001, .9);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = calcNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0., 2.0);
        vec3 c = diff * light + ambient;

        float dd = 0.03;
        float edge = clamp((
            max(0., (1. - abs(dot(normal, calcNormal(vec3(pos.x + dd, pos.y, pos.z)))))) +
            max(0., (1. - abs(dot(normal, calcNormal(vec3(pos.x, pos.y + dd, pos.z)))))) +
            max(0., (1. - abs(dot(normal, calcNormal(vec3(pos.x, pos.y, pos.z + dd)))))) +
            max(0., (1. - abs(dot(normal, calcNormal(vec3(pos.x - dd, pos.y, pos.z)))))) +
            max(0., (1. - abs(dot(normal, calcNormal(vec3(pos.x, pos.y - dd, pos.z)))))) +
            max(0., (1. - abs(dot(normal, calcNormal(vec3(pos.x, pos.y, pos.z - dd))))))
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
