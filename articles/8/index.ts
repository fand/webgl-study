declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 8,
    date: 'Thu May 4 15:46:51 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
