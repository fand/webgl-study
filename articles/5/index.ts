declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 5,
    date: 'Thu May 4 09:00:07 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
