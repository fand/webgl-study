declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 22,
    date: 'Mon May 15 22:01:16 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
