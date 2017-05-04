float plasma(in vec2 pos, in float xnum, in float ynum){
    return sin(6.28 * pos.x * xnum) + sin(6.28 * pos.y * ynum);
}

#pragma glslify: export(plasma)
