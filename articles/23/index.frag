#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NUM 8.

void main (void) {
    vec2 p =  (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    const float r3 = sqrt(3.);

    // Triangles
    vec2 pp = p;
    pp = vec2(mod(p.x * NUM, 1.), mod(p.y * NUM, 0.5 * r3));  // Tile of (1, 0.5 * r3)
    pp.x -= fract(floor(p.y * NUM / r3 * 2.) * -3.5 * cos(mod(time, 3.141592)));

    float c = (
        sign(mod(pp.y - pp.x * r3, 2. * r3) - r3) *
        sign(mod(pp.y + (pp.x) * r3, 2. * r3) - r3)
    );

    gl_FragColor = vec4(c, c * 0.4, 0, 1.);
}
