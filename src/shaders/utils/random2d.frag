// https://thebookofshaders.com/10
float random2d(in vec2 pos){
    return fract(sin(dot(pos, vec2(12.9898,78.233)))* 43758.5453123);
}

#pragma glslify: export(random2d)
