declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 11,
    date: 'Tue May 9 21:57:25 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
