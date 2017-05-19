float rect(in vec2 pos, in vec2 begin, in vec2 end){
    return (
        smoothstep(begin.x - 0.001, begin.x, pos.x) *
        smoothstep(begin.y - 0.001, begin.y, pos.y) *
        smoothstep(end.x + 0.001, end.x, pos.x) *
        smoothstep(end.y + 0.001, end.y, pos.y)
    );
}

#pragma glslify: export(rect)
