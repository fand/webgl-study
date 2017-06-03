declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 17,
    date: 'Fri May 12 23:09:49 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
