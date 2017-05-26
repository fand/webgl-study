#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

// from http://stackoverflow.com/questions/15276454
#define Thickness 0.001
float line(in vec2 uv, in vec2 p1, in vec2 p2) {
  float a = abs(distance(p1, uv));
  float b = abs(distance(p2, uv));
  float c = abs(distance(p1, p2));

  if (a >= c || b >= c) { return 0.0; }

  float p = (a + b + c) * 0.5;

  // median to (p1, p2) vector
  float h = 2. / c * sqrt(p * (p - a) * (p - b) * (p - c));

  return mix(1.0, 0.0, smoothstep(0.5 * Thickness, 1.5 * Thickness, h));
}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main (void) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    float r = line(position, vec2(0.3, 0.4), vec2(0.7, 0.8));
    gl_FragColor = vec4(r, 0, 0, 1.0);
}
