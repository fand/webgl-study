declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 7,
    date: 'Thu May 4 11:37:55 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
