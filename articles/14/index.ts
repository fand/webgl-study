declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 14,
    date: 'Thu May 11 11:06:25 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag')
});
