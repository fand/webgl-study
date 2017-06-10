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

  for (int i = 0; i < 30; i++) {
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

float t() {
    return time * .3;
}

float smoothMin(float d1, float d2, float k){
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

vec2 sdSpheres(in vec3 p) {
    vec3 c1 = vec3(0);
    float d1 = length(p - c1) - 2.4;

    float d = 9999.;

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float ti = (1. - pow(1. - fract((t() + fi * .2)), 1.5)) * 8.;

        vec3 u = vec3(rotate(vec2(1, 0), (fi + 1.) * .7 * PI), 0);
        u.xy = rotate(u.xy, (fi + 1.) * .3);
        u.xz = rotate(u.xz, (fi * 2. + 1.) * 1.9);
        vec3 c2 = u * ti;
        float d2 = length(p - c2) - .7;

        float a1 = max(dot(normalize(p - c1), normalize(c2 - c1)), 0.);
        float a2 = max(dot(normalize(p - c2), normalize(c1 - c2)), 0.);

        d = smoothMin(
            d,
            smoothMin(
                d1 * (1.1 - pow(a1, 20.)),
                d2 * (1.1 - pow(a2, 20.)),
                2.2
            ),
            2.5
        );

        for (int j = 0; j < 3; j++) {
            float fj = float(j);
            float tj = (1. - pow(1. - max(ti - 5. + fj * .8, 0.) / 3., 3.)) * 4.;

            vec3 uj = vec3(rotate(vec2(1, 0), (fj + 1.) * .4 * PI + 1.5 * PI), 0);
            uj.xy = rotate(uj.xy, (fi + 1.) * 1.3);
            uj.xz = rotate(uj.xz, (fi * 3. + 1.) * .9);

            vec3 cj = c2 + uj * tj;
            float dj = length(p - cj) - .3;

            float aj1 = max(dot(normalize(p - c2), normalize(cj - c2)), 0.);
            float aj2 = max(dot(normalize(p - cj), normalize(c2 - cj)), 0.);

            d = smoothMin(
                d,
                smoothMin(
                    d2 * (1.1 - pow(aj1, 10.)),
                    dj * (1.1 - pow(aj2, 10.)),
                    4.3
                ),
                3.6
            );
        }
    }

    return vec2(d, 0);
}

vec2 map(vec3 p) {
    return sdSpheres(p);
}

void main (void) {
    vec3 rayOrigin = vec3(0, 5, 10);
    rayOrigin.xy = rotate(rayOrigin.xy, t() * 2.7);
    rayOrigin.z = sin(t() * 1.) * 3. + 10.;

    vec3 rayTarget = vec3(0, 0, 0);
    vec3 rayDirection = getRay(rayOrigin, rayTarget, squareFrame(resolution.xy), 1.);

    vec3 lightDir = normalize(vec3(0, 2, 1.));
    vec3 light = vec3(.4, .2, .4) * 1.6;
    vec3 ambient = vec3(-.3, 0, -.1);

    vec2 collision = calcRayIntersection(rayOrigin, rayDirection, 20., 0.001, .8);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = calcNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0., 1.0);
        vec3 c = diff * light + ambient;
        gl_FragColor = vec4(c, 1.0);
    }
    else {
        float c = 1. - length(gl_FragCoord.xy / resolution.xy - 0.5);
        gl_FragColor = vec4(c * vec3(0.7, 0.8, 1.), 1);
    }
}
