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
    return time * .3;
}

float stair(in float x) {
    return (cos(x) * .5 + .5) * (1. - step(1., mod(x / PI, 9.)));
}

vec2 sdCubes(in vec3 p) {
    vec3 p2 = p;

    p2.xz = rotate(p.xz, .6);

    float t1 = stair(t() * 10. + floor(p2.x + 3.));
    p2.yz = rotate(p2.yz, t1 * -PI);

    float t2 = stair(t() * 10. + floor(p2.z + 3.) + 3. * PI);
    p2.xy = rotate(p2.xy, t2 * PI);

    float t3 = stair(t() * 10. + floor(p2.y + 3.) + 6. * PI);
    p2.xz = rotate(p2.xz, t3 * 2. * PI);

    // Twist each cubes
    vec3 pp = mod(p2, 1.) - .5;
    pp.xy = rotate(pp.xy, floor((p2.z + 20.)) * t() * .2);
    pp.xz = rotate(pp.xz, floor((p2.y + 20.)) * t() * .2);

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
    vec3 rayDirection = getRay(rayOrigin, rayTarget, squareFrame(resolution.xy), 2.5);

    vec3 lightDir = normalize(vec3(0, 2, 1.));
    vec3 light = vec3(.7);
    vec3 ambient = vec3(.3, .4, .5);

    vec2 collision = calcRayIntersection(rayOrigin, rayDirection, 40., 0.001, .5);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = calcNormal(pos);
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
