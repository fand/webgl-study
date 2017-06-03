declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';

export default new ShaderArticle({
    id: 0,
    text: require('./README.md'),
    fragment: require('./index.frag'),
    date: '2017-05-02T14:57:33+0900',
});
