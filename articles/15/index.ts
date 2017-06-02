declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 15,
    date: 'Thu May 11 11:50:19 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
