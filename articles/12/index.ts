declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 12,
    date: 'Tue May 9 23:37:09 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
