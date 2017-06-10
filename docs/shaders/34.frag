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

vec2 calcRayIntersection(vec3 rayOrigin, vec3 rayDir, float maxd, float precis, float reduction) {
  float latest = precis * 2.0;
  float dist   = +0.0;
  float type   = -1.0;
  vec2  res    = vec2(-1.0, -1.0);

  for (int i = 0; i < 90; i++) {
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
    vec3 rayDirection = getRay(rayOrigin, rayTarget, squareFrame(resolution.xy), 1.);

    vec2 collision = calcRayIntersection(rayOrigin, rayDirection);

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
