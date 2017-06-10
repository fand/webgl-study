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

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

float sdCappedCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float opS( float d1, float d2 )
{
    return max(-d1,d2);
}

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
        sdCappedCylinder(p, vec2(r, 0.001)),
        -sdCappedCylinder(p, vec2(r - width, 9999.))
    );
}
float sdRing(in vec3 p, in float r, in float width) {
    float hw = width * 0.5;
    return max(
        sdCappedCylinder(p, vec2(r, hw)),
        -sdCappedCylinder(p, vec2(r - 0.001, 9999.))
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
        sdCappedCylinder(_p, vec2(0.2, 0.05))
    );

    return vec2(
        min(rings, plates),
        0.0
    );
}

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

void main (void) {
    // Bootstrap
    vec3 rayOrigin = vec3(0, 0.3, 2.5);
    vec3 rayTarget = vec3(0, 0, 0);
    vec2 screenPos = squareFrame(resolution.xy);

    float lensLength = 2.0;
    vec3 rayDirection = getRay(rayOrigin, rayTarget, screenPos, lensLength);

    vec3 lightDir = vec3(0, 0, 0.577);
    lightDir.x = cos(time * PI) * (sqrt(3.) * 2. / 3.);
    lightDir.y = sin(time * PI) * (sqrt(3.) * 2. / 3.);
    vec3 light = vec3(0.9, 0.7, 0.8);
    vec3 ambient = vec3(0, 0.3, 0.3);

    vec2 collision = calcRayIntersection(rayOrigin, rayDirection);

    // If the ray collides, draw the surface
    if (collision.x > -0.5) {
        // Determine the point of collision
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = calcNormal(pos);

        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(diff * light + ambient, 1.0);
    }
    else {
        gl_FragColor = vec4(0);
    }
}
