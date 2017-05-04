// from https://thebookofshaders.com/05/
float plot(in vec2 pos, in float y){
    return (
        smoothstep(y - 0.01, y, pos.y) -
        smoothstep(y, y + 0.01, pos.y)
    );
}

#pragma glslify: export(plot)
