var Twit = require('twit')
const Uwuifier = require('uwuifier');
const config = require('./config.json');
let track = config.track;

//console.log(`Tracking the following IDs:\n${track}`);

var T = new Twit({
  consumer_key:         'hb2MHqthzb0noakYX8PTv6kJB',
  consumer_secret:      'sPdLgS1iSVlkU8CAmRKVMK1af6eKW71FsxMd5HtdCI5A4NpyuO',
  access_token:         '1382813603867295746-wHFsvr0Qnaic9qJkaj2RtfkUJDXwdh',
  access_token_secret:  '8wuDO2ATZhtmJUTDvLMecQGR7raUD0SXtK8EqxDqnAchd',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

const uwuify = new Uwuifier({
    spaces: {
      faces: 0.01,
      actions: 0.004,
      stutters: 0.1,
    },
    words: 0.8,
    exclamations: 0.5,
  });

var stream = T.stream('statuses/filter', {follow: [track]})

stream.on('tweet', function (tweet) {

  //IF YOU WANT TO UWUIFY ONLY TWEETS AND NO REPLIES ETC PLS UNCOMMENT THE LINE BELOW
  //if(tweet.retweeted || tweet.retweeted_status || tweet.in_reply_to_status_id || tweet.in_reply_to_user_id || tweet.delete) { return; }

  //console.log(`${tweet.user.screen_name} tweeted:\n${tweet.text}`);
  if(!track.includes(tweet.user.id_str)){ /*console.error(`ID: ${tweet.user.id_str} does not match those of the tracked users.`);*/ return; } else {
    //console.log(`In respond to tweet ID  \n ${tweet.id_str}`);
    var tweetText = tweet.text.replace(/\B@\w+/g, '');
    //console.log(`Original tweet:\n ${tweetText}`);
    if(tweetText.match(/(\w+)/g).length < 3){ /*console.error(`Tweet is too short. Would result in bad results`);*/ return; }
    var uwu = uwuify.uwuifySentence(tweetText)
    //console.log(`UWU tweet: \n${tweetText}`);
    var tweetId = tweet.id_str;
    //console.log(tweetId);
    T.post('statuses/update',
        {
            in_reply_to_status_id: tweet.id_str,
            status: uwu,
            auto_populate_reply_metadata: true
        }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(`Successfully tweeted: \n${data.text}`);
        }
    })
  }
});

