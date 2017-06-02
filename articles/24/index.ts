declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 24,
    date: 'Thu May 18 13:15:24 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
