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

vec2 doModel(vec3 p) {
    // return vec2(sdTorus(p, vec2(0.5, 0.2)), 0.0);
    return vec2(sdTorus(mod(p, 4.) - 2., vec2(0.5, 0.2)), 0.0);
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

    vec2 result = doModel(rayOrigin + rayDir * dist);

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

  return normalize( v1 * doModel( pos + v1*eps ).x +
                    v2 * doModel( pos + v2*eps ).x +
                    v3 * doModel( pos + v3*eps ).x +
                    v4 * doModel( pos + v4*eps ).x );
}

vec3 calcNormal(vec3 pos) {
  return calcNormal(pos, 0.002);
}

vec3 trans (vec3 p) {
    return mod(p, 4.0) - 2.0;
}

void main (void) {
    // Bootstrap
    float cameraAngle  = 0.8 * time;
    vec3  rayOrigin    = vec3(3.5 * sin(cameraAngle), 3.0, 3.5 * cos(cameraAngle));
    vec3  rayTarget    = vec3(0, 0, 0);
    vec2  screenPos    = squareFrame(resolution.xy);
    // screenPos = mod(screenPos, 4.0) - 2.0;
    float lensLength   = 2.0;
    vec3  rayDirection = getRay(rayOrigin, rayTarget, screenPos, lensLength);

    vec3 lightDir = vec3(0, 0, 0.577);
    lightDir.x = cos(time * PI) * (sqrt(3.) * 2. / 3.);
    lightDir.y = sin(time * PI) * (sqrt(3.) * 2. / 3.);
    vec3 light = vec3(1., 0.3, 0.2);
    vec3 ambient = vec3(0, 0.3, 1.);

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
