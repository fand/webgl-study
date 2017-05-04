#pragma glslify: rect = require(./rect.frag)
#pragma glslify: plot = require(./plot.frag)

float line(in vec2 pos, in vec2 from, in vec2 to){
    float a = abs(distance(pos, from));
    float b = abs(distance(pos, to));
    float c = abs(distance(from, to));

    return 1.0 - smoothstep(0., 0.0001, a + b - c);
}

#pragma glslify: export(line)
