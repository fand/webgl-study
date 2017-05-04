#pragma glslify: rect = require(./rect.frag)
#pragma glslify: plot = require(./plot.frag)

float line(in vec2 pos, in vec2 from, in vec2 to){
    return rect(pos, from, to) * plot(pos, pos.x);
}

#pragma glslify: export(line)
