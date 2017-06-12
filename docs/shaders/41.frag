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
    return time * 2.5;
}

vec2 row(vec3 p) {
    float n = 5. + sin(time) * 4.;
    vec3 pp = mod(p, n) - n * .5;
    pp.y = 0.;
    pp.z = mod(p.z, 10.) - 5.;
    return vec2(length(max(abs(pp) - .2, .0)), 0.);
}

vec2 column(vec3 p) {
    float n = 5. + cos(time) * 4.;
    vec3 pp = mod(p, n) - n * .5;
    pp.x = 0.;
    pp.z = mod(p.z, 10.) - 5.;
    return vec2(length(max(abs(pp) - .2, .0)), 0.);
}

vec2 map(vec3 p) {
    float zz = floor(p.z / 10.);
    p.xy = rotate(p.xy, sin(zz + time) * PI * .4);
    return opU(row(p), column(p));
}

void main (void) {
    vec3 rayOrigin = vec3(0, 0, 0);
    vec3 rayTarget = vec3(0, 0, -9999999.);
    rayOrigin.z = -t() * 8.;

    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    vec3 rayDirection = getRay(rayOrigin, rayTarget, squareFrame(resolution), 2.);
    float l = pow(length(p), 2.);
    rayDirection.z *= 1. - l * .5;

    vec3 lightDir = normalize(vec3(0, 2, 1.));
    vec3 light = vec3(.7);
    vec3 ambient = vec3(.3, .4, .5);

    vec2 collision = calcRayIntersection(rayOrigin, rayDirection, 300., 0.001, .8);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = calcNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0., 1.0);
        vec3 c = diff * light + ambient;

        float d = length(rayOrigin - pos);
        c *= d * .02;
        gl_FragColor = vec4(c * vec3(0.2, 1., 0.8), 1.0);
    }
    else {
        float c = 1. - length(gl_FragCoord.xy / resolution.xy - 0.5);
        gl_FragColor = vec4(c, c, c, 1);
    }
}
