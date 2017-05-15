#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#pragma glslify: rotate2D = require(./utils/rotate2d.frag)
#define PI 3.141592653

float circle(in vec2 p, in vec2 center, in float size) {
	return 1. - smoothstep(size, size+ 0.01, length(p - center));
}

void main(void) {
	vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y) ;
	float t = time * 1.25;
	float s = 0.8;

	float zoom = floor(mod(t, 4.) + 1.);
	p = mod(p * zoom * zoom + 1., 2.) - 1.;

	float mask = 1. - circle(p, vec2(0) * s, 1. * s);

	float a = pow((1. - fract(t)), 3.) * 2. * PI;
	p /= s;

	float c = 0.;
	c += circle(p, vec2(0), 1.);

	p = rotate2D(p, a);
	p -= vec2(0, 0.2);
	p /= s;
	c -= circle(p, vec2(0), 1.);

	p = rotate2D(p, a);
	p -= vec2(0, 0.2);
	p /= s;
	c += circle(p, vec2(0), 1.);

	// p = rotate2D(p, -2.*a/s/s);
	p = rotate2D(p, a);
	p += vec2(0, 0.2);
	p /= s;
	c -= circle(p, vec2(0), 1.);

	c = c - mask;
	c = 1. - c;

	gl_FragColor = vec4(vec3(c), 1.0);
}
