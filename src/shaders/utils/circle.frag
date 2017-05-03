// from https://thebookofshaders.com/07/
float circle(in vec2 pos, in vec2 center, in float radius){
    vec2 dist = pos - center;
	return 1.0 - smoothstep(
        radius - (radius * 0.03),
        radius + (radius * 0.03),
        dot(dist, dist) * 4.0
    );
}

#pragma glslify: export(circle)
