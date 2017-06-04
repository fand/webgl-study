precision mediump float;
#define GLSLIFY 1
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
const float PI = 3.14159265;
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

vec2 calcRayIntersection(vec3 rayOrigin, vec3 rayDir, float maxd, float precis) {
  float latest = precis * 2.0;
  float dist   = +0.0;
  float type   = -1.0;
  vec2  res    = vec2(-1.0, -1.0);

  for (int i = 0; i < 256; i++) {
    if (latest < precis || dist > maxd) break;

    vec2 result = map(rayOrigin + rayDir * dist);

    latest = result.x;
    type   = result.y;
    dist  += latest * .1;
  }

  if (dist < maxd) {
    res = vec2(dist, type);
  }

  return res;
}

vec2 calcRayIntersection(vec3 rayOrigin, vec3 rayDir) {
  return calcRayIntersection(rayOrigin, rayDir, 20.0, 0.001);
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

#define NUM 1.
float t() {
    return time * 3.;
}

float random(in vec2 p) {
    return fract(sin(dot(p.xy, vec2(12.34, 56.78))) * 90.0);
}

float sdGround(in vec3 p) {
    return p.y;
}

float sdBuildings(in vec3 p) {
    vec3 pp = mod(p, 1.) - .5;
    float height = random(p.xz - mod(p.xz, 1.)) *3.;
    float nearness = max(floor(p.z) - t() - 2., 0.3);
    nearness = pow(nearness, .3);
    pp.y = p.y * 0.4 * nearness - height * 0.1;
    return length(max(abs(pp) - .25, .0));
}

vec2 map(vec3 p) {
    return vec2(min(sdGround(p), sdBuildings(p)), 0.);
}

void main (void) {
    vec3 rayOrigin = vec3(0, 1.5, 0);
    rayOrigin.x += (sin(t() * .7) + cos(t() * .67)) * 0.07;
    rayOrigin.y += (sin(t() * .81) + cos(t() * .8)) * 0.2;
    vec3 rayTarget = vec3(0, 2, 9999999.);
    rayOrigin.z = t();
    vec3 rayDirection = getRay(rayOrigin, rayTarget, squareFrame(resolution.xy), 2.);

    vec3 lightDir = normalize(vec3(0.3, 3., 2.));
    vec3 light = vec3(.4);
    vec3 ambient = vec3(.4, .3, .5);

    vec2 collision = calcRayIntersection(rayOrigin, rayDirection);
    if (collision.x > 0.) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = calcNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(diff * light + ambient * 1./pos.y, 1.0);
    }
    else {
        float c = gl_FragCoord.y / resolution.y;
        gl_FragColor = vec4(c * 0.2, 0, c * 0.3, 1);
    }
}
