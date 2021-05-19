const {google} = require('googleapis')
const 
const xoauth2 = require('xoauth2')
const CLIENT_ID="297551544807-c5742gvpe908vi340i51hj0uajaqfup1.apps.googleusercontent.com"
const CLIENT_SECRET="jXFyPvcNSq1mBO6tasxbXZ7Z"
const REDIRECT_URI="https://developers.google.com/oauthplayground/"
const REFRESH_TOKEN="1//04sp-taOXjGzVCgYIARAAGAQSNgF-L9IrIQmftR3-QXxxaiJ7w2_P7TcWA0O3DHdYMYn0rE4F0hU5EWIxtsf2FlHJjRiO0jebFA"

const AuthString = xoauth2.createXOAuth2Generator({
    user:"mrrahulsingh80@gmai.com",
    clientId:CLIENT_ID,
    clientSecret:CLIENT_SECRET,
    refreshToken:REFRESH_TOKEN,
    accessToken:"ya29.a0AfH6SMC8msjuj20fSSNqPwggvkCJBBOvW4Uj31ztmiAESuYlN8wmrrrKY8pA7EnCfzkBKCjMgBnUk-1Ph4GtPN9jzYcSZPg4fNMET9NUZp_LwXF4LCz-M28H9mCE6YLBn7u2eBko4scchhf72v54Z893f3oh"

})
console.log(AuthString)